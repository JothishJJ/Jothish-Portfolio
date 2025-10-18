import { BlueprintCommand } from '../../baseCommands.js';
export default class PlanCommand extends BlueprintCommand<typeof PlanCommand> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
