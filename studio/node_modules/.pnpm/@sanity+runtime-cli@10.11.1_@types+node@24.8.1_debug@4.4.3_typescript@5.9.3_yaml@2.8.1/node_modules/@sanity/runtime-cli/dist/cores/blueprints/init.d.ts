import type { CoreConfig, CoreResult } from '../index.js';
export interface BlueprintInitOptions extends CoreConfig {
    token: string;
    args: {
        dir?: string;
    };
    flags: {
        dir?: string;
        example?: string;
        'blueprint-type'?: string;
        'project-id'?: string;
        'stack-id'?: string;
        'stack-name'?: string;
    };
}
export declare function blueprintInitCore(options: BlueprintInitOptions): Promise<CoreResult>;
