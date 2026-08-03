const path = require("node:path");

const workaroundPath = path.join(__dirname, "fs-readlink-workaround.cjs").replaceAll("\\", "/");
const preloadOption = `--require=${workaroundPath}`;

process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, preloadOption].filter(Boolean).join(" ");
require(workaroundPath);

process.argv = [process.argv[0], require.resolve("next/dist/bin/next"), "dev", "--webpack"];
require("next/dist/bin/next");
