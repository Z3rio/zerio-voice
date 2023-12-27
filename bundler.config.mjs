export default {
  name: "zerio-voice",
  tasks: ["pnpm build"],
  ignore: [
    ".git",
    ".github",
    ".gitignore",
    ".gitattributes",

    "bundle.ps1",
    "bundler.config.js",
    "bundler.config.mjs",

    "turbo.json",
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",

    ".fxap",
    "package.json",
    "node_modules",
    ".turbo",
    "apps",
    "packages",
    ".nvmrc",
    ".vscode",

    "zerio-invoice.zip",
  ],
};
