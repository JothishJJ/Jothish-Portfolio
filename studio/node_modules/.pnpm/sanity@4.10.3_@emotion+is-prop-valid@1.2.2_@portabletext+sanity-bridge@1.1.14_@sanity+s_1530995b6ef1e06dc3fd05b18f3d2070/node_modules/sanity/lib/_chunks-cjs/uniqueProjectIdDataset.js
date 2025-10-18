"use strict";
var uniqBy = require("lodash/uniqBy");
function _interopDefaultCompat(e) {
  return e && typeof e == "object" && "default" in e ? e : { default: e };
}
var uniqBy__default = /* @__PURE__ */ _interopDefaultCompat(uniqBy);
function uniqueProjectIdDataset(workspaces) {
  return uniqBy__default.default(workspaces.map((w) => ({
    key: `${w.projectId}-${w.dataset}`,
    projectId: w.projectId,
    dataset: w.dataset
  })), "key");
}
exports.uniqueProjectIdDataset = uniqueProjectIdDataset;
//# sourceMappingURL=uniqueProjectIdDataset.js.map
