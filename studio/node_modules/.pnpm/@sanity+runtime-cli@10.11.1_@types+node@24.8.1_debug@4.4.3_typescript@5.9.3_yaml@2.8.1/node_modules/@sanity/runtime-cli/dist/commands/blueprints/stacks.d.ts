import { BlueprintCommand } from '../../baseCommands.js';
export default class StacksCommand extends BlueprintCommand<typeof StacksCommand> {
    static description: string;
    static examples: string[];
    static flags: {
        'project-id': import("@oclif/core/interfaces").OptionFlag<string | undefined, import("@oclif/core/interfaces").CustomOptions>;
    };
    run(): Promise<void>;
}
