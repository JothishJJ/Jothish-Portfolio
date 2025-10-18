"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
function execute(event) {
  return {
    type: "execute",
    event
  };
}
function forward(event) {
  return {
    type: "forward",
    event
  };
}
function raise(event) {
  return {
    type: "raise",
    event
  };
}
function effect(effect2) {
  return {
    type: "effect",
    effect: effect2
  };
}
function defineBehavior(behavior) {
  return behavior;
}
exports.defineBehavior = defineBehavior;
exports.effect = effect;
exports.execute = execute;
exports.forward = forward;
exports.raise = raise;
//# sourceMappingURL=index.cjs.map
