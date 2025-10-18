import { BlueprintCommand } from '../../baseCommands.js';
import { blueprintPlanCore } from '../../cores/blueprints/plan.js';
export default class PlanCommand extends BlueprintCommand {
    static description = 'Enumerate resources to be deployed - will not modify any resources';
    static examples = ['<%= config.bin %> <%= command.id %>'];
    async run() {
        const { success, error } = await blueprintPlanCore({
            bin: this.config.bin,
            log: (message) => this.log(message),
            token: this.sanityToken,
            blueprint: this.blueprint,
        });
        if (!success)
            this.error(error);
    }
}
