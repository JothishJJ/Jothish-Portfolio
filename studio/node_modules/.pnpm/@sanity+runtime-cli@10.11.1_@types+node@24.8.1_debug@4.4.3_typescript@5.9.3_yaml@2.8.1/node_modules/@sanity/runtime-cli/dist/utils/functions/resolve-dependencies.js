import hydrate from '@architect/hydrate';
import inventory from '@architect/inventory';
import { convertResourceToArcFormat } from './resource-to-arc.js';
export async function resolveResourceDependencies(resource, transpiled) {
    const rawArc = await convertResourceToArcFormat(resource, transpiled);
    const inv = await inventory({ rawArc });
    try {
        await hydrate.install({ inventory: inv, hydrateShared: false, quiet: true });
    }
    catch (err) {
        // This is a temporary fix.
        const regex = /ENOTDIR: not a directory, unlink ['"].*[/\\]node_modules['"]/;
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (!regex.test(errorMessage)) {
            throw err;
        }
    }
}
