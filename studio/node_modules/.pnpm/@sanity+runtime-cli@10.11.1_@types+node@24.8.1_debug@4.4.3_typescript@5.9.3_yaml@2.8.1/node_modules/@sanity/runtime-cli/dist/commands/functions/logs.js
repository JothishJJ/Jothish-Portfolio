import { Args, Flags } from '@oclif/core';
import { DeployedBlueprintCommand } from '../../baseCommands.js';
import { functionLogsCore } from '../../cores/functions/logs.js';
export default class LogsCommand extends DeployedBlueprintCommand {
    static args = {
        name: Args.string({ description: 'The name of the Sanity Function', required: true }),
    };
    static description = 'Retrieve or delete logs for a Sanity Function';
    static examples = [
        '<%= config.bin %> <%= command.id %> <name>',
        '<%= config.bin %> <%= command.id %> <name> --json',
        '<%= config.bin %> <%= command.id %> <name> --limit 100',
        '<%= config.bin %> <%= command.id %> <name> --delete',
    ];
    static flags = {
        limit: Flags.integer({
            char: 'l',
            description: 'Total number of log entries to retrieve',
            required: false,
            default: 50,
        }),
        json: Flags.boolean({
            char: 'j',
            description: 'Return logs in JSON format',
            required: false,
        }),
        utc: Flags.boolean({
            char: 'u',
            description: 'Show dates in UTC time zone',
            required: false,
        }),
        delete: Flags.boolean({
            char: 'd',
            exclusive: ['limit', 'json'],
            description: 'Delete all logs for the function',
            required: false,
        }),
        force: Flags.boolean({
            char: 'f',
            dependsOn: ['delete'],
            description: 'Skip confirmation for deleting logs',
            required: false,
        }),
        watch: Flags.boolean({
            char: 'w',
            description: 'Watch for new logs (streaming mode)',
            aliases: ['follow'],
        }),
    };
    async run() {
        const { success, error } = await functionLogsCore({
            bin: this.config.bin,
            log: (msg) => this.log(msg),
            args: this.args,
            flags: this.flags,
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
