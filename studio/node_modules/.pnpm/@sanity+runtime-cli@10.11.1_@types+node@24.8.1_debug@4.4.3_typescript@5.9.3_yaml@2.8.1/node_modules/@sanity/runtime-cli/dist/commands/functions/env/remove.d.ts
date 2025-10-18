import { DeployedBlueprintCommand } from '../../../baseCommands.js';
export default class EnvRemoveCommand extends DeployedBlueprintCommand<typeof EnvRemoveCommand> {
    static args: {
        name: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
        key: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
