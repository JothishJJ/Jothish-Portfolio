import type { ReadBlueprintResult } from '../../actions/blueprints/blueprint.js';
import type { CoreConfig, CoreResult } from '../index.js';
export interface BlueprintConfigOptions extends CoreConfig {
    token: string;
    blueprint: ReadBlueprintResult;
    flags: {
        'test-config'?: boolean;
        edit?: boolean;
        'project-id'?: string;
        'stack-id'?: string;
    };
}
export declare function blueprintConfigCore(options: BlueprintConfigOptions): Promise<CoreResult>;
