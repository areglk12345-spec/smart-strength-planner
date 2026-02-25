// Generates 192x192 and 512x512 PNG icons for PWA
// Run: node scripts/generate-png-icons.js

const fs = require('fs')
const path = require('path')

const outDir = path.join(__dirname, '..', 'public', 'icons')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

// Write raw PNG using minimal PNG format (pure Node.js, no dependencies)
function createPNG(size) {
    const { createCanvas } = require('canvas')
    const canvas = createCanvas(size, size)
    const ctx = canvas.getContext('2d')

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, size, size)
    bg.addColorStop(0, '#1e3a5f')
    bg.addColorStop(1, '#0f172a')
    ctx.fillStyle = bg
    const r = size * 0.18
    ctx.beginPath()
    ctx.moveTo(r, 0)
    ctx.lineTo(size - r, 0)
    ctx.quadraticCurveTo(size, 0, size, r)
    ctx.lineTo(size, size - r)
    ctx.quadraticCurveTo(size, size, size - r, size)
    ctx.lineTo(r, size)
    ctx.quadraticCurveTo(0, size, 0, size - r)
    ctx.lineTo(0, r)
    ctx.quadraticCurveTo(0, 0, r, 0)
    ctx.closePath()
    ctx.fill()

    // Dumbbell
    const cx = size / 2
    const cy = size / 2
    const scale = size / 192

    ctx.fillStyle = '#3b82f6'

    // Center bar
    ctx.fillRect(cx - 48 * scale, cy - 9 * scale, 96 * scale, 18 * scale)

    // Left plates
    ctx.fillRect(cx - 80 * scale, cy - 33 * scale, 24 * scale, 66 * scale)
    ctx.fillStyle = '#93c5fd'
    ctx.fillRect(cx - 58 * scale, cy - 23 * scale, 14 * scale, 46 * scale)

    // Right plates
    ctx.fillStyle = '#3b82f6'
    ctx.fillRect(cx + 56 * scale, cy - 33 * scale, 24 * scale, 66 * scale)
    ctx.fillStyle = '#93c5fd'
    ctx.fillRect(cx + 44 * scale, cy - 23 * scale, 14 * scale, 46 * scale)

    return canvas.toBuffer('image/png')
}

try {
    const buf192 = createPNG(192)
    const buf512 = createPNG(512)
    fs.writeFileSync(path.join(outDir, 'icon-192.png'), buf192)
    fs.writeFileSync(path.join(outDir, 'icon-512.png'), buf512)
    console.log('✅ icon-192.png created')
    console.log('✅ icon-512.png created')
} catch (e) {
    console.error('❌ canvas package not found. Install with: npm install canvas')
    console.error('Then run: node scripts/generate-png-icons.js')
}
