"use strict";
function defineQuery(query) {
  return query;
}
function defineProjection(projection) {
  return projection;
}
function groq(strings, ...keys) {
  const lastIndex = strings.length - 1;
  return strings.slice(0, lastIndex).reduce((acc, str, i) => acc + str + keys[i], "") + strings[lastIndex];
}
module.exports = groq;
Object.assign(module.exports, { defineQuery, defineProjection });
//# sourceMappingURL=groq.cjs.map
