import { Flags } from '@oclif/core';
import { DeployedBlueprintCommand } from '../../baseCommands.js';
import { blueprintInfoCore } from '../../cores/blueprints/info.js';
export default class InfoCommand extends DeployedBlueprintCommand {
    static description = 'Show information about a Blueprint deployment';
    static examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> --stack-id <stackId>',
    ];
    static flags = {
        id: Flags.string({
            description: 'Stack ID to show info for (defaults to current stack)',
        }),
    };
    async run() {
        const { success, error } = await blueprintInfoCore({
            bin: this.config.bin,
            log: (message) => this.log(message),
            auth: this.auth,
            stackId: this.stackId,
            deployedStack: this.deployedStack,
            flags: this.flags,
        });
        if (!success)
            this.error(error);
    }
}
