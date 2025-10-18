import { Args } from '@oclif/core';
import { DeployedBlueprintCommand } from '../../../baseCommands.js';
import { functionEnvAddCore } from '../../../cores/functions/env/add.js';
export default class EnvAddCommand extends DeployedBlueprintCommand {
    static args = {
        name: Args.string({ description: 'The name of the Sanity Function', required: true }),
        key: Args.string({ description: 'The name of the environment variable', required: true }),
        value: Args.string({ description: 'The value of the environment variable', required: true }),
    };
    static description = 'Add or set the value of an environment variable for a Sanity function';
    static examples = [
        '<%= config.bin %> <%= command.id %> MyFunction API_URL https://api.example.com/',
    ];
    async run() {
        const { success, error } = await functionEnvAddCore({
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
