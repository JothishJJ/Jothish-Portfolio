import { DeployedBlueprintCommand } from '../../baseCommands.js';
export default class InfoCommand extends DeployedBlueprintCommand<typeof InfoCommand> {
    static description: string;
    static examples: string[];
    static flags: {
        id: import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    run(): Promise<void>;
}
