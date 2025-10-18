import type { BlueprintIssue } from '../../actions/blueprints/index.js';
import type { BlueprintParserError } from '../types.js';
export declare function presentBlueprintIssues(issues: BlueprintIssue[]): string;
export declare function presentBlueprintParserErrors(errors: BlueprintParserError[]): string;
