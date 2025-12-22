const fs = require('fs');
const path = require('path');

const generateFileTree = (dir, prefix = '') => {
  if (!fs.existsSync(dir)) {
    console.error(`Error: El directorio ${dir} no existe.`);
    return '';
  }

  const items = fs.readdirSync(dir);
  return items
    .map((item, index) => {
      const isLastItem = index === items.length - 1;
      const newPrefix = prefix + (isLastItem ? '└── ' : '├── ');
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);

      const output = `${newPrefix}${item}\n`;

      if (stats.isDirectory()) {
        return output + generateFileTree(itemPath, prefix + (isLastItem ? '    ' : '│   '));
      }

      return output;
    })
    .join('');
};

const rootDir = path.resolve();
const subDir = 'src';
const projectDir = path.resolve(rootDir, subDir);

const tree = generateFileTree(projectDir);
if (tree) {
  fs.writeFileSync('file_structure.txt', tree);
  console.log('File structure saved to file_structure.txt');
}
//node detailFileSystem.js
