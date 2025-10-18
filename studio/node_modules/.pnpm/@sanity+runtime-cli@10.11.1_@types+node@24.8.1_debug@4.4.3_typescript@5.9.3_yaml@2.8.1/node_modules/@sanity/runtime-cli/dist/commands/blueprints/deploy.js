import { Flags } from '@oclif/core';
import { DeployedBlueprintCommand } from '../../baseCommands.js';
import { blueprintDeployCore } from '../../cores/blueprints/deploy.js';
export default class DeployCommand extends DeployedBlueprintCommand {
    static description = 'Deploy a Blueprint';
    static examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> --no-wait',
    ];
    static flags = {
        'no-wait': Flags.boolean({
            description: 'Do not wait for deployment to complete',
            default: false,
        }),
    };
    async run() {
        const { success, error } = await blueprintDeployCore({
            bin: this.config.bin,
            log: (message) => this.log(message),
            auth: this.auth,
            stackId: this.stackId,
            projectId: this.projectId,
            deployedStack: this.deployedStack,
            blueprint: this.blueprint,
            flags: this.flags,
        });
        if (!success)
            this.error(error);
    }
}
