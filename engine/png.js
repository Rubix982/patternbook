// engine/png.js
// PNG in and out for Node (node:zlib), so the service can read and write files with no other library. Reads 8- and
// 16-bit greyscale, grey with alpha, RGB, RGBA and palette images, not interlaced; writes RGBA.
import { inflateSync, deflateSync } from 'node:zlib';

const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = (buf) => { let c = -1; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };

export function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('Not a PNG file.');
  let p = 8, W = 0, H = 0, depth = 0, type = 0, interlace = 0, palette = null, trns = null;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), kind = buf.toString('ascii', p + 4, p + 8), d = buf.subarray(p + 8, p + 8 + len);
    if (kind === 'IHDR') { W = d.readUInt32BE(0); H = d.readUInt32BE(4); depth = d[8]; type = d[9]; interlace = d[12]; }
    else if (kind === 'PLTE') palette = d;
    else if (kind === 'tRNS') trns = d;
    else if (kind === 'IDAT') idat.push(d);
    else if (kind === 'IEND') break;
    p += 12 + len;
  }
  if (interlace) throw new Error('Interlaced PNGs are not read; save it without interlacing.');
  const ch = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[type];
  if (!ch || ![8, 16].includes(depth) && !(type === 3 && depth === 8)) throw new Error(`PNG colour type ${type} at ${depth} bits is not read.`);
  const bpp = ch * (depth / 8), stride = W * bpp, raw = inflateSync(Buffer.concat(idat)), px = Buffer.alloc(H * stride);
  for (let y = 0; y < H; y++) {
    const f = raw[y * (stride + 1)], row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)), o = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? px[o + x - bpp] : 0, b = y ? px[o - stride + x] : 0, c = x >= bpp && y ? px[o - stride + x - bpp] : 0;
      let v = row[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      px[o + x] = v & 255;
    }
  }
  const data = new Uint8ClampedArray(W * H * 4), at = (i, k) => px[i * bpp + k * (depth / 8)];
  for (let i = 0; i < W * H; i++) {
    let r, g, b, a = 255;
    if (type === 0) { r = g = b = at(i, 0); if (trns && depth === 8 && r === trns[1]) a = 0; }
    else if (type === 4) { r = g = b = at(i, 0); a = at(i, 1); }
    else if (type === 2) { r = at(i, 0); g = at(i, 1); b = at(i, 2); }
    else if (type === 6) { r = at(i, 0); g = at(i, 1); b = at(i, 2); a = at(i, 3); }
    else { const k = px[i]; r = palette[k * 3]; g = palette[k * 3 + 1]; b = palette[k * 3 + 2]; if (trns && k < trns.length) a = trns[k]; }
    data[i * 4] = r; data[i * 4 + 1] = g; data[i * 4 + 2] = b; data[i * 4 + 3] = a;
  }
  return { width: W, height: H, data };
}

export function encodePng({ width: W, height: H, data }) {
  const stride = W * 4, raw = Buffer.alloc(H * (stride + 1));
  for (let y = 0; y < H; y++) {
    raw[y * (stride + 1)] = 1; // filter: each byte less the one to its left
    for (let x = 0; x < stride; x++) raw[y * (stride + 1) + 1 + x] = (data[y * stride + x] - (x >= 4 ? data[y * stride + x - 4] : 0)) & 255;
  }
  const chunk = (kind, d) => { const b = Buffer.alloc(12 + d.length); b.writeUInt32BE(d.length, 0); b.write(kind, 4, 'ascii'); d.copy(b, 8); b.writeUInt32BE(crc32(b.subarray(4, 8 + d.length)), 8 + d.length); return b; };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}
