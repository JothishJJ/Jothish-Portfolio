import { DeployedBlueprintCommand } from '../../../baseCommands.js';
export default class EnvListCommand extends DeployedBlueprintCommand<typeof EnvListCommand> {
    static args: {
        name: import("@oclif/core/interfaces").Arg<string, Record<string, unknown>>;
    };
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
