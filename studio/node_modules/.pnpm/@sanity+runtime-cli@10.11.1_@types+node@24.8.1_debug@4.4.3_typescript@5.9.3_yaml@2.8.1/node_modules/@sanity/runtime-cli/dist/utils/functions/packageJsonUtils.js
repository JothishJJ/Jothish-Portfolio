import { existsSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { cwd } from 'node:process';
function getPackageJsonPath(functionPath) {
    const functionDir = dirname(functionPath);
    return join(functionDir, 'package.json');
}
export function doesPackageJsonExists(resource) {
    if (!resource.src) {
        // Cannot determine without a source path
        return false;
    }
    const absolutePath = resolve(cwd(), resource.src);
    const packageJsonPath = join(absolutePath, 'package.json');
    return existsSync(packageJsonPath);
}
export function createTempPackageJson(functionPath) {
    if (!functionPath) {
        // Cannot determine without a source path
        return false;
    }
    const packageJsonPath = getPackageJsonPath(functionPath);
    const packageContent = { type: 'module' };
    writeFileSync(packageJsonPath, JSON.stringify(packageContent, null, 2));
    return !existsSync(packageJsonPath);
}
export function cleanupTempPackageJson(functionPath) {
    if (!functionPath) {
        // Cannot determine without a source path
        return false;
    }
    const packageJsonPath = getPackageJsonPath(functionPath);
    if (existsSync(packageJsonPath)) {
        rmSync(packageJsonPath);
    }
    return !existsSync(packageJsonPath);
}
