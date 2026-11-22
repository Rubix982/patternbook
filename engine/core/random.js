// engine/core/random.js
// Seeded randomness for patternbook's engine (docs/architecture.md section 7): the same seed always gives the same
// result, so a design can be remade from its spec. The primitive `seeded-random` in processes/primitives.md.

// mulberry32: a small, fast 32-bit generator; returns a function giving numbers in [0, 1).
export function rng(seed = 1) {
  let a = (seed >>> 0) || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A hash of an integer pair and a seed, in [0, 1): random values tied to a place, not to the order they are drawn in.
export function hash2(x, y, seed = 1) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 2246822519)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// One-dimensional value noise in [-1, 1]: smooth variation along a line (a thread's thickness, a pick's spacing).
export function noise1(x, seed = 1) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  const a = hash2(i, 0, seed) * 2 - 1, b = hash2(i + 1, 0, seed) * 2 - 1;
  return a + (b - a) * u;
}

// Two-dimensional value noise in [-1, 1] (the primitive `smooth-noise`).
export function noise2(x, y, seed = 1) {
  const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const v = (a, b) => hash2(a, b, seed) * 2 - 1;
  const top = v(i, j) + (v(i + 1, j) - v(i, j)) * ux;
  const bot = v(i, j + 1) + (v(i + 1, j + 1) - v(i, j + 1)) * ux;
  return top + (bot - top) * uy;
}
