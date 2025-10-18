import { Args } from '@oclif/core';
import { DeployedBlueprintCommand } from '../../../baseCommands.js';
import { functionEnvRemoveCore } from '../../../cores/functions/env/remove.js';
export default class EnvRemoveCommand extends DeployedBlueprintCommand {
    static args = {
        name: Args.string({ description: 'The name of the Sanity Function', required: true }),
        key: Args.string({ description: 'The name of the environment variable', required: true }),
    };
    static description = 'Remove an environment variable for a Sanity function';
    static examples = ['<%= config.bin %> <%= command.id %> MyFunction API_URL'];
    async run() {
        const { success, error } = await functionEnvRemoveCore({
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
