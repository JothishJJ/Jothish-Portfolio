import { treeify } from 'array-treeify';
import chalk from 'chalk';
import { formatDate, formatDuration } from './dates.js';
import { niceId } from './presenters.js';
import { arraifyCors, arrayifyFunction } from './resources-formatting.js';
export function formatTitle(title, name) {
    return `${chalk.bold.blue(title)} ${chalk.bold(`"${name}"`)}`;
}
export function formatResourceTree(resources) {
    if (!resources || resources.length === 0)
        return '  Zero resources';
    const output = [`${chalk.bold.underline('Resources')} [${resources.length}]`];
    const RESOURCE_CATEGORIES = [
        {
            label: 'Functions',
            match: (type) => type?.startsWith('sanity.function.'),
            name: (res) => {
                const name = chalk.bold.green(res.displayName || res.name || 'unnamed');
                const ids = [
                    'id' in res && res.id ? `${niceId(res.id)}` : '',
                    'externalId' in res && res.externalId ? `<${niceId(res.externalId)}>` : '',
                ].join(' ');
                return `${name} ${ids}`;
            },
            formatDetails: arrayifyFunction,
        },
        {
            label: 'CORS Origins',
            match: (type) => type === 'sanity.project.cors',
            name: (res) => {
                const name = chalk.bold.yellow(res.displayName || res.name || 'unnamed');
                const ids = [
                    'id' in res && res.id ? `${niceId(res.id)}` : '',
                    'externalId' in res && res.externalId ? `<${niceId(res.externalId)}>` : '',
                ].join(' ');
                return `${name} ${ids}`;
            },
            formatDetails: arraifyCors,
        },
    ];
    const categorized = {};
    const matchedIndices = new Set();
    for (const [i, resource] of resources.entries()) {
        for (const cat of RESOURCE_CATEGORIES) {
            if (cat.match(resource.type)) {
                if (!categorized[cat.label])
                    categorized[cat.label] = [];
                categorized[cat.label].push(resource);
                matchedIndices.add(i);
                break;
            }
        }
    }
    // unmatched resources are 'Other Resources'
    const otherResources = resources.filter((_, i) => !matchedIndices.has(i));
    if (otherResources.length > 0) {
        categorized['Other Resources'] = otherResources;
    }
    for (const category of RESOURCE_CATEGORIES) {
        const catResources = categorized[category.label];
        if (catResources && catResources.length > 0) {
            const catOutput = [`${chalk.bold(category.label)} [${catResources.length}]`];
            const details = [];
            for (const res of catResources) {
                details.push(category.name(res));
                if (category.formatDetails)
                    details.push(category.formatDetails(res));
            }
            catOutput.push(details);
            output.push(catOutput);
        }
    }
    if (categorized['Other Resources'] && categorized['Other Resources'].length > 0) {
        const otherOutput = [
            `${chalk.bold('Other Resources')} [${categorized['Other Resources'].length}]`,
        ];
        const otherResourcesOutput = categorized['Other Resources'].map((other) => {
            return `${chalk.yellow(other.displayName ?? other.name ?? 'unnamed')}`;
        });
        otherOutput.push(otherResourcesOutput);
        output.push(otherOutput);
    }
    return `${treeify(output)}\n`;
}
export function formatStackInfo(stack, isCurrentStack = false) {
    const isStack = 'id' in stack;
    const output = [];
    if (isStack) {
        const stackName = isCurrentStack ? chalk.bold.blue(stack.name) : chalk.bold(stack.name);
        output.push(`"${stackName}" ${niceId(stack.id)}${isCurrentStack ? ' (current)' : ''}`);
    }
    else {
        output.push('Local Blueprint');
    }
    const infoOutput = [];
    if (stack.resources) {
        infoOutput.push(`${stack.resources.length} resource${stack.resources.length === 1 ? '' : 's'}`);
    }
    else {
        infoOutput.push('No resources');
    }
    if (isStack) {
        if (stack.createdAt)
            infoOutput.push(`Created: ${formatDate(stack.createdAt)}`);
        if (stack.updatedAt)
            infoOutput.push(`Updated: ${formatDate(stack.updatedAt)}`);
        if (stack.recentOperation) {
            const operation = stack.recentOperation;
            const operationOutput = [];
            if (operation.id)
                operationOutput.push(`Recent Operation ${niceId(operation.id)}:`);
            if (operation.status) {
                const operationColor = operation.status === 'COMPLETED' ? chalk.green : chalk.red;
                const status = operation.status || 'UNKNOWN';
                operationOutput.push(`Status: ${operationColor(status)}`);
            }
            if (operation.createdAt)
                operationOutput.push(`Started: ${formatDate(operation.createdAt)}`);
            if (operation.status === 'COMPLETED' && operation.completedAt && operation.createdAt) {
                operationOutput.push(`Completed: ${formatDate(operation.completedAt)}`);
                operationOutput.push(`Duration: ${chalk.yellow(formatDuration(operation.createdAt, operation.completedAt))}`);
            }
            infoOutput.push(operationOutput);
        }
    }
    output.push(infoOutput);
    return treeify(output, { plain: true });
}
export function formatStacksListing(stacks, currentStackId) {
    if (!stacks || stacks.length === 0)
        return 'No stacks found';
    const output = [];
    for (const stack of stacks) {
        const isCurrentStack = currentStackId === stack.id;
        output.push(formatStackInfo(stack, isCurrentStack));
    }
    return output.join('\n');
}
export function stackDeployDiff(localBlueprint, deployedStack) {
    const added = [];
    const removed = [];
    // look for new resources
    for (const resource of localBlueprint.resources ?? []) {
        const deployedResource = deployedStack.resources.find(({ name, type }) => resource.name === name && resource.type === type);
        if (!deployedResource)
            added.push(resource);
    }
    // look for destroyed resources
    for (const resource of deployedStack.resources) {
        const localResource = localBlueprint.resources?.find(({ name, type }) => resource.name === name && resource.type === type);
        if (!localResource)
            removed.push(resource);
    }
    if (added.length === 0 && removed.length === 0)
        return null;
    const output = [];
    if (added.length > 0) {
        output.push(`  ${chalk.bold.greenBright('++')} ${added.map(({ name }) => chalk.bgGreen.whiteBright(`"${name}"`)).join(' ')}`);
    }
    if (removed.length > 0) {
        output.push(`  ${chalk.bold.redBright('--')} ${removed.map(({ name }) => chalk.bgRed.whiteBright(`"${name}"`)).join(' ')}`);
    }
    return output.join('\n');
}
