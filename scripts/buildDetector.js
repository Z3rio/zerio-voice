const fs = require("node:fs");
const path = require("node:path");

const distFolder = path.join(GetResourcePath(GetCurrentResourceName()), "dist");

if (!fs.existsSync(distFolder)) {
  setInterval(() => {
    console.log("\n^1==============================================\n");
    console.log(
      "Seems like you are trying to use an unbuilt version of zerio-voice on your server.",
    );
    console.log(
      "This was most likely caused by downloading zerio-voice's source, instead of one of the releases",
    );
    console.log(
      "You can find all releases of zerio-voice here: https://github.com/Z3rio/zerio-voice/releases",
    );
    console.log("\n^1==============================================\n^0");
  }, 2500);
}
