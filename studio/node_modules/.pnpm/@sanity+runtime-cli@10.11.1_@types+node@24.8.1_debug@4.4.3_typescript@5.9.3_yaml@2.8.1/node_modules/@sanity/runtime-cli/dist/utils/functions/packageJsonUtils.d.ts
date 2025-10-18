import type { FunctionResource } from '../types.js';
export declare function doesPackageJsonExists(resource: FunctionResource): boolean;
export declare function createTempPackageJson(functionPath: string): boolean;
export declare function cleanupTempPackageJson(functionPath: string): boolean;
