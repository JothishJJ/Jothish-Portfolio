import chalk from 'chalk';
export function check(str) {
    return `${chalk.bold(chalk.green('✔︎'))} ${str}`;
}
export function info(str) {
    return `${chalk.bold.blue('ℹ︎')} ${str}`;
}
export function warn(str) {
    return `${chalk.bold.yellow('▶︎')} ${str}`;
}
export function severe(str) {
    return `${chalk.bold.red('✘')} ${str}`;
}
export function niceId(id) {
    if (!id)
        return '';
    return `<${chalk.yellow(id)}>`;
}
export function indent(str, spaces = 2) {
    const pad = ' '.repeat(spaces);
    return str
        .split('\n')
        .map((line) => (line.length > 0 ? pad + line : line))
        .join('\n');
}
