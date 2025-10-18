"use strict";
var chalk = require("chalk"), sortBy = require("lodash/sortBy"), schemaStoreOutStrings = require("./schemaStoreOutStrings.js"), uniqueProjectIdDataset = require("./uniqueProjectIdDataset.js");
function _interopDefaultCompat(e) {
  return e && typeof e == "object" && "default" in e ? e : { default: e };
}
var chalk__default = /* @__PURE__ */ _interopDefaultCompat(chalk), sortBy__default = /* @__PURE__ */ _interopDefaultCompat(sortBy);
class DatasetError extends Error {
  constructor(args) {
    super(args.options?.cause?.message, args.options), this.projectId = args.projectId, this.dataset = args.dataset, this.name = "DatasetError";
  }
}
function listSchemasActionForCommand(flags, context) {
  return listSchemasAction(flags, {
    ...context,
    manifestExtractor: schemaStoreOutStrings.createManifestExtractor(context)
  });
}
async function listSchemasAction(flags, context) {
  const {
    json,
    id,
    manifestDir,
    extractManifest
  } = schemaStoreOutStrings.parseListSchemasConfig(flags, context), {
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
  } = schemaStoreOutStrings.createSchemaApiClient(apiClient), manifest = await schemaStoreOutStrings.createManifestReader({
    manifestDir,
    output,
    jsonReader
  }).getManifest(), projectDatasets = uniqueProjectIdDataset.uniqueProjectIdDataset(manifest.workspaces), schemas = (await Promise.allSettled(projectDatasets.map(async ({
    projectId,
    dataset
  }) => {
    try {
      const datasetClient = client.withConfig({
        projectId,
        dataset
      });
      return id ? await datasetClient.request({
        method: "GET",
        url: `/projects/${projectId}/datasets/${dataset}/schemas/${id}`
      }) : await datasetClient.request({
        method: "GET",
        url: `/projects/${projectId}/datasets/${dataset}/schemas`
      });
    } catch (error) {
      throw new DatasetError({
        projectId,
        dataset,
        options: {
          cause: error
        }
      });
    }
  }))).map((result) => {
    if (result.status === "fulfilled") return result.value;
    const error = result.reason;
    if (error instanceof DatasetError) {
      if ("cause" in error && error.cause && typeof error.cause == "object" && "statusCode" in error.cause && error.cause.statusCode === 401)
        return output.warn(`\u21B3 No permissions to read schema from ${schemaStoreOutStrings.projectIdDatasetPair(error)}. ${schemaStoreOutStrings.SCHEMA_PERMISSION_HELP_TEXT}:
  ${chalk__default.default.red(`${error.message}`)}`), [];
      const message = chalk__default.default.red(`\u21B3 Failed to fetch schema from ${schemaStoreOutStrings.projectIdDatasetPair(error)}:
  ${error.message}`);
      output.error(message);
    } else
      throw error;
    return [];
  }).filter(schemaStoreOutStrings.isDefined).flat();
  if (schemas.length === 0) {
    const datasetString = schemaStoreOutStrings.getProjectIdDatasetsOutString(projectDatasets);
    return output.error(id ? `Schema for id "${id}" not found in ${datasetString}` : `No schemas found in ${datasetString}`), "failure";
  }
  return json ? output.print(`${JSON.stringify(id ? schemas[0] : schemas, null, 2)}`) : printSchemaList({
    schemas,
    output,
    manifest
  }), "success";
}
function printSchemaList({
  schemas,
  output,
  manifest
}) {
  const ordered = sortBy__default.default(schemas.map(({
    _createdAt: createdAt,
    _id: id,
    workspace
  }) => {
    const workspaceData = manifest.workspaces.find((w) => w.name === workspace.name);
    if (workspaceData)
      return [id, workspace.name, workspaceData.dataset, workspaceData.projectId, createdAt].map(String);
  }).filter(schemaStoreOutStrings.isDefined), ["createdAt"]), headings = ["Id", "Workspace", "Dataset", "ProjectId", "CreatedAt"], rows = ordered.reverse(), maxWidths = rows.reduce((max, row) => row.map((current, index) => Math.max(current.length, max[index])), headings.map((str) => str.length)), rowToString = (row) => row.map((col, i) => `${col}`.padEnd(maxWidths[i])).join("   ");
  output.print(chalk__default.default.cyan(rowToString(headings))), rows.forEach((row) => output.print(rowToString(row)));
}
exports.default = listSchemasActionForCommand;
exports.listSchemasAction = listSchemasAction;
//# sourceMappingURL=listSchemasAction.js.map
