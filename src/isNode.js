
export const workerShim = function () {
  if (typeof WorkerGlobalScope !== "undefined") {
    Object.assign(globalThis, WorkerGlobalScope);
    globalThis.window = globalThis;
  }
};
export const isNode = !!(
  typeof process !== "undefined" &&
  process.versions &&
  process.versions.node
);
