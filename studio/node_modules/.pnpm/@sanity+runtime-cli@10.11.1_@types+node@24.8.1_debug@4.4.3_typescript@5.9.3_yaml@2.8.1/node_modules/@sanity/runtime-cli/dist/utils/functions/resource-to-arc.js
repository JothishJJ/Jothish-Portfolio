import { sep } from 'node:path';
export async function convertResourceToArcFormat(resource, transpiled) {
    const srcPath = resource.src?.split(sep).join('/');
    const functionPath = transpiled ? `${srcPath}/.build/function-${resource.name}` : srcPath;
    return `@app
hydrate-function

@events
${resource.name}
  src ${functionPath}
`;
}
