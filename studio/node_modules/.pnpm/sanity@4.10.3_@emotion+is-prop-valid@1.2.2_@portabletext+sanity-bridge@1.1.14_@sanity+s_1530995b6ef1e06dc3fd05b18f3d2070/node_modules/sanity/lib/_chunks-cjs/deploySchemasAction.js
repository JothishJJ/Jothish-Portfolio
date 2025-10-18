"use strict";
var chalk = require("chalk"), partition = require("lodash/partition"), schemaStoreOutStrings = require("./schemaStoreOutStrings.js");
function _interopDefaultCompat(e) {
  return e && typeof e == "object" && "default" in e ? e : { default: e };
}
var chalk__default = /* @__PURE__ */ _interopDefaultCompat(chalk), partition__default = /* @__PURE__ */ _interopDefaultCompat(partition);
function getWorkspaceSchemaId(args) {
  const {
    workspaceName: rawWorkspaceName,
    tag
  } = args;
  let workspaceName = rawWorkspaceName, idWarning;
  workspaceName.match(schemaStoreOutStrings.validForNamesPattern) || (workspaceName = workspaceName.replace(new RegExp(`[^${schemaStoreOutStrings.validForNamesChars}]`, "g"), "_"), idWarning = [`Workspace "${rawWorkspaceName}" contains characters unsupported by schema _id [${schemaStoreOutStrings.validForNamesChars}], they will be replaced with _.`, "This could lead duplicate schema ids: consider renaming your workspace."].join(`
`));
  const safeBaseId = `${schemaStoreOutStrings.SANITY_WORKSPACE_SCHEMA_ID_PREFIX}.${workspaceName}`;
  return {
    safeBaseId,
    safeTaggedId: `${safeBaseId}${tag ? `.${tag}` : ""}`,
    idWarning
  };
}
function deploySchemasActionForCommand(flags, context) {
  return deploySchemasAction({
    ...flags,
    //invoking the command through CLI implies that schema is required
    "schema-required": !0
  }, {
    ...context,
    manifestExtractor: schemaStoreOutStrings.createManifestExtractor(context)
  });
}
async function deploySchemasAction(flags, context) {
  const {
    workspaceName,
    verbose,
    tag,
    manifestDir,
    extractManifest,
    schemaRequired
  } = schemaStoreOutStrings.parseDeploySchemasConfig(flags, context), {
    output,
    apiClient,
    jsonReader,
    manifestExtractor,
    telemetry
  } = context;
  if (!await schemaStoreOutStrings.ensureManifestExtractSatisfied({
    schemaRequired,
    extractManifest,
    manifestDir,
    manifestExtractor,
    output,
    telemetry
  }))
    return "failure";
  const trace = context.telemetry.trace(schemaStoreOutStrings.SchemaDeploy, {
    manifestDir,
    schemaRequired,
    workspaceName,
    tag,
    extractManifest
  });
  try {
    trace.start();
    const {
      client
    } = schemaStoreOutStrings.createSchemaApiClient(apiClient), manifestReader = schemaStoreOutStrings.createManifestReader({
      manifestDir,
      output,
      jsonReader
    }), manifest = await manifestReader.getManifest(), storeWorkspaceSchema = createStoreWorkspaceSchema({
      tag,
      verbose,
      client,
      output,
      manifestReader
    }), targetWorkspaces = manifest.workspaces.filter((workspace) => !workspaceName || workspace.name === workspaceName);
    if (!targetWorkspaces.length)
      throw workspaceName ? new schemaStoreOutStrings.FlagValidationError(`Found no workspaces named "${workspaceName}"`) : new Error("Workspace array in manifest is empty.");
    const results = await Promise.allSettled(targetWorkspaces.map(async (workspace) => {
      await storeWorkspaceSchema(workspace);
    })), [successes, failures] = partition__default.default(results, (result) => result.status === "fulfilled");
    if (failures.length)
      throw new Error(`Failed to deploy ${failures.length}/${targetWorkspaces.length} schemas. Successfully deployed ${successes.length}/${targetWorkspaces.length} schemas.`);
    return trace.complete(), output.success(`Deployed ${successes.length}/${targetWorkspaces.length} schemas`), "success";
  } catch (err) {
    if (trace.error(err), schemaRequired || err instanceof schemaStoreOutStrings.FlagValidationError)
      throw err;
    return output.print(`\u21B3 Error when storing schemas:
  ${err.message}`), "failure";
  } finally {
    context.output.print(`${chalk__default.default.gray("\u21B3 List deployed schemas with:")} ${chalk__default.default.cyan("sanity schema list")}`);
  }
}
function createStoreWorkspaceSchema(args) {
  const {
    tag,
    verbose,
    client,
    output,
    manifestReader
  } = args;
  return async (workspace) => {
    const {
      safeBaseId: id,
      idWarning
    } = getWorkspaceSchemaId({
      workspaceName: workspace.name,
      tag
    });
    idWarning && output.warn(idWarning);
    try {
      const schema = await manifestReader.getWorkspaceSchema(workspace.name), storedWorkspaceSchema = {
        version: schemaStoreOutStrings.CURRENT_WORKSPACE_SCHEMA_VERSION,
        tag,
        workspace: {
          name: workspace.name,
          title: workspace.title
        },
        // the API will stringify the schema – we send as JSON
        schema
      };
      await client.withConfig({
        dataset: workspace.dataset,
        projectId: workspace.projectId
      }).request({
        method: "PUT",
        url: `/projects/${workspace.projectId}/datasets/${workspace.dataset}/schemas`,
        body: {
          schemas: [storedWorkspaceSchema]
        }
      }), verbose && output.print(chalk__default.default.gray(`\u21B3 schemaId: ${id}, projectId: ${workspace.projectId}, dataset: ${workspace.dataset}`));
    } catch (err) {
      throw "statusCode" in err && err?.statusCode === 401 ? output.error(`\u21B3 No permissions to write schema for workspace "${workspace.name}" \u2013 ${schemaStoreOutStrings.projectIdDatasetPair(workspace)}. ${schemaStoreOutStrings.SCHEMA_PERMISSION_HELP_TEXT}:
  ${chalk__default.default.red(`${err.message}`)}`) : output.error(`\u21B3 Error deploying schema for workspace "${workspace.name}":
  ${chalk__default.default.red(`${err.message}`)}`), err;
    }
  };
}
exports.default = deploySchemasActionForCommand;
exports.deploySchemasAction = deploySchemasAction;
//# sourceMappingURL=deploySchemasAction.js.map
