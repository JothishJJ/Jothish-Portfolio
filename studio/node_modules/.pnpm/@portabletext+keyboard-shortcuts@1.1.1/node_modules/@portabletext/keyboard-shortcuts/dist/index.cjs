"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
const IS_APPLE = typeof window < "u" && /Mac|iPod|iPhone|iPad/.test(window.navigator.userAgent);
function isKeyboardShortcut(definition, event) {
  return isCorrectModifiers(definition, event) ? definition.code !== void 0 && definition.code.toLowerCase() === event.code.toLowerCase() ? !0 : definition.key !== void 0 && definition.key.toLowerCase() === event.key.toLowerCase() : !1;
}
function isCorrectModifiers(definition, event) {
  return (definition.ctrl === event.ctrlKey || definition.ctrl === void 0) && (definition.meta === event.metaKey || definition.meta === void 0) && (definition.shift === event.shiftKey || definition.shift === void 0) && (definition.alt === event.altKey || definition.alt === void 0);
}
function createKeyboardShortcut(definition) {
  if (IS_APPLE) {
    const appleDefinition = definition.apple ?? definition.default, firstDefinition2 = appleDefinition.at(0);
    return {
      guard: (event) => appleDefinition.some((definition2) => isKeyboardShortcut(definition2, event)),
      keys: [...firstDefinition2?.meta ? ["\u2318"] : [], ...firstDefinition2?.ctrl ? ["Ctrl"] : [], ...firstDefinition2?.alt ? ["Option"] : [], ...firstDefinition2?.shift ? ["Shift"] : [], ...firstDefinition2?.key !== void 0 ? [firstDefinition2.key] : firstDefinition2?.code !== void 0 ? [firstDefinition2.code] : []]
    };
  }
  const firstDefinition = definition.default.at(0);
  return {
    guard: (event) => definition.default.some((definition2) => isKeyboardShortcut(definition2, event)),
    keys: [...firstDefinition?.meta ? ["Meta"] : [], ...firstDefinition?.ctrl ? ["Ctrl"] : [], ...firstDefinition?.alt ? ["Alt"] : [], ...firstDefinition?.shift ? ["Shift"] : [], ...firstDefinition?.key !== void 0 ? [firstDefinition.key] : firstDefinition?.code !== void 0 ? [firstDefinition.code] : []]
  };
}
const bold = createKeyboardShortcut({
  default: [{
    key: "B",
    alt: !1,
    ctrl: !0,
    meta: !1,
    shift: !1
  }],
  apple: [{
    key: "B",
    alt: !1,
    ctrl: !1,
    meta: !0,
    shift: !1
  }]
}), italic = createKeyboardShortcut({
  default: [{
    key: "I",
    alt: !1,
    ctrl: !0,
    meta: !1,
    shift: !1
  }],
  apple: [{
    key: "I",
    alt: !1,
    ctrl: !1,
    meta: !0,
    shift: !1
  }]
}), code = createKeyboardShortcut({
  default: [{
    key: "'",
    alt: !1,
    ctrl: !0,
    meta: !1,
    shift: !1
  }],
  apple: [{
    key: "'",
    alt: !1,
    ctrl: !1,
    meta: !0,
    shift: !1
  }]
}), underline = createKeyboardShortcut({
  default: [{
    key: "U",
    alt: !1,
    ctrl: !0,
    meta: !1,
    shift: !1
  }],
  apple: [{
    key: "U",
    alt: !1,
    ctrl: !1,
    meta: !0,
    shift: !1
  }]
}), strikeThrough = createKeyboardShortcut({
  default: [{
    key: "X",
    alt: !1,
    ctrl: !0,
    meta: !1,
    shift: !0
  }],
  apple: [{
    key: "X",
    alt: !1,
    ctrl: !1,
    meta: !0,
    shift: !0
  }]
}), link = createKeyboardShortcut({
  default: [{
    key: "K",
    alt: !1,
    ctrl: !0,
    meta: !1,
    shift: !1
  }],
  apple: [{
    key: "K",
    alt: !1,
    ctrl: !1,
    meta: !0,
    shift: !1
  }]
}), normal = createKeyboardShortcut({
  default: [{
    key: "0",
    code: "Digit0",
    alt: !0,
    ctrl: !0,
    meta: !1,
    shift: !1
  }, {
    key: "0",
    code: "Numpad0",
    alt: !0,
    ctrl: !0,
    meta: !1,
    shift: !1
  }],
  apple: [{
    key: "0",
    code: "Digit0",
    alt: !0,
    ctrl: !1,
    meta: !0,
    shift: !1
  }, {
    key: "0",
    code: "Numpad0",
    alt: !0,
    ctrl: !1,
    meta: !0,
    shift: !1
  }]
}), h1 = createKeyboardShortcut({
  default: [{
    key: "1",
    code: "Digit1",
    alt: !0,
    ctrl: !0,
    meta: !1,
    shift: !1
  }, {
    key: "1",
    code: "Numpad1",
    alt: !0,
    ctrl: !0,
    meta: !1,
    shift: !1
  }],
  apple: [{
    key: "1",
    code: "Digit1",
    alt: !0,
    ctrl: !1,
    meta: !0,
    shift: !1
  }, {
    key: "1",
    code: "Numpad1",
    alt: !0,
    ctrl: !1,
    meta: !0,
    shift: !1
  }]
}), h2 = createKeyboardShortcut({
  default: [{
    key: "2",
    code: "Digit2",
    alt: !0,
    ctrl: !0,
    meta: !1,
    shift: !1
  }, {
    key: "2",
    code: "Numpad2",
    alt: !0,
    ctrl: !0,
    meta: !1,
    shift: !1
  }],
  apple: [{
    key: "2",
    code: "Digit2",
    alt: !0,
    ctrl: !1,
    meta: !0,
    shift: !1
  }, {
    key: "2",
    code: "Numpad2",
    alt: !0,
    ctrl: !1,
    meta: !0,
    shift: !1
  }]
}), h3 = createKeyboardShortcut({
  default: [{
    key: "3",
    code: "Digit3",
    alt: !0,
    ctrl: !0,
    meta: !1,
    shift: !1
  }, {
    key: "3",
    code: "Numpad3",
    alt: !0,
    ctrl: !0,
    meta: !1,
    shift: !1
  }],
  apple: [{
    key: "3",
    code: "Digit3",
    alt: !0,
    ctrl: !1,
    meta: !0,
    shift: !1
  }, {
    key: "3",
    code: "Numpad3",
    alt: !0,
    ctrl: !1,
    meta: !0,
    shift: !1
  }]
}), h4 = createKeyboardShortcut({
  default: [{
    key: "4",
    code: "Digit4",
    alt: !0,
    ctrl: !0,
    meta: !1,
    shift: !1
  }, {
    key: "4",
    code: "Numpad4",
    alt: !0,
    ctrl: !0,
    meta: !1,
    shift: !1
  }],
  apple: [{
    key: "4",
    code: "Digit4",
    alt: !0,
    ctrl: !1,
    meta: !0,
    shift: !1
  }, {
    key: "4",
    code: "Numpad4",
    alt: !0,
    ctrl: !1,
    meta: !0,
    shift: !1
  }]
}), h5 = createKeyboardShortcut({
  default: [{
    key: "5",
    code: "Digit5",
    alt: !0,
    ctrl: !0,
    meta: !1,
    shift: !1
  }, {
    key: "5",
    code: "Numpad5",
    alt: !0,
    ctrl: !0,
    meta: !1,
    shift: !1
  }],
  apple: [{
    key: "5",
    code: "Digit5",
    alt: !0,
    ctrl: !1,
    meta: !0,
    shift: !1
  }, {
    key: "5",
    code: "Numpad5",
    alt: !0,
    ctrl: !1,
    meta: !0,
    shift: !1
  }]
}), h6 = createKeyboardShortcut({
  default: [{
    key: "6",
    code: "Digit6",
    alt: !0,
    ctrl: !0,
    meta: !1,
    shift: !1
  }, {
    key: "6",
    code: "Numpad6",
    alt: !0,
    ctrl: !0,
    meta: !1,
    shift: !1
  }],
  apple: [{
    key: "6",
    code: "Digit6",
    alt: !0,
    ctrl: !1,
    meta: !0,
    shift: !1
  }, {
    key: "6",
    code: "Numpad6",
    alt: !0,
    ctrl: !1,
    meta: !0,
    shift: !1
  }]
}), blockquote = createKeyboardShortcut({
  default: [{
    key: "Q",
    alt: !1,
    ctrl: !0,
    meta: !1,
    shift: !0
  }]
}), undo = createKeyboardShortcut({
  default: [{
    key: "Z",
    alt: !1,
    ctrl: !0,
    meta: !1,
    shift: !1
  }],
  apple: [{
    key: "Z",
    alt: !1,
    ctrl: !1,
    meta: !0,
    shift: !1
  }]
}), redo = createKeyboardShortcut({
  default: [{
    key: "Y",
    alt: !1,
    ctrl: !0,
    meta: !1,
    shift: !1
  }, {
    key: "Z",
    alt: !1,
    ctrl: !0,
    meta: !1,
    shift: !0
  }],
  apple: [{
    key: "Z",
    alt: !1,
    ctrl: !1,
    meta: !0,
    shift: !0
  }]
});
exports.blockquote = blockquote;
exports.bold = bold;
exports.code = code;
exports.createKeyboardShortcut = createKeyboardShortcut;
exports.h1 = h1;
exports.h2 = h2;
exports.h3 = h3;
exports.h4 = h4;
exports.h5 = h5;
exports.h6 = h6;
exports.italic = italic;
exports.link = link;
exports.normal = normal;
exports.redo = redo;
exports.strikeThrough = strikeThrough;
exports.underline = underline;
exports.undo = undo;
//# sourceMappingURL=index.cjs.map
