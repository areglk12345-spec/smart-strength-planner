/**
 * Generates minimal valid PNG icons for PWA without any npm packages.
 * Creates icon-192.png and icon-512.png in public/icons/
 * Run: node scripts/make-pwa-icons.js
 */
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const outDir = path.join(__dirname, '..', 'public', 'icons')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

function writePNGChunk(type, data) {
    const typeBuffer = Buffer.from(type, 'ascii')
    const length = Buffer.alloc(4)
    length.writeUInt32BE(data.length, 0)
    const crcData = Buffer.concat([typeBuffer, data])
    const crc = crc32(crcData)
    const crcBuffer = Buffer.alloc(4)
    crcBuffer.writeUInt32BE(crc >>> 0, 0)
    return Buffer.concat([length, typeBuffer, data, crcBuffer])
}

function crc32(buffer) {
    let table = []
    for (let i = 0; i < 256; i++) {
        let c = i
        for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1
        table[i] = c
    }
    let crc = 0xffffffff
    for (let i = 0; i < buffer.length; i++) crc = table[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8)
    return crc ^ 0xffffffff
}

function drawIcon(size) {
    const pixels = new Uint8Array(size * size * 4)

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * 4
            const t = y / size
            // Dark navy background
            pixels[idx]     = Math.round(30 + (15 - 30) * t)   // R
            pixels[idx + 1] = Math.round(58 + (23 - 58) * t)   // G
            pixels[idx + 2] = Math.round(95 + (42 - 95) * t)   // B
            pixels[idx + 3] = 255                                // A
        }
    }

    // Dumbbell drawing
    const s = size / 192
    const cx = size / 2
    const cy = size / 2

    function rect(x1, y1, x2, y2, r, g, b) {
        for (let py = Math.max(0, Math.floor(y1)); py < Math.min(size, Math.ceil(y2)); py++) {
            for (let px = Math.max(0, Math.floor(x1)); px < Math.min(size, Math.ceil(x2)); px++) {
                const idx = (py * size + px) * 4
                pixels[idx] = r; pixels[idx+1] = g; pixels[idx+2] = b; pixels[idx+3] = 255
            }
        }
    }

    // Center bar (blue)
    rect(cx - 48*s, cy - 9*s, cx + 48*s, cy + 9*s, 59, 130, 246)
    // Left outer plate
    rect(cx - 80*s, cy - 33*s, cx - 56*s, cy + 33*s, 59, 130, 246)
    // Left inner plate
    rect(cx - 58*s, cy - 23*s, cx - 44*s, cy + 23*s, 147, 197, 253)
    // Right outer plate
    rect(cx + 56*s, cy - 33*s, cx + 80*s, cy + 33*s, 59, 130, 246)
    // Right inner plate
    rect(cx + 44*s, cy - 23*s, cx + 58*s, cy + 23*s, 147, 197, 253)

    return pixels
}

function makePNG(size) {
    const pixels = drawIcon(size)
    // PNG signature
    const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

    // IHDR chunk
    const ihdr = Buffer.alloc(13)
    ihdr.writeUInt32BE(size, 0)
    ihdr.writeUInt32BE(size, 4)
    ihdr[8] = 8  // bit depth
    ihdr[9] = 2  // color type: RGB (no alpha channel yet)
    ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0

    // Build raw scanlines (filter byte + RGB data)
    const scanlines = []
    for (let y = 0; y < size; y++) {
        scanlines.push(0) // filter type None
        for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * 4
            scanlines.push(pixels[idx], pixels[idx+1], pixels[idx+2])
        }
    }
    const rawData = Buffer.from(scanlines)
    const compressed = zlib.deflateSync(rawData)

    const iend = Buffer.alloc(0)

    return Buffer.concat([
        sig,
        writePNGChunk('IHDR', ihdr),
        writePNGChunk('IDAT', compressed),
        writePNGChunk('IEND', iend)
    ])
}

;[192, 512].forEach(size => {
    const png = makePNG(size)
    const out = path.join(outDir, `icon-${size}.png`)
    fs.writeFileSync(out, png)
    console.log(`✅ ${out} (${png.length} bytes)`)
})
console.log('\n🎉 PWA icons generated! Now commit and push to deploy.')
