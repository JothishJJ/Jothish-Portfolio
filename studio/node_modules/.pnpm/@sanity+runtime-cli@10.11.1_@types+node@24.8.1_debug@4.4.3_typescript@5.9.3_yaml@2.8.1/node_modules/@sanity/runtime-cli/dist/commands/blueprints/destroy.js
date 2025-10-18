import { Flags } from '@oclif/core';
import { BlueprintCommand } from '../../baseCommands.js';
import { blueprintDestroyCore } from '../../cores/blueprints/destroy.js';
export default class DestroyCommand extends BlueprintCommand {
    static description = 'Destroy a Blueprint deployment (will not delete local files)';
    static examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> --stack-id <stackId> --project-id <projectId> --force --no-wait',
    ];
    static flags = {
        force: Flags.boolean({
            description: 'Force destroy (skip confirmation)',
            aliases: ['f'],
            default: false,
        }),
        'project-id': Flags.string({
            description: 'Project associated with the Stack (defaults to current Project)',
            aliases: ['projectId', 'project'],
            dependsOn: ['stack-id', 'force'],
        }),
        'stack-id': Flags.string({
            description: 'Stack ID to destroy (defaults to current Stack)',
            aliases: ['stackId', 'stack'],
        }),
        'no-wait': Flags.boolean({
            description: 'Do not wait for destruction to complete',
            default: false,
        }),
    };
    async run() {
        const { success, error } = await blueprintDestroyCore({
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
