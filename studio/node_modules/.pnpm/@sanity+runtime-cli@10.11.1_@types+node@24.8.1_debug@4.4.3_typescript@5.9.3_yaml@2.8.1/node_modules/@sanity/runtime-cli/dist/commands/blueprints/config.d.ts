import { BlueprintCommand } from '../../baseCommands.js';
export default class ConfigCommand extends BlueprintCommand<typeof ConfigCommand> {
    static description: string;
    static examples: string[];
    static flags: {
        'test-config': import("@oclif/core/interfaces").BooleanFlag<boolean>;
        edit: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'project-id': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'stack-id': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    run(): Promise<void>;
}
