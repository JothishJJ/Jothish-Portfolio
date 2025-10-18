"use strict";
var jsxRuntime = require("react/jsx-runtime"), reactCompilerRuntime = require("react-compiler-runtime"), reactRefractor = require("react-refractor");
function LazyRefractor(props) {
  const $ = reactCompilerRuntime.c(13), {
    language: languageProp,
    value
  } = props, language = typeof languageProp == "string" ? languageProp : void 0;
  let t0;
  $[0] !== language ? (t0 = language ? reactRefractor.hasLanguage(language) : !1, $[0] = language, $[1] = t0) : t0 = $[1];
  const registered = t0;
  let t1;
  $[2] !== language || $[3] !== registered || $[4] !== value ? (t1 = !(language && registered) && /* @__PURE__ */ jsxRuntime.jsx("code", { children: value }), $[2] = language, $[3] = registered, $[4] = value, $[5] = t1) : t1 = $[5];
  let t2;
  $[6] !== language || $[7] !== registered || $[8] !== value ? (t2 = language && registered && /* @__PURE__ */ jsxRuntime.jsx(reactRefractor.Refractor, { inline: !0, language, value: String(value) }), $[6] = language, $[7] = registered, $[8] = value, $[9] = t2) : t2 = $[9];
  let t3;
  return $[10] !== t1 || $[11] !== t2 ? (t3 = /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    t1,
    t2
  ] }), $[10] = t1, $[11] = t2, $[12] = t3) : t3 = $[12], t3;
}
LazyRefractor.displayName = "LazyRefractor";
exports.default = LazyRefractor;
//# sourceMappingURL=refractor.js.map
