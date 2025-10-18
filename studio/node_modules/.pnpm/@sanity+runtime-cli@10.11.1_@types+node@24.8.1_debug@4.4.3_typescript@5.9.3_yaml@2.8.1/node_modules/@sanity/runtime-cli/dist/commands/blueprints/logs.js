import { Flags } from '@oclif/core';
import { DeployedBlueprintCommand } from '../../baseCommands.js';
import { blueprintLogsCore } from '../../cores/blueprints/logs.js';
export default class LogsCommand extends DeployedBlueprintCommand {
    static description = 'Display logs for a Blueprint deployment';
    static examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> --watch',
    ];
    static flags = {
        watch: Flags.boolean({
            char: 'w',
            description: 'Watch for new logs (streaming mode)',
            aliases: ['follow'],
        }),
    };
    async run() {
        const { success, streaming, error } = await blueprintLogsCore({
            bin: this.config.bin,
            log: (message) => this.log(message),
            auth: this.auth,
            stackId: this.stackId,
            deployedStack: this.deployedStack,
            flags: this.flags,
        });
        if (streaming)
            return streaming;
        if (!success)
            this.error(error);
    }
}
