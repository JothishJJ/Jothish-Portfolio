/**
 * Prompt the user for a Project after selecting an Organization.
 * @param token - The Sanity API token
 * @returns The selected project, with the projectId and displayName
 * @throws {Error} If the user does not have any projects or if the API call fails
 */
export declare function promptForProject({ token, knownOrganizationId, knownProjectId, }: {
    token: string;
    knownOrganizationId?: string;
    knownProjectId?: string;
}): Promise<{
    projectId: string;
    displayName: string;
}>;
export declare function promptForStackId({ projectId, token, }: {
    projectId: string;
    token: string;
}): Promise<string>;
