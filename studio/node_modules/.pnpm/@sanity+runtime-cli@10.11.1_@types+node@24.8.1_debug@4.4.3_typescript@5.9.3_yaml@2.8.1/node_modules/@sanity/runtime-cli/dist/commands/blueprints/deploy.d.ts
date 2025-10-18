import { DeployedBlueprintCommand } from '../../baseCommands.js';
export default class DeployCommand extends DeployedBlueprintCommand<typeof DeployCommand> {
    static description: string;
    static examples: string[];
    static flags: {
        'no-wait': import("@oclif/core/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
