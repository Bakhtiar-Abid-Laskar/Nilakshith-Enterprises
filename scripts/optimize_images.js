const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '../assets/img');
const brandsDir = path.join(__dirname, '../brands');

async function optimizeImages() {
  console.log('Starting image optimization...');

  // 1. Resize logo_trans.webp to exactly 136x136 px WebP, quality 55 (effort 6)
  const logoInput = path.join(imgDir, 'logo_trans.png');
  const logoOutput = path.join(imgDir, 'logo_trans_136.webp');
  await sharp(logoInput)
    .resize(136, 136)
    .webp({ quality: 55, effort: 6 })
    .toFile(logoOutput);
  console.log('Saved logo_trans_136.webp');

  // 2. Generate hero-graphic responsive variants
  const heroInput = path.join(imgDir, 'hero-graphic.png');
  const hero420Output = path.join(imgDir, 'hero-graphic-420.webp');
  const hero840Output = path.join(imgDir, 'hero-graphic-840.webp');

  await sharp(heroInput)
    .resize(420, 315)
    .webp({ quality: 70, effort: 6 })
    .toFile(hero420Output);
  console.log('Saved hero-graphic-420.webp');

  await sharp(heroInput)
    .resize(840, 630)
    .webp({ quality: 65, effort: 6 })
    .toFile(hero840Output);
  console.log('Saved hero-graphic-840.webp');

  // 3. Resize brand logos to 160x160 px WebP quality 80
  const brandLogos = [
    { input: 'airtel.png', output: 'airtel_160.webp' },
    { input: 'bharat benz.jpeg', output: 'bharat-benz_160.webp' },
    { input: 'honda.png', output: 'honda_160.webp' },
    { input: 'tata motors.jpeg', output: 'tata-motors_160.webp' },
    { input: 'tvs.png', output: 'tvs_160.webp' },
    { input: 'uco bank (1).png', output: 'uco-bank-1_160.webp' },
    { input: 'zudio.jpg', output: 'zudio_160.webp' }
  ];

  for (const logo of brandLogos) {
    const inputPath = path.join(brandsDir, logo.input);
    const outputPath = path.join(brandsDir, logo.output);
    if (fs.existsSync(inputPath)) {
      await sharp(inputPath)
        .resize(160, 160, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // transparent
        })
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`Saved ${logo.output}`);
    } else {
      console.warn(`Warning: source file not found: ${inputPath}`);
    }
  }

  console.log('Image optimization completed!');
}

optimizeImages().catch(err => {
  console.error('Error during image optimization:', err);
});
