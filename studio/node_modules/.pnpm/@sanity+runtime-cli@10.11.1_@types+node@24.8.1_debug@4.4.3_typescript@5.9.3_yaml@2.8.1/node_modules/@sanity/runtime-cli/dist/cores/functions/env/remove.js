import chalk from 'chalk';
import ora from 'ora';
import { remove } from '../../../actions/functions/env/remove.js';
import { findFunctionByName } from '../../../utils/find-function.js';
export async function functionEnvRemoveCore(options) {
    const args = options.args;
    const spinner = ora(`Removing "${args.key}" environment variable in "${args.name}"`).start();
    const { externalId } = findFunctionByName(options.deployedStack, args.name);
    const result = await remove(externalId, args.key, options.auth);
    if (!result.ok) {
        spinner.fail(`${chalk.red('Failed')} to remove ${args.key}`);
        return { success: false, error: result.error || 'Unknown error' };
    }
    spinner.succeed(`Removal of ${args.key} succeeded`);
    return { success: true };
}
