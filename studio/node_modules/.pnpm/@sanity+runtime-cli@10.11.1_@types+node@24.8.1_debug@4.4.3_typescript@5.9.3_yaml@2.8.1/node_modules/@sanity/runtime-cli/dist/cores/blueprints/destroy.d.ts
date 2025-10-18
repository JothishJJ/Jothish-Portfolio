import type { ReadBlueprintResult } from '../../actions/blueprints/blueprint.js';
import type { CoreConfig, CoreResult } from '../index.js';
export interface BlueprintDestroyOptions extends CoreConfig {
    token: string;
    blueprint: ReadBlueprintResult;
    flags: {
        force?: boolean;
        'project-id'?: string;
        'stack-id'?: string;
        'no-wait'?: boolean;
    };
}
export declare function blueprintDestroyCore(options: BlueprintDestroyOptions): Promise<CoreResult>;
