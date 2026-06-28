const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

const rootDir = path.resolve(__dirname, '..');

const criticalCssContent = `
:root {
  --color-bg-page:        #FFFFFF;
  --color-bg-surface:     #F7F8FA;
  --color-bg-elevated:    #ECEEF2;
  --color-bg-dark:        #0F1623;
  --color-bg-dark-alt:    #1A2236;
  --color-brand:          #1A4FBF;
  --color-brand-hover:    #1540A0;
  --color-brand-light:    #EBF0FB;
  --color-brand-border:   #C5D3F5;
  --color-accent:         #F5A623;
  --color-text-primary:   #111827;
  --color-text-secondary: #4B5563;
  --color-text-tertiary:  #9CA3AF;
  --color-text-inverse:   #FFFFFF;
  --color-text-brand:     #1A4FBF;
  --color-border:         #E5E7EB;
  --color-border-strong:  #D1D5DB;
  --color-border-brand:   #C5D3F5;
  --color-success:        #16A34A;
  --color-success-bg:     #F0FDF4;
  --shadow-xs:   0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm:   0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
  --shadow-md:   0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
  --shadow-lg:   0 8px 32px rgba(0, 0, 0, 0.10), 0 4px 12px rgba(0, 0, 0, 0.05);
  --shadow-xl:   0 16px 48px rgba(0, 0, 0, 0.12), 0 6px 16px rgba(0, 0, 0, 0.06);
  --shadow-brand: 0 4px 20px rgba(26, 79, 191, 0.20);
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  24px;
  --space-6:  32px;
  --space-7:  48px;
  --space-8:  64px;
  --space-9:  96px;
  --space-10: 128px;
  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.25rem;
  --text-2xl:  1.5rem;
  --text-3xl:  1.875rem;
  --text-4xl:  2.25rem;
  --text-5xl:  3rem;
  --text-6xl:  3.75rem;
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-2xl:  24px;
  --radius-pill: 9999px;
  --transition-fast:   150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base:   250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow:   400ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
  --container-max: 1200px;
  --container-pad: clamp(16px, 5vw, 48px);
}
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html {
  scroll-behavior: smooth;
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}
body {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: var(--text-base);
  line-height: 1.65;
  color: var(--color-text-secondary);
  background-color: var(--color-bg-page);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}
header {
  height: 72px;
}
@media (max-width: 768px) {
  header {
    height: 64px;
  }
}
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 72px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-bottom var(--transition-base), box-shadow var(--transition-base), height var(--transition-base);
}
@media (max-width: 768px) {
  .navbar {
    height: 64px;
  }
}
.navbar__inner {
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--container-pad);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.navbar__logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  line-height: 1.1;
  text-decoration: none;
}
.navbar__logo-img {
  height: 68px;
  width: auto;
  display: block;
}
.logo-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: var(--text-xl);
  color: var(--color-text-primary);
}
.logo-suffix {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 400;
  font-size: var(--text-xl);
  color: #003580; /* Contrast fix Phase 6C */
}
.logo-tagline {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-brand);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 1px;
}
.hero {
  position: relative;
  background-color: var(--color-bg-page);
  padding-block: var(--space-8);
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Cpath d='M-3,3 L3,-3 M0,12 L12,0 M9,15 L15,9' stroke='%231A4FBF' stroke-width='1' stroke-opacity='0.04'/%3E%3C/svg%3E");
}
@media (max-width: 768px) {
  .hero {
    min-height: auto;
    padding-block: var(--space-6);
  }
}
.hero__inner {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: var(--space-7);
}
@media (max-width: 900px) {
  .hero__inner {
    grid-template-columns: 1fr;
    text-align: center;
    gap: var(--space-6);
  }
}
.hero__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
@media (max-width: 900px) {
  .hero__content {
    align-items: center;
  }
}
.hero__badge {
  display: inline-flex;
  align-items: center;
  background-color: var(--color-brand-light);
  border: 1px solid var(--color-brand-border);
  border-radius: var(--radius-pill);
  padding: 6px 14px;
  margin-bottom: var(--space-4);
}
.hero__headline {
  font-size: var(--text-6xl);
  font-weight: 800;
  line-height: 1.1;
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
}
@media (max-width: 768px) {
  .hero__headline {
    font-size: var(--text-4xl);
  }
}
.floating-illustration {
  display: block;
  max-width: 100%;
  height: auto;
}
.preloader {
  position: fixed;
  inset: 0;
  z-index: 100000;
  background-color: var(--color-bg-page);
  display: flex !important;
  align-items: stretch !important;
  justify-content: stretch !important;
}
.skeleton-wrapper {
  width: 100%;
  max-width: var(--container-xl, 1200px);
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: flex-start;
  box-sizing: border-box;
}
.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: var(--space-7, 40px);
}
.skeleton-logo {
  width: 180px;
  height: 36px;
  border-radius: var(--radius-sm, 4px);
}
.skeleton-nav {
  width: 480px;
  height: 20px;
  border-radius: var(--radius-sm, 4px);
}
.skeleton-hero {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--space-7, 48px);
  align-items: center;
  margin-top: var(--space-6, 32px);
}
.skeleton-hero-left {
  display: flex;
  flex-direction: column;
  gap: var(--space-4, 16px);
}
.skeleton-badge {
  width: 260px;
  height: 32px;
  border-radius: var(--radius-pill, 9999px);
}
.skeleton-title {
  width: 100%;
  max-width: 520px;
  height: 110px;
  border-radius: var(--radius-md, 8px);
}
.skeleton-text {
  width: 100%;
  max-width: 580px;
  height: 64px;
  border-radius: var(--radius-sm, 4px);
}
.skeleton-ctas {
  display: flex;
  gap: var(--space-4, 16px);
  margin-top: var(--space-4, 16px);
}
.skeleton-btn {
  width: 150px;
  height: 44px;
  border-radius: var(--radius-pill, 9999px);
}
.skeleton-hero-right {
  width: 100%;
  height: 320px;
  border-radius: var(--radius-lg, 16px);
}
.skeleton-pulse {
  position: relative;
  overflow: hidden;
  background: var(--color-bg-elevated, #ECEEF2);
}
.skeleton-pulse::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: skeleton-shimmer 1.4s infinite;
  will-change: transform;
}
@keyframes skeleton-shimmer {
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%); }
}
`;

