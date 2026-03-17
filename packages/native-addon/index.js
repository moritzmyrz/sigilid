const load = require("node-gyp-build");

function loadBinary() {
  try {
    return load(__dirname);
  } catch (releaseError) {
    try {
      return require("./build/Debug/sigilid_native.node");
    } catch {
      throw releaseError;
    }
  }
}

module.exports = loadBinary();
