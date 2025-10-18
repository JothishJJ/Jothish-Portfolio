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
export {
  defineBehavior,
  effect,
  execute,
  forward,
  raise
};
//# sourceMappingURL=index.js.map
