import type { TreeInput } from 'array-treeify';
import type { CorsResource, FunctionResource } from '../../utils/types.js';
export declare function arrayifyFunction(fn: FunctionResource): TreeInput;
export declare function arraifyCors(resource: CorsResource): TreeInput;
