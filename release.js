const publishRelease = require("publish-release");
const path = require("path");
const packageJson = require("./package.json");
const files = ["gym-membership-setup-" + packageJson.version + "-win.exe"];
const fs = require("fs");
const distFolder = "./dist";
const assets = files.map((file) => path.join("./dist", file));
const options = {
  token: process.env.GH_TOKEN,
  owner: packageJson.publish.owner,
  repo: packageJson.publish.repo,
  tag: `v${packageJson.version}`,
  name: `v${packageJson.version}`,
  notes: "",
  draft: true,
  prerelease: false,
  reuseRelease: true,
  reuseDraftOnly: false,
  skipAssetsCheck: false,
  skipDuplicatedAssets: false,
  skipIfPublished: false,
  editRelease: false,
  deleteEmptyTag: false,
  assets: assets,
};
const missedFile = assets.find((file) => !fs.existsSync(file));
console.log(assets);
if (missedFile)
  throw new Error(
    `This file does not exist in the path ${path.join(__dirname, missedFile)} 
    the current files  are ${JSON.stringify(
      fs.readdirSync(distFolder).map((file) => path.join(distFolder, file)),
      undefined,
      2
    )}
    `
  );

publishRelease(options, function (err, release) {
  if (err) return console.error(err);
  console.log("finish Release");
  // `release`: object returned from github about the newly created release
});
