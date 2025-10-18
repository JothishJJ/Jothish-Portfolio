import { Args } from '@oclif/core';
import { DeployedBlueprintCommand } from '../../../baseCommands.js';
import { functionEnvListCore } from '../../../cores/functions/env/list.js';
export default class EnvListCommand extends DeployedBlueprintCommand {
    static args = {
        name: Args.string({ description: 'The name of the Sanity Function', required: true }),
    };
    static description = 'List the environment variables for a Sanity function';
    static examples = ['<%= config.bin %> <%= command.id %> MyFunction'];
    async run() {
        const { success, error } = await functionEnvListCore({
            bin: this.config.bin,
            log: (msg) => this.log(msg),
            args: this.args,
            auth: this.auth,
            blueprint: this.blueprint,
            deployedStack: this.deployedStack,
            projectId: this.projectId,
            token: this.sanityToken,
            stackId: this.stackId,
        });
        if (!success)
            this.error(error);
    }
}
