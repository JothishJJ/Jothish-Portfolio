import type { AuthParams } from '../../../utils/types.js';
export declare function list(id: string, auth: AuthParams): Promise<{
    ok: boolean;
    envvars: any;
    error: any;
}>;
