import type { CoreResult, DeployedBlueprintConfig } from '../index.js';
export interface FunctionLogsOptions extends DeployedBlueprintConfig {
    args: {
        name: string;
    };
    flags: {
        limit: number;
        json?: boolean;
        utc?: boolean;
        delete?: boolean;
        force?: boolean;
        watch?: boolean;
    };
}
export declare function functionLogsCore(options: FunctionLogsOptions): Promise<CoreResult>;
