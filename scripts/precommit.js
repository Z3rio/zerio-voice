const fs = require("node:fs");
const path = require("node:path");

function notAllowed(reason) {
  console.log(`You can't commit, reason: ${reason}\n`);
  process.exit(1);
}

function allowed() {
  process.exit(0);
}

function fxManifestContainsDevUiPage(text) {
  const lines = text
    .split(/\r?\n|\r|\n/g)
    .filter((line) => line.includes("ui_page"));

  for (const line of lines) {
    if (line.includes("--") == false && line.includes("localhost") == true) {
      return true;
    }
  }

  return false;
}

const fxmanifestPath = path.join(__dirname, "../", "fxmanifest.lua");

try {
  const data = fs.readFileSync(fxmanifestPath, "utf8");

  if (fxManifestContainsDevUiPage(data)) {
    notAllowed("Fxmanifest still contains dev ui_page");
  } else {
    allowed();
  }
} catch (err) {
  console.warn("err", err);
  notAllowed("Error whilst reading fxmanifest");
}
