import type { AuthParams, FunctionLog } from '../../utils/types.js';
/** @internal */
export interface LoggingOptions {
    limit: number;
}
export declare function logs(id: string, options: LoggingOptions, auth: AuthParams): Promise<{
    ok: boolean;
    error: any;
    logs: any;
    total: any;
}>;
export declare function deleteLogs(id: string, auth: AuthParams): Promise<{
    ok: boolean;
    error: any;
}>;
export declare function streamLogs(id: string, auth: AuthParams, onLog: (log: FunctionLog) => void, onOpen: () => void, onError: (error: string) => void): () => void;
