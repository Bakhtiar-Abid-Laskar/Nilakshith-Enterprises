const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Hero graphic replacement
const heroTarget = /<picture>\s*<source srcset="assets\/img\/hero-graphic\.webp" type="image\/webp" \/>\s*<img src="assets\/img\/hero-graphic\.png" alt="Best WiFi, high speed broadband and CCTV services in Silchar, Karimganj, and Hailakandi - Nilakshith Enterprise" class="floating-illustration" width="840" height="630" loading="eager" \/>\s*<\/picture>/gi;
const heroReplacement = `<picture>
              <source
                type="image/webp"
                srcset="assets/img/hero-graphic-420.webp 420w,
                        assets/img/hero-graphic-840.webp 840w"
                sizes="(max-width: 768px) 380px, 420px">
              <img src="assets/img/hero-graphic-840.webp"
                   alt="Best WiFi, high speed broadband and CCTV services in Silchar, Karimganj, and Hailakandi"
                   class="floating-illustration"
                   width="840" height="630"
                   loading="eager"
                   fetchpriority="low"
                   decoding="async">
            </picture>`;

// 2. Brand logos replacement
const brandsTarget = /<div class="brands-track">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/i;
const brandsReplacement = `<div class="brands-track">
          <!-- SET A (original) -->
          <ul class="brands-list" role="list">
            <li class="brand-item">
              <img src="brands/airtel_160.webp" alt="Airtel" class="brand-logo" loading="lazy" decoding="async" width="80" height="80">
            </li>
            <li class="brand-item">
              <img src="brands/bharat-benz_160.webp" alt="Bharat Benz" class="brand-logo" loading="lazy" decoding="async" width="80" height="80">
            </li>
            <li class="brand-item">
              <img src="brands/honda_160.webp" alt="Honda" class="brand-logo" loading="lazy" decoding="async" width="80" height="80">
            </li>
            <li class="brand-item">
              <img src="brands/tata-motors_160.webp" alt="Tata Motors" class="brand-logo" loading="lazy" decoding="async" width="80" height="80">
            </li>
            <li class="brand-item">
              <img src="brands/tvs_160.webp" alt="TVS" class="brand-logo" loading="lazy" decoding="async" width="80" height="80">
            </li>
            <li class="brand-item">
              <img src="brands/uco-bank-1_160.webp" alt="UCO Bank" class="brand-logo" loading="lazy" decoding="async" width="80" height="80">
            </li>
            <li class="brand-item">
              <img src="brands/zudio_160.webp" alt="Zudio" class="brand-logo" loading="lazy" decoding="async" width="80" height="80">
            </li>
          </ul>

          <!-- SET B (duplicate — identical to Set A, for seamless infinite scroll) -->
          <ul class="brands-list brands-list--dupe" role="list" aria-hidden="true">
            <li class="brand-item">
              <img src="brands/airtel_160.webp" alt="Airtel" class="brand-logo" loading="lazy" decoding="async" width="80" height="80">
            </li>
            <li class="brand-item">
              <img src="brands/bharat-benz_160.webp" alt="Bharat Benz" class="brand-logo" loading="lazy" decoding="async" width="80" height="80">
            </li>
            <li class="brand-item">
              <img src="brands/honda_160.webp" alt="Honda" class="brand-logo" loading="lazy" decoding="async" width="80" height="80">
            </li>
            <li class="brand-item">
              <img src="brands/tata-motors_160.webp" alt="Tata Motors" class="brand-logo" loading="lazy" decoding="async" width="80" height="80">
            </li>
            <li class="brand-item">
              <img src="brands/tvs_160.webp" alt="TVS" class="brand-logo" loading="lazy" decoding="async" width="80" height="80">
            </li>
            <li class="brand-item">
              <img src="brands/uco-bank-1_160.webp" alt="UCO Bank" class="brand-logo" loading="lazy" decoding="async" width="80" height="80">
            </li>
            <li class="brand-item">
              <img src="brands/zudio_160.webp" alt="Zudio" class="brand-logo" loading="lazy" decoding="async" width="80" height="80">
            </li>
          </ul>
        </div>
      </div>
    </section>`;

