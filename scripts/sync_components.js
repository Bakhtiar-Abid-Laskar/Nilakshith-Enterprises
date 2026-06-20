const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const componentsDir = path.join(rootDir, 'components');

const headerPath = path.join(componentsDir, 'header.html');
const footerPath = path.join(componentsDir, 'footer.html');

if (!fs.existsSync(headerPath) || !fs.existsSync(footerPath)) {
  console.error('Error: Component files not found in components/ directory.');
  process.exit(1);
}

const headerContent = fs.readFileSync(headerPath, 'utf8').trim();
const footerContent = fs.readFileSync(footerPath, 'utf8').trim();

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
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Sync Header
  const headerStartTag = '<!-- HEADER_START -->';
  const headerEndTag = '<!-- HEADER_END -->';
  if (content.includes(headerStartTag) && content.includes(headerEndTag)) {
    // Sync using markers
    const regex = new RegExp(`${headerStartTag}[\\s\\S]*?${headerEndTag}`, 'i');
    content = content.replace(regex, `${headerStartTag}\n${headerContent}\n${headerEndTag}`);
    modified = true;
  } else {
    // Initial run: Wrap existing <header> tag
    const regex = /<header[\s\S]*?<\/header>/i;
    if (regex.test(content)) {
      content = content.replace(regex, `${headerStartTag}\n${headerContent}\n${headerEndTag}`);
      modified = true;
      console.log(`[Header Wrapped] ${path.basename(filePath)}`);
    } else {
      console.warn(`Warning: No <header> tag found in ${path.basename(filePath)}`);
    }
  }

  // 2. Sync Footer
  const footerStartTag = '<!-- FOOTER_START -->';
  const footerEndTag = '<!-- FOOTER_END -->';
  if (content.includes(footerStartTag) && content.includes(footerEndTag)) {
    // Sync using markers
    const regex = new RegExp(`${footerStartTag}[\\s\\S]*?${footerEndTag}`, 'i');
    content = content.replace(regex, `${footerStartTag}\n${footerContent}\n${footerEndTag}`);
    modified = true;
  } else {
    // Initial run: Wrap existing <footer> tag to the end of the file (before body/html)
    const regex = /<footer[\s\S]*?<\/html>/i;
    if (regex.test(content)) {
      content = content.replace(regex, `${footerStartTag}\n${footerContent}\n${footerEndTag}\n</body>\n</html>`);
      modified = true;
      console.log(`[Footer Wrapped] ${path.basename(filePath)}`);
    } else {
      console.warn(`Warning: No <footer> tag found in ${path.basename(filePath)}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully synced: ${path.basename(filePath)}`);
  }
});
