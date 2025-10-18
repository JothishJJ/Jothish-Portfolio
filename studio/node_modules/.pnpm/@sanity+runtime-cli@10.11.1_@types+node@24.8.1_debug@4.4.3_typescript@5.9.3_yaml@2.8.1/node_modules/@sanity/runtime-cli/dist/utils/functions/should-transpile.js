import { findFunctionEntryPoint } from './find-entry-point.js';
export async function shouldTranspileFunction(resource) {
    if (typeof resource.transpile === 'boolean') {
        return resource.transpile;
    }
    if (!resource.src) {
        // Cannot determine without a source path
        return false;
    }
    try {
        // 2. Find the actual entry point
        const entryPoint = await findFunctionEntryPoint(resource.src, resource.displayName ?? resource.name);
        // 3. Check if the resolved entry point is a TypeScript file
        return entryPoint.endsWith('.ts');
    }
    catch (err) {
        // If we cannot find the entry point, we cannot determine if it's TS.
        // Log a warning and default to false (don't bundle).
        console.warn(`[warn] Could not determine entry point for function "${resource.displayName ?? resource.name}" while checking if transpiling is needed: ${err instanceof Error ? err.message : err}`);
        return false;
    }
}
