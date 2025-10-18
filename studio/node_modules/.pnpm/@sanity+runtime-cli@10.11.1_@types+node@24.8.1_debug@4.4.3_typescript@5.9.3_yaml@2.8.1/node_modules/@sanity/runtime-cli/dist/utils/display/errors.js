export function presentBlueprintIssues(issues) {
    const report = [];
    for (const issue of issues) {
        switch (issue.code) {
            case 'PARSE_ERROR':
                report.push(issue.message);
                if (issue.errors)
                    report.push(presentBlueprintParserErrors(issue.errors));
                break;
            case 'NO_STACK_ID':
                report.push('Existing deployment not found.');
                break;
            case 'NO_PROJECT_ID':
                report.push('Project ID not found.');
                break;
            case 'NO_STACK':
                report.push('Existing deployment not found.');
                break;
            default:
                report.push(issue.message);
        }
    }
    return report.join('\n');
}
export function presentBlueprintParserErrors(errors) {
    return errors.map((e) => e.message).join('\n');
}
