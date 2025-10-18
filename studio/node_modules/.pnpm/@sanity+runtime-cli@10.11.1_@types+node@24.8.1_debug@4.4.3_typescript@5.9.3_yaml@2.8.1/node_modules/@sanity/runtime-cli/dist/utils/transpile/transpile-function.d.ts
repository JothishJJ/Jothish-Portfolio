import type { FunctionResource } from '../types.js';
export declare function transpileFunction(resource: FunctionResource): Promise<{
    type: string;
    outputDir: string;
    warnings: string[];
    cleanup: () => Promise<void>;
    timings: Record<string, number>;
}>;
