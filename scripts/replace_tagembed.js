const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../index.html');
let content = fs.readFileSync(filePath, 'utf8');

const target = /<!-- Tagembed Google Reviews Widget - ID 328135 -->[\s\S]*?<\/iframe>[\s\S]*?<\/div>/;
const replacement = `<!-- Tagembed Google Reviews Widget - ID 328135 -->
        <div class="tagembed-widget-container" id="tagembed-container" data-animate="fade-up" data-animate-delay="150" style="min-height: 400px; display: flex; align-items: center; justify-content: center; background: var(--color-bg-surface);">
          <div style="color: var(--color-text-secondary); font-size: 0.9rem;">Loading reviews...</div>
        </div>`;

if (target.test(content)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully replaced Tagembed widget in index.html!');
} else {
  console.error('Could not find Tagembed widget pattern in index.html');
}
