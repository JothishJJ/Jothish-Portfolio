import { Flags } from '@oclif/core';
import { BlueprintCommand } from '../../baseCommands.js';
import { blueprintConfigCore } from '../../cores/blueprints/config.js';
export default class ConfigCommand extends BlueprintCommand {
    static description = 'View or edit Blueprint configuration';
    static examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> --test-config',
        '<%= config.bin %> <%= command.id %> --edit',
        '<%= config.bin %> <%= command.id %> --edit --project-id <projectId>',
        '<%= config.bin %> <%= command.id %> --edit --project-id <projectId> --stack-id <stackId>',
    ];
    static flags = {
        'test-config': Flags.boolean({
            char: 't',
            aliases: ['test', 'validate'],
            description: 'Validate the configuration',
            default: false,
        }),
        edit: Flags.boolean({
            char: 'e',
            description: 'Edit the configuration',
            default: false,
        }),
        'project-id': Flags.string({
            description: 'Update the Project ID in the configuration. Requires --edit flag',
            aliases: ['project', 'projectId'],
            dependsOn: ['edit'],
        }),
        'stack-id': Flags.string({
            description: 'Update the Stack ID in the configuration. Requires --edit flag',
            aliases: ['stack', 'stackId'],
            dependsOn: ['edit'],
        }),
    };
    async run() {
        const { success, error } = await blueprintConfigCore({
            bin: this.config.bin,
            log: (message) => this.log(message),
            blueprint: this.blueprint,
            token: this.sanityToken,
            flags: this.flags,
        });
        if (!success)
            this.error(error);
    }
}
