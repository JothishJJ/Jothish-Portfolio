import type { ReadBlueprintResult } from '../../actions/blueprints/blueprint.js';
import type { CoreConfig, CoreResult } from '../index.js';
export interface BlueprintStacksOptions extends CoreConfig {
    token: string;
    blueprint: ReadBlueprintResult;
    flags: {
        'project-id'?: string;
    };
}
export declare function blueprintStacksCore(options: BlueprintStacksOptions): Promise<CoreResult>;
