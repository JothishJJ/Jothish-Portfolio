import { defineField } from "@sanity/types";
function defineVideoField(definition) {
  return defineField({
    ...definition,
    type: "sanity.video"
  });
}
export {
  defineVideoField
};
//# sourceMappingURL=media-library.mjs.map