// 3. Service card links replacement
content = content.replace(
  /<a href="broadband\.html" class="service-card__link">([\s\S]*?)<\/a>/i,
  `<a href="broadband.html" class="service-card__link" aria-label="Learn more about Broadband Internet">$1</a>`
);

content = content.replace(
  /<a href="cctv\.html" class="service-card__link">([\s\S]*?)<\/a>/i,
  `<a href="cctv.html" class="service-card__link" aria-label="Learn more about CCTV Surveillance">$1</a>`
);

content = content.replace(
  /<a href="networking\.html" class="service-card__link">([\s\S]*?)<\/a>/i,
  `<a href="networking.html" class="service-card__link" aria-label="Learn more about IT Infrastructure and Networking">$1</a>`
);

content = content.replace(
  /<a href="cctv\.html#amc" class="service-card__link">([\s\S]*?)<\/a>/i,
  `<a href="cctv.html#amc" class="service-card__link" aria-label="Learn more about CCTV AMC and Maintenance">$1</a>`
);

content = content.replace(
  /<a href="networking\.html" class="service-card__link" aria-label="Learn more about IT Infrastructure and Networking">([\s\S]*?)<\/a>([\s\S]*?)<a href="networking\.html" class="service-card__link">/i,
  `<a href="networking.html" class="service-card__link" aria-label="Learn more about IT Infrastructure and Networking">$1</a>$2<a href="networking.html" class="service-card__link" aria-label="Learn more about Network Configuration">`
);

// 4. Typewriter text replacement
content = content.replace(
  /<span class="hero__typewriter-text" aria-label="Service type"><\/span>/gi,
  `<span class="hero__typewriter-text" role="status" aria-live="polite" aria-atomic="true"></span>`
);

// 5. Maps embed replacement
const mapTarget = /<!-- Interactive Map Embed -->[\s\S]*?<\/iframe>([\s\S]*?)<\/div>/i;
const mapReplacement = `<!-- Interactive Map Embed -->
            <div class="service-area-map-wrapper" style="border:1px solid var(--color-border); border-radius:var(--radius-lg); overflow:hidden; height:220px; margin-block:var(--space-2); position:relative; cursor:pointer;" id="map-placeholder-index" onclick="loadRealMap('index')">
              <img
                src="assets/img/map_placeholder.webp"
                alt="Nilakshith Enterprise service area map"
                loading="lazy"
                decoding="async"
                style="width:100%; height:100%; object-fit:cover;">
              <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.15);">
                <button type="button" class="btn btn--primary" style="padding:8px 16px; font-size:0.85rem; pointer-events:none;">
                  📍 View Interactive Map
                </button>
              </div>
            </div>
            <div id="map-real-index" style="display:none; height:220px; border:1px solid var(--color-border); border-radius:var(--radius-lg); overflow:hidden; margin-block:var(--space-2);"></div>`;

// 6. Tagembed reviews replacement
const reviewsTarget = /<!-- Tagembed Google Reviews Widget - ID 328135 -->[\s\S]*?<\/iframe>[\s\S]*?<\/div>/i;
const reviewsReplacement = `<!-- Tagembed Google Reviews Widget - ID 328135 -->
        <div class="tagembed-widget-container" id="tagembed-container" data-animate="fade-up" data-animate-delay="150" style="min-height: 400px; display: flex; align-items: center; justify-content: center; background: var(--color-bg-surface);">
          <div style="color: var(--color-text-secondary); font-size: 0.9rem;">Loading reviews...</div>
        </div>`;

// Apply and save
content = content.replace(heroTarget, heroReplacement);
content = content.replace(brandsTarget, brandsReplacement);
content = content.replace(mapTarget, mapReplacement);
content = content.replace(reviewsTarget, reviewsReplacement);

// Re-apply preconnect link removal as checkout reverted it
content = content.replace(
  /<link rel="preconnect" href="https:\/\/widget\.tagembed\.com" \/>\s*\n?/gi,
  ''
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully completed programmatic update of index.html!');