// Minify critical CSS
const minifiedCritical = new CleanCSS().minify(criticalCssContent).styles;

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
    console.warn(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Stylesheet link tags with critical CSS inlined and preloaded minified css
  const stylesRegex = /<link\s+rel="stylesheet"\s+href="assets\/css\/styles\.css"\s*\/?>\s*<link\s+rel="stylesheet"\s+href="assets\/css\/components\.css"\s*\/?>/i;
  
  const targetReplacement = `  <style>
    /* === CRITICAL CSS — inline for zero render-block === */
    ${minifiedCritical}
  </style>
  <link rel="preload" href="assets/css/styles.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="assets/css/styles.min.css"></noscript>
  <link rel="preload" href="assets/css/components.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="assets/css/components.min.css"></noscript>`;

  let modified = false;

  if (stylesRegex.test(content)) {
    content = content.replace(stylesRegex, targetReplacement);
    modified = true;
  } else {
    // Try without spaces or trailing slashes, or with newlines
    const stylesRegexAlt = /<link\s+rel="stylesheet"\s+href="assets\/css\/styles\.css"\s*\/?>\s*\n?\s*<link\s+rel="stylesheet"\s+href="assets\/css\/components\.css"\s*\/?>/gi;
    if (stylesRegexAlt.test(content)) {
      content = content.replace(stylesRegexAlt, targetReplacement);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully injected critical CSS into ${path.basename(filePath)}`);
  } else {
    console.warn(`Warning: Could not find stylesheet tags in ${path.basename(filePath)}`);
  }
});
