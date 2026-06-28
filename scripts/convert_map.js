const sharp = require('sharp');
const path = require('path');

const srcPath = 'C:\\Users\\bakht\\.gemini\\antigravity-ide\\brain\\7a3dea36-6142-4d6a-874a-706f42faa0ee\\map_placeholder_1782680662843.png';
const destPath = path.join(__dirname, '../assets/img/map_placeholder.webp');

sharp(srcPath)
  .resize(640, 360)
  .webp({ quality: 80 })
  .toFile(destPath)
  .then(() => console.log('Successfully saved optimized map_placeholder.webp'))
  .catch(err => console.error(err));
