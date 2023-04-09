

const fs = require('fs');
const path = require('path');

const assetsDir = __dirname;
const outputFilePath = path.join(__dirname + './../app/data', 'assets.ts');
const assets = {};

// Recursively traverse the directories and subdirectories within the assets folder
function traverseDirectories(dir, parent) {
  const files = fs.readdirSync(dir);

  // Filter out files that are located directly in the assets directory
  const filteredFiles = files.filter(file => {
    const filePath = path.join(dir, file);
    return fs.statSync(filePath).isDirectory() || (fs.statSync(filePath).isFile() && path.dirname(filePath) !== assetsDir);
  });

  // Check if this directory contains only files, not subdirectories
  if (filteredFiles.every(file => fs.statSync(path.join(dir, file)).isFile())) {
    const fileNames = filteredFiles.map(file => file);
    parent[path.basename(dir)] = fileNames;

  } else {
    const subDirs = {};

    filteredFiles.forEach(file => {
      const filePath = path.join(dir, file);

      if (fs.statSync(filePath).isDirectory()) {
        traverseDirectories(filePath, subDirs);
      } else {
        subDirs[file] = file;
      }
    });
    parent[path.basename(dir)] = subDirs;
  }
}

traverseDirectories(assetsDir, assets);

const fileContent = `export const assets: any = JSON.parse('${JSON.stringify(assets.assets)}');`;
fs.writeFileSync(outputFilePath, fileContent);

console.log('[*] Assets successfully indexed!');
