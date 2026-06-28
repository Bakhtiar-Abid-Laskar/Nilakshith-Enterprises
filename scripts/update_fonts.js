const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = [
  'index.html',
  'broadband.html',
  'cctv.html',
  'networking.html',
  'about.html',
  'contact.html',
  'privacy.html'
].map(file => path.join(rootDir, file));

htmlFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace font displays
    const updated = content.replace(/display=swap/g, 'display=optional');
    if (updated !== content) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`Updated fonts to display=optional in ${path.basename(filePath)}`);
    }
  }
});
