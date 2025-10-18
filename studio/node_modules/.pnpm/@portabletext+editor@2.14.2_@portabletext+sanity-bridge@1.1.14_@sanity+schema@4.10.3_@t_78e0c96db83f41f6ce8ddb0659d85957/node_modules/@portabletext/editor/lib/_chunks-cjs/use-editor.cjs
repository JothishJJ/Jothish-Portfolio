"use strict";
var React = require("react");
function _interopDefaultCompat(e) {
  return e && typeof e == "object" && "default" in e ? e : { default: e };
}
var React__default = /* @__PURE__ */ _interopDefaultCompat(React);
function getGlobalScope() {
  if (typeof globalThis < "u") return globalThis;
  if (typeof window < "u") return window;
  if (typeof self < "u") return self;
  if (typeof global < "u") return global;
  throw new Error("@portabletext/editor: could not locate global scope");
}
const globalScope = getGlobalScope();
function createGloballyScopedContext(key, defaultValue) {
  const symbol = Symbol.for(key);
  return typeof document > "u" ? React.createContext(defaultValue) : (globalScope[symbol] = globalScope[symbol] ?? React.createContext(defaultValue), globalScope[symbol]);
}
const EditorContext = createGloballyScopedContext("@portabletext/editor/context/editor", null);
function useEditor() {
  const editor = React__default.default.useContext(EditorContext);
  if (!editor)
    throw new Error("No Editor set. Use EditorProvider to set one.");
  return editor;
}
exports.EditorContext = EditorContext;
exports.useEditor = useEditor;
//# sourceMappingURL=use-editor.cjs.map
