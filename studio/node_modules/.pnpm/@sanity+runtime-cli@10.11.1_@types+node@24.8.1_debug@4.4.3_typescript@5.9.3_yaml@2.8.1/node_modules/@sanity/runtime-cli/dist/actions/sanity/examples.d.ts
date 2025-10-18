export declare const EXAMPLES_CACHE_DIR: string;
declare const EXAMPLE_TYPES: {
    blueprint: string;
    function: string;
};
export declare function verifyExampleExists({ type, name, }: {
    type: keyof typeof EXAMPLE_TYPES;
    name: string;
}): Promise<boolean>;
/**
 * Downloads an example from the examples repo and writes it to disk.
 * @sideEffect Creates the example directory and writes the example to disk.
 * @returns The example files and directory and the function config if it exists.
 */
export declare function writeExample({ ownerRepo, exampleType, exampleName, dir, }: {
    ownerRepo?: string;
    exampleType: keyof typeof EXAMPLE_TYPES;
    exampleName: string;
    dir?: string;
}): Promise<false | {
    files: Record<string, string>;
    dir: string;
    instructions: string | null;
    functionConfig: Record<string, unknown> | null;
}>;
export {};
