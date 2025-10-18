"use strict";
var node_crypto = require("node:crypto"), fs$1 = require("node:fs"), fs = require("node:fs/promises"), os = require("node:os"), path = require("node:path"), consumers = require("node:stream/consumers"), promises = require("node:stream/promises"), gunzipMaybe = require("gunzip-maybe"), isTar = require("is-tar"), peek = require("peek-stream"), rxjs = require("rxjs"), tar = require("tar-fs"), tinyglobby = require("tinyglobby"), _internal = require("./_internal.js"), determineTargetMediaLibrary = require("./determineTargetMediaLibrary.js"), readline = require("node:readline");
function _interopDefaultCompat(e) {
  return e && typeof e == "object" && "default" in e ? e : { default: e };
}
var fs__default = /* @__PURE__ */ _interopDefaultCompat(fs), path__default = /* @__PURE__ */ _interopDefaultCompat(path), gunzipMaybe__default = /* @__PURE__ */ _interopDefaultCompat(gunzipMaybe), isTar__default = /* @__PURE__ */ _interopDefaultCompat(isTar), peek__default = /* @__PURE__ */ _interopDefaultCompat(peek), tar__default = /* @__PURE__ */ _interopDefaultCompat(tar), readline__default = /* @__PURE__ */ _interopDefaultCompat(readline);
async function* findNdjsonEntry(ndjson, matcher) {
  const lines = readline__default.default.createInterface({
    input: ndjson
  });
  for await (const line of lines) {
    const parsed = JSON.parse(line.trim());
    if (matcher(parsed)) {
      yield parsed, lines.close();
      return;
    }
  }
  yield void 0;
}
const debug = _internal.debug.extend("importMedia"), DEFAULT_CONCURRENCY = 6, importAssetsAction = async (args, context) => {
  const {
    output,
    apiClient,
    chalk
  } = context, [importSourcePath] = args.argsWithoutOptions, replaceAspects = args.extOptions["replace-aspects"] ?? !1, mediaLibraryId = args.extOptions["media-library-id"] ?? await determineTargetMediaLibrary.determineTargetMediaLibrary(context), client = apiClient().withConfig({
    apiVersion: determineTargetMediaLibrary.MINIMUM_API_VERSION,
    requestTagPrefix: "sanity.mediaLibraryCli.import",
    "~experimental_resource": {
      type: "media-library",
      id: mediaLibraryId
    },
    perspective: "drafts"
  });
  output.print(), output.print(`Importing to media library: ${chalk.bold(mediaLibraryId)}`), output.print(`Importing from path: ${chalk.bold(importSourcePath)}`), output.print();
  const spinner = output.spinner("Beginning import\u2026").start();
  importer({
    client,
    sourcePath: importSourcePath,
    replaceAspects,
    chalk,
    spinner,
    output
  }).pipe(reportResult({
    chalk,
    spinner
  })).subscribe({
    error: (error) => {
      spinner.stop(), output.error(error);
    }
  });
};
function importer(options) {
  return resolveSource(options).pipe(rxjs.mergeMap(({
    files,
    images,
    aspectsNdjsonPath,
    workingPath
  }) => {
    const fileCount = files.length + images.length;
    if (fileCount === 0)
      throw new Error("No assets to import");
    const context = {
      ...options,
      workingPath,
      ndjson: () => fs$1.createReadStream(aspectsNdjsonPath)
    };
    return rxjs.from(files).pipe(rxjs.switchMap((file) => rxjs.zip(rxjs.of("file"), rxjs.of(file))), rxjs.mergeWith(rxjs.from(images).pipe(rxjs.switchMap((file) => rxjs.zip(rxjs.of("image"), rxjs.of(file))))), fetchExistingAssets(context), uploadAsset(context), resolveAspectData(context), setAspects(context), rxjs.map((asset) => ({
      asset,
      fileCount
    })));
  }));
}
function resolveSource({
  sourcePath,
  chalk
}) {
  return rxjs.from(fs__default.default.stat(sourcePath)).pipe(rxjs.switchMap((stats) => stats.isDirectory() ? rxjs.of(sourcePath) : rxjs.from(fs.mkdtemp(path__default.default.join(os.tmpdir(), "sanity-media-library-import"))).pipe(rxjs.switchMap((tempPath) => rxjs.from(promises.pipeline(fs$1.createReadStream(sourcePath), gunzipMaybe__default.default(), untarMaybe(tempPath))).pipe(rxjs.map(() => tempPath))))), rxjs.switchMap((importSourcePath) => rxjs.from(tinyglobby.glob(["**/data.ndjson"], {
    cwd: importSourcePath,
    deep: 2,
    absolute: !0
  })).pipe(rxjs.map(([aspectsNdjsonPath]) => ({
    aspectsNdjsonPath,
    importSourcePath,
    workingPath: typeof aspectsNdjsonPath > "u" ? importSourcePath : path__default.default.dirname(aspectsNdjsonPath)
  })))), rxjs.tap(({
    aspectsNdjsonPath,
    importSourcePath
  }) => {
    if (typeof aspectsNdjsonPath > "u")
      throw new Error(`No ${chalk.bold("data.ndjson")} file found in import source ${chalk.bold(importSourcePath)}`);
    debug(`[Found NDJSON file] ${aspectsNdjsonPath}`);
  }), rxjs.switchMap(({
    aspectsNdjsonPath,
    workingPath
  }) => rxjs.from(Promise.all([tinyglobby.glob(["files/*"], {
    cwd: workingPath
  }), tinyglobby.glob(["images/*"], {
    cwd: workingPath
  })])).pipe(rxjs.map(([files, images]) => ({
    files,
    images,
    aspectsNdjsonPath,
    workingPath
  })))));
}
function untarMaybe(outputPath) {
  return peek__default.default({
    newline: !1,
    maxBuffer: 300
  }, (data, swap) => isTar__default.default(data) ? swap(null, tar__default.default.extract(outputPath)) : swap(null));
}
function fetchAssetsByHash({
  client,
  type
}) {
  return rxjs.switchMap((hash) => client.observable.fetch(`*[
          _type == "sanity.asset" &&
          currentVersion._ref == *[
            _type == $type &&
            sha1hash == $hash
          ][0]._id
        ]._id`, {
    type: ["sanity", `${type}Asset`].join("."),
    hash
  }, {
    tag: "asset.getId"
  }).pipe(rxjs.switchMap((assetIds) => rxjs.zip(rxjs.of(hash), rxjs.of(assetIds)))));
}
function fetchExistingAssets({
  client,
  workingPath
}) {
  return rxjs.mergeMap(([type, asset]) => {
    const createSha1Hash = node_crypto.createHash("sha1"), sha1hash = consumers.text(fs$1.createReadStream(path__default.default.join(workingPath, asset)).pipe(createSha1Hash).setEncoding("hex"));
    return rxjs.from(sha1hash).pipe(rxjs.tap((hash) => debug(`[Asset ${asset}] Checking for ${type} asset with hash ${hash}`)), fetchAssetsByHash({
      client,
      type
    }), rxjs.map(([hash, assetIds]) => assetIds.length === 0 ? [type, asset, hash] : {
      originalFilename: asset,
      sha1Hash: hash,
      assetIds,
      isExistingAsset: !0
    }));
  });
}
function resolveAspectData({
  ndjson
}) {
  return rxjs.mergeMap((resolvedAsset) => rxjs.from(findNdjsonEntry(ndjson(), (line) => typeof line == "object" && line !== null && "filename" in line && line.filename === resolvedAsset.originalFilename)).pipe(rxjs.map((aspectsFromImport) => ({
    ...resolvedAsset,
    aspects: aspectsFromImport?.aspects
  }))));
}
function setAspects({
  client,
  replaceAspects
}) {
  return rxjs.mergeMap((asset) => {
    const {
      assetIds,
      isExistingAsset,
      aspects
    } = asset;
    if (isExistingAsset && !replaceAspects)
      return debug(`[Asset ${asset.originalFilename}] Skipping replacement of existing aspects`), rxjs.of(asset);
    if (typeof aspects > "u")
      return debug(`[Asset ${asset.originalFilename}] No aspects to import`), rxjs.of(asset);
    const transaction = assetIds.reduce((previous, assetId) => previous.patch(assetId, {
      set: {
        aspects
      }
    }), client.observable.transaction());
    return debug(`[Asset ${asset.originalFilename}] Setting aspects on asset documents ${JSON.stringify(assetIds)}`), transaction.commit({
      visibility: "async",
      tag: "asset.setAspects"
    }).pipe(rxjs.map(() => asset));
  }, DEFAULT_CONCURRENCY);
}
function uploadAsset({
  workingPath,
  client
}) {
  return rxjs.mergeMap((maybeResolvedAsset) => {
    if ("assetIds" in maybeResolvedAsset)
      return debug(`[Asset ${maybeResolvedAsset.originalFilename}] Skipping upload of existing asset with hash ${maybeResolvedAsset.sha1Hash}`), rxjs.of(maybeResolvedAsset);
    const [type, asset, hash] = maybeResolvedAsset;
    return debug(`[Asset ${asset}] Uploading new asset`), client.observable.assets.upload(type, fs$1.createReadStream(path__default.default.join(workingPath, asset)), {
      tag: "asset.upload"
    }).pipe(
      rxjs.catchError((error) => (error.statusCode === 409 && debug(`[Asset ${asset}] Cannot overwrite existing ${type} asset with hash ${hash}`), rxjs.EMPTY)),
      rxjs.filter((response) => response.type === "response"),
      rxjs.tap(() => debug(`[Asset ${asset}] Finished uploading new asset`)),
      // TODO: The `client.assets.upload` method should return `MediaLibraryUploadResponse` when operating on Media Library resources. When that occurs, this type assertion can be removed.
      rxjs.map((response) => response.body),
      rxjs.map((result) => ({
        assetIds: [result.asset._id],
        originalFilename: asset,
        sha1Hash: hash,
        isExistingAsset: !1
      }))
    );
  }, DEFAULT_CONCURRENCY);
}
function reportResult({
  chalk,
  spinner
}) {
  let previousState;
  return rxjs.pipe(rxjs.scan((processedAssetsCount, state) => [processedAssetsCount[0] + 1, state], [0, void 0]), rxjs.tap({
    next: ([processedAssetsCount, state]) => {
      previousState = state, spinner.text = `${processedAssetsCount} of ${state?.fileCount} assets imported ${chalk.dim(state?.asset.originalFilename)}`;
    },
    complete: () => spinner.succeed(`Imported ${previousState?.fileCount} assets`)
  }));
}
exports.default = importAssetsAction;
exports.importer = importer;
exports.resolveSource = resolveSource;
exports.setAspects = setAspects;
//# sourceMappingURL=importAssetsAction.js.map
