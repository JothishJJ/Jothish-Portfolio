import ora from 'ora';
import { list } from '../../../actions/functions/env/list.js';
import { findFunctionByName } from '../../../utils/find-function.js';
export async function functionEnvListCore(options) {
    const args = options.args;
    const spinner = ora(`Listing environment variables for "${args.name}"`).start();
    const { externalId } = findFunctionByName(options.deployedStack, args.name);
    const result = await list(externalId, options.auth);
    if (!result.ok) {
        spinner.stop();
        return { success: false, error: result.error || 'Unknown error' };
    }
    spinner.succeed(`Environment variables for "${args.name}"`);
    for (const key of result.envvars) {
        options.log(key);
    }
    return { success: true };
}
