import chalk from 'chalk';
function formatMemory(memory) {
    return `${chalk.dim('memory:')} ${memory}`;
}
function formatTimeout(timeout) {
    return `${chalk.dim('timeout:')} ${timeout}`;
}
function arrayifyEvent(event) {
    if (!event)
        return undefined;
    const details = [];
    if (event.on) {
        details.push(`${chalk.dim('on:')} ${event.on.map((o) => `"${o}"`).join(', ')}`);
    }
    if (event.filter) {
        details.push(`${chalk.dim('filter:')} ${event.filter}`);
    }
    if (event.projection) {
        details.push(`${chalk.dim('projection:')} ${event.projection}`);
    }
    return details;
}
export function arrayifyFunction(fn) {
    const details = [`${chalk.dim('type:')} "${fn.type}"`];
    if (fn.memory)
        details.push(formatMemory(fn.memory));
    if (fn.timeout)
        details.push(formatTimeout(fn.timeout));
    if (fn.event) {
        const eventDetails = arrayifyEvent(fn.event);
        if (eventDetails) {
            details.push(`${chalk.dim('event:')}`);
            details.push(eventDetails);
        }
    }
    return details;
}
export function arraifyCors(resource) {
    return [`${chalk.dim('origin:')} "${resource.origin}"`];
}
