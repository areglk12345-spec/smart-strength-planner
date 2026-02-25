// Run this script with: node scripts/generate-icons.js
// It generates PWA icons in public/icons/

const fs = require('fs')
const path = require('path')

const sizes = [192, 512]
const outDir = path.join(__dirname, '..', 'public', 'icons')

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

// Create SVG icon (dumbbell on dark background)
function makeSvg(size) {
  const pad = Math.round(size * 0.12)
  const b = size - pad * 2 // inner bounding box

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e3a5f"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="url(#bg)"/>

  <!-- Dumbbell -->
  <g transform="translate(${size/2}, ${size/2})">
    <!-- Center bar -->
    <rect x="${-b*0.25}" y="${-b*0.05}" width="${b*0.5}" height="${b*0.1}" rx="${b*0.03}" fill="url(#glow)"/>
    <!-- Left plate outer -->
    <rect x="${-b*0.42}" y="${-b*0.17}" width="${b*0.12}" height="${b*0.34}" rx="${b*0.03}" fill="url(#glow)"/>
    <!-- Left plate inner -->
    <rect x="${-b*0.3}" y="${-b*0.12}" width="${b*0.07}" height="${b*0.24}" rx="${b*0.02}" fill="#93c5fd"/>
    <!-- Right plate outer -->
    <rect x="${b*0.3}" y="${-b*0.17}" width="${b*0.12}" height="${b*0.34}" rx="${b*0.03}" fill="url(#glow)"/>
    <!-- Right plate inner -->
    <rect x="${b*0.23}" y="${-b*0.12}" width="${b*0.07}" height="${b*0.24}" rx="${b*0.02}" fill="#93c5fd"/>
  </g>
</svg>`
}

sizes.forEach(size => {
  const svg = makeSvg(size)
  fs.writeFileSync(path.join(outDir, `icon-${size}.svg`), svg, 'utf8')
  console.log(`✅ Created icon-${size}.svg`)
})

console.log(`\n📁 Icons saved to public/icons/`)
console.log(`ℹ️  SVG icons work for PWA. For full PNG support, convert them with an image tool.`)
