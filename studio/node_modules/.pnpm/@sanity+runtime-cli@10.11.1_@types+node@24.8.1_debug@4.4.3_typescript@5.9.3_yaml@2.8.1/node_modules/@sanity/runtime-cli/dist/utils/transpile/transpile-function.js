import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { cwd } from 'node:process';
import { build as viteBuild } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { findFunctionEntryPoint } from '../functions/find-entry-point.js';
import { cleanupSourceMaps } from './cleanup-source-maps.js';
import { findDirUp } from './find-up.js';
import { verifyHandler } from './verify-handler.js';
export async function transpileFunction(resource) {
    if (!resource.src)
        throw new Error('Resource src is required');
    if (!resource.name)
        throw new Error('Resource name is required');
    const timings = {};
    const transpileStart = performance.now();
    const sourcePath = path.resolve(cwd(), resource.src);
    const stats = await stat(sourcePath);
    const fnDisplayName = resource.displayName ?? resource.name;
    const findEntryStart = performance.now();
    const entry = await findFunctionEntryPoint(sourcePath, fnDisplayName);
    timings['transpile:findEntry'] = performance.now() - findEntryStart;
    const entryDir = stats.isFile() ? path.dirname(sourcePath) : sourcePath;
    const outputPathStart = performance.now();
    const outputDir = await getTranspileOutputPath(entryDir, resource.name);
    const outputFile = path.join(outputDir, getOutputFilename(entry));
    const fnRootDir = (await findDirUp('node_modules', entryDir)) || entryDir;
    timings['transpile:setupOutput'] = performance.now() - outputPathStart;
    async function cleanupTmpDir() {
        // Feel a certain way about leaving things uncleaned, but helps with debugging for now
        // await rm(outputDir, {recursive: true, force: true}).catch(logCleanupFailure)
    }
    try {
        const viteStart = performance.now();
        const result = await viteBuild({
            root: fnRootDir,
            logLevel: 'silent',
            build: {
                target: 'node20',
                outDir: outputDir,
                emptyOutDir: false,
                minify: false,
                sourcemap: true,
                ssr: true,
                rollupOptions: {
                    input: entry,
                    output: {
                        format: 'esm',
                        entryFileNames: getOutputFilename(entry),
                        // Do NOT inline anything from node_modules
                        preserveModules: true, // Key setting
                        preserveModulesRoot: fnRootDir,
                    },
                    external: [/node_modules/], // treat all node_modules as external
                },
            },
            ssr: {
                noExternal: [], // Do NOT bundle node_modules
                resolve: {
                    conditions: ['node'],
                },
            },
            plugins: [tsConfigPaths()],
        });
        timings['transpile:build'] = performance.now() - viteStart;
        const verifyStart = performance.now();
        await verifyHandler(result);
        timings['transpile:verify'] = performance.now() - verifyStart;
        const pkgStart = performance.now();
        await writeTranspiledPackageJson(entryDir, outputFile);
        timings['transpile:writePackage'] = performance.now() - pkgStart;
        const cleanupStart = performance.now();
        await cleanupSourceMaps(sourcePath, outputDir);
        timings['transpile:cleanupMaps'] = performance.now() - cleanupStart;
        timings.bundle = performance.now() - transpileStart;
        return {
            type: 'success',
            outputDir,
            warnings: [],
            cleanup: cleanupTmpDir,
            timings,
        };
    }
    catch (err) {
        await cleanupTmpDir();
        throw new Error(`Transpiling of function failed: ${err instanceof Error ? err.message : err}`, {
            cause: err,
        });
    }
}
async function writeTranspiledPackageJson(inputDir, outputFilePath) {
    const baseName = path.basename(outputFilePath);
    let original;
    try {
        const pkgJsonPath = path.join(inputDir, 'package.json');
        original = JSON.parse(await readFile(pkgJsonPath, 'utf-8'));
    }
    catch {
        original = undefined;
    }
    const bundled = {
        // One could argue that we should strip this down significantly.
        // Theoretically though, a function may reach into it to get dependency versions
        // and whatnot, so maybe it makes more sense to keep it as close to the original
        // as possible?
        ...original,
        main: baseName, // This should never be the input file, always the built output name
        type: 'module', // We explicitly create ESM output
    };
    const pkgJsonOutputPath = path.join(path.dirname(outputFilePath), 'package.json');
    await writeFile(pkgJsonOutputPath, JSON.stringify(bundled, null, 2));
}
async function getTranspileOutputPath(entryDir, fnName) {
    const tmpPath = path.resolve(entryDir, '.build', `function-${fnName}`);
    await rm(tmpPath, { recursive: true, force: true }).catch(logCleanupFailure);
    await mkdir(tmpPath, { recursive: true });
    return tmpPath;
}
/**
 * Minor convenience/niceness to keep the same input filename, but change the extension
 */
function getOutputFilename(entryFileName) {
    const baseName = path.basename(entryFileName, path.extname(entryFileName));
    return baseName ? `${baseName}.js` : 'index.js';
}
function logCleanupFailure(err) {
    console.warn(`[warn] Failed to clean up temporary files: ${err instanceof Error ? err.message : err}`);
}
