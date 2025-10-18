import { getStack } from '../../actions/blueprints/stacks.js';
import { formatResourceTree, formatStackInfo } from '../../utils/display/blueprints-formatting.js';
import { niceId } from '../../utils/display/presenters.js';
export async function blueprintInfoCore(options) {
    const { log, auth, stackId, flags, deployedStack } = options;
    try {
        const targetStackId = flags.id || stackId;
        let stack = deployedStack;
        if (flags.id) {
            const existingStackResponse = await getStack({ stackId: targetStackId, auth });
            if (!existingStackResponse.ok) {
                log(`Could not retrieve deployment info for ${niceId(targetStackId)}`);
                return {
                    success: false,
                    error: existingStackResponse.error || 'Failed to retrieve stack',
                };
            }
            stack = existingStackResponse.stack;
        }
        log(formatStackInfo(stack, true));
        if (stack.resources)
            log(formatResourceTree(stack.resources));
        return { success: true };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        log(`Error: ${errorMessage}`);
        return {
            success: false,
            error: errorMessage,
        };
    }
}
