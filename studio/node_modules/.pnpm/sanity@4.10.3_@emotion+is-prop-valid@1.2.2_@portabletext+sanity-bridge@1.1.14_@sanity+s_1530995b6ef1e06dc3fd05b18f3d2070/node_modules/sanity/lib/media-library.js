"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
var types = require("@sanity/types");
function defineVideoField(definition) {
  return types.defineField({
    ...definition,
    type: "sanity.video"
  });
}
exports.defineVideoField = defineVideoField;
//# sourceMappingURL=media-library.js.map
