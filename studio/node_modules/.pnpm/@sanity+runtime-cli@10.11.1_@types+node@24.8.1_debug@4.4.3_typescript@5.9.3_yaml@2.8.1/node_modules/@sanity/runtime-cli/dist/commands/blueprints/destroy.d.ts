import { BlueprintCommand } from '../../baseCommands.js';
export default class DestroyCommand extends BlueprintCommand<typeof DestroyCommand> {
    static description: string;
    static examples: string[];
    static flags: {
        force: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        'project-id': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'stack-id': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
        'no-wait': import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
