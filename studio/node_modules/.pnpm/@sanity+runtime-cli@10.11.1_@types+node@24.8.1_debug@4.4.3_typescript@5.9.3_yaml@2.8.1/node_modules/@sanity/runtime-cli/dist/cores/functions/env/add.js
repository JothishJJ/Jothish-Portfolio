import chalk from 'chalk';
import ora from 'ora';
import { update } from '../../../actions/functions/env/update.js';
import { findFunctionByName } from '../../../utils/find-function.js';
export async function functionEnvAddCore(options) {
    const args = options.args;
    const spinner = ora(`Updating "${args.key}" environment variable in "${args.name}"`).start();
    const { externalId } = findFunctionByName(options.deployedStack, args.name);
    const result = await update(externalId, args.key, args.value, options.auth);
    if (!result.ok) {
        spinner.fail(`${chalk.red('Failed')} to update ${args.key}`);
        return {
            success: false,
            error: result.error || 'Unknown error',
        };
    }
    spinner.succeed(`Update of ${args.key} succeeded`);
    return { success: true };
}
