import { Flags } from '@oclif/core';
import { BlueprintCommand } from '../../baseCommands.js';
import { blueprintStacksCore } from '../../cores/blueprints/stacks.js';
export default class StacksCommand extends BlueprintCommand {
    static description = 'List all Blueprint stacks';
    static examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> --project-id <projectId>',
    ];
    static flags = {
        'project-id': Flags.string({
            description: 'Project ID to show stacks for',
            aliases: ['projectId', 'project'],
        }),
    };
    async run() {
        const { success, error } = await blueprintStacksCore({
            bin: this.config.bin,
            log: (message) => this.log(message),
            token: this.sanityToken,
            blueprint: this.blueprint,
            flags: this.flags,
        });
        if (!success)
            this.error(error);
    }
}
