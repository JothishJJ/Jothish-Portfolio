import { DeployedBlueprintCommand } from '../../baseCommands.js';
export default class LogsCommand extends DeployedBlueprintCommand<typeof LogsCommand> {
    static description: string;
    static examples: string[];
    static flags: {
        watch: import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
