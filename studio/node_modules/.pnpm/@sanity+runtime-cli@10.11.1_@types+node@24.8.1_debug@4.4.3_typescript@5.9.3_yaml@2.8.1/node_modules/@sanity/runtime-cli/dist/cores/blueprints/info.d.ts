import type { AuthParams, Stack } from '../../utils/types.js';
import type { CoreConfig, CoreResult } from '../index.js';
export interface BlueprintInfoOptions extends CoreConfig {
    auth: AuthParams;
    stackId: string;
    deployedStack: Stack;
    flags: {
        id?: string;
    };
}
export declare function blueprintInfoCore(options: BlueprintInfoOptions): Promise<CoreResult>;
