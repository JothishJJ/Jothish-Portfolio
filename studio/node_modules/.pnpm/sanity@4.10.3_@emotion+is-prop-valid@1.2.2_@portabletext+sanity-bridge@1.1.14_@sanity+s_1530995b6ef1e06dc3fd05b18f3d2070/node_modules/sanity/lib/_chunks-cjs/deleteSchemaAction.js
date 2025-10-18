"use strict";
var chalk = require("chalk"), uniq = require("lodash/uniq"), schemaStoreOutStrings = require("./schemaStoreOutStrings.js"), uniqueProjectIdDataset = require("./uniqueProjectIdDataset.js");
function _interopDefaultCompat(e) {
  return e && typeof e == "object" && "default" in e ? e : { default: e };
}
var chalk__default = /* @__PURE__ */ _interopDefaultCompat(chalk), uniq__default = /* @__PURE__ */ _interopDefaultCompat(uniq);
class DeleteIdError extends Error {
  constructor(args) {
    super(args.options?.cause?.message, args.options), this.name = "DeleteIdError", this.schemaId = args.schemaId, this.projectId = args.projectId, this.dataset = args.dataset;
  }
}
function deleteSchemasActionForCommand(flags, context) {
  return deleteSchemaAction(flags, {
    ...context,
    manifestExtractor: schemaStoreOutStrings.createManifestExtractor(context)
  });
}
async function deleteSchemaAction(flags, context) {
  const {
    ids,
    dataset,
    extractManifest,
    manifestDir,
    verbose
  } = schemaStoreOutStrings.parseDeleteSchemasConfig(flags, context), {
    output,
    apiClient,
    jsonReader,
    manifestExtractor
  } = context;
  if (!await schemaStoreOutStrings.ensureManifestExtractSatisfied({
    schemaRequired: !0,
    extractManifest,
    manifestDir,
    manifestExtractor,
    output,
    telemetry: context.telemetry
  }))
    return "failure";
  const {
    client
  } = schemaStoreOutStrings.createSchemaApiClient(apiClient), workspaces = (await schemaStoreOutStrings.createManifestReader({
    manifestDir,
    output,
    jsonReader
  }).getManifest()).workspaces.filter((workspace) => !dataset || workspace.dataset === dataset), projectDatasets = uniqueProjectIdDataset.uniqueProjectIdDataset(workspaces), results = await Promise.allSettled(projectDatasets.flatMap(({
    projectId: targetProjectId,
    dataset: targetDataset
  }) => ids.map(async ({
    schemaId
  }) => {
    const targetClient = client.withConfig({
      projectId: targetProjectId,
      dataset: targetDataset
    });
    try {
      if (!await targetClient.getDocument(schemaId))
        return {
          projectId: targetProjectId,
          dataset: targetDataset,
          schemaId,
          deleted: !1
        };
      const deletedSchema = await targetClient.request({
        method: "DELETE",
        url: `/projects/${targetProjectId}/datasets/${targetDataset}/schemas/${schemaId}`
      });
      return {
        projectId: targetProjectId,
        dataset: targetDataset,
        schemaId,
        deleted: !!deletedSchema?.deleted
      };
    } catch (err) {
      throw new DeleteIdError({
        schemaId,
        projectId: targetProjectId,
        dataset: targetDataset,
        options: {
          cause: err
        }
      });
    }
  }))), deletedIds = results.filter((r) => r.status === "fulfilled").filter((r) => r.value.deleted).map((r) => r.value), deleteFailureIds = uniq__default.default(results.filter((r) => r.status === "rejected").map((result) => {
    const error = result.reason;
    if (error instanceof DeleteIdError)
      return output.error(chalk__default.default.red(`Failed to delete schema "${error.schemaId}" in "${schemaStoreOutStrings.projectIdDatasetPair(error)}":
${error.message}`)), verbose && output.error(error), error.schemaId;
    throw error;
  })), notFound = uniq__default.default(results.filter((r) => r.status === "fulfilled").filter((r) => !r.value.deleted).filter((r) => !deletedIds.map(({
    schemaId
  }) => schemaId).includes(r.value.schemaId) && !deleteFailureIds.includes(r.value.schemaId)).map((r) => r.value.schemaId)), success = deletedIds.length === ids.length;
  return success ? output.success(`Successfully deleted ${deletedIds.length}/${ids.length} schemas`) : output.error([`Deleted ${deletedIds.length}/${ids.length} schemas.`, deletedIds.length ? `Successfully deleted ids:
${deletedIds.map((result) => `- ${result.schemaId} (in ${schemaStoreOutStrings.projectIdDatasetPair(result)})`).join(`
`)}` : void 0, notFound.length ? `Ids not found in ${schemaStoreOutStrings.getProjectIdDatasetsOutString(projectDatasets)}:
${schemaStoreOutStrings.getStringList(notFound)}` : void 0, ...deleteFailureIds.length ? [`Failed to delete ids:
${schemaStoreOutStrings.getStringList(deleteFailureIds)}`, "Check logs for errors."] : []].filter(schemaStoreOutStrings.isDefined).join(`
`)), success ? "success" : "failure";
}
exports.default = deleteSchemasActionForCommand;
exports.deleteSchemaAction = deleteSchemaAction;
//# sourceMappingURL=deleteSchemaAction.js.map
