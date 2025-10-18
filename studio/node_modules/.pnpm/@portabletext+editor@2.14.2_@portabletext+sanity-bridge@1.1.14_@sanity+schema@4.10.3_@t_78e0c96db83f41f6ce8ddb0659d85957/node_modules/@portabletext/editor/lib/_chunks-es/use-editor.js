import React, { createContext } from "react";
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
  return typeof document > "u" ? createContext(defaultValue) : (globalScope[symbol] = globalScope[symbol] ?? createContext(defaultValue), globalScope[symbol]);
}
const EditorContext = createGloballyScopedContext("@portabletext/editor/context/editor", null);
function useEditor() {
  const editor = React.useContext(EditorContext);
  if (!editor)
    throw new Error("No Editor set. Use EditorProvider to set one.");
  return editor;
}
export {
  EditorContext,
  useEditor
};
//# sourceMappingURL=use-editor.js.map
