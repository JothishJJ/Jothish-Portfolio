import type { FunctionResource } from '../types.js';
import { type BlueprintParserError } from '../types.js';
export declare function validateFunctionName(name: string): boolean;
export declare function validateFunctionResource(resource: FunctionResource): BlueprintParserError[];
