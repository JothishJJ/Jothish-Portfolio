import { DeployedBlueprintCommand } from '../../baseCommands.js';
export default class LogsCommand extends DeployedBlueprintCommand<typeof LogsCommand> {
    static args: {
        name: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    static flags: {
        limit: import("@oclif/core/interfaces").OptionFlag<number, import("@oclif/core/interfaces").CustomOptions>;
        json: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        utc: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        delete: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        force: import("@oclif/core/interfaces").BooleanFlag<boolean>;
        watch: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
