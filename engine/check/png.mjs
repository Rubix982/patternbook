// engine/check/png.mjs
// A minimal PNG writer for engine checks and sheets under Node (no dependencies): RGB float buffers to an 8-bit PNG.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const CRC = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
const crc32 = (buf) => {
  let c = -1;
  for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};

// rgb: Float32Array of width*height*3 values in [0, 1]
export function writePng(path, width, height, rgb) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 3 + 1)] = 0;
    for (let x = 0; x < width * 3; x++) raw[y * (width * 3 + 1) + 1 + x] = Math.max(0, Math.min(255, Math.round(rgb[y * width * 3 + x] * 255)));
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  writeFileSync(path, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]));
}

// Lay out tiles (each {width, height, rgb}) in a grid with a gap, on a background colour.
export function sheet(tiles, cols, gap = 12, bg = [0.96, 0.95, 0.93]) {
  const tw = Math.max(...tiles.map((t) => t.width)), th = Math.max(...tiles.map((t) => t.height));
  const rows = Math.ceil(tiles.length / cols);
  const W = cols * tw + (cols + 1) * gap, H = rows * th + (rows + 1) * gap;
  const rgb = new Float32Array(W * H * 3);
  for (let p = 0; p < W * H; p++) rgb.set(bg, p * 3);
  tiles.forEach((t, n) => {
    const ox = gap + (n % cols) * (tw + gap), oy = gap + Math.floor(n / cols) * (th + gap);
    for (let y = 0; y < t.height; y++) for (let x = 0; x < t.width; x++)
      rgb.set(t.rgb.subarray((y * t.width + x) * 3, (y * t.width + x) * 3 + 3), ((oy + y) * W + ox + x) * 3);
  });
  return { width: W, height: H, rgb };
}
