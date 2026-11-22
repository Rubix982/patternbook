/* patternbook engine (engine/core), bundled by engine/build.mjs; edit engine/core, not this file. */
var PatternbookEngine = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod4) => __copyProps(__defProp({}, "__esModule", { value: true }), mod4);

  // engine/index.js
  var engine_exports = {};
  __export(engine_exports, {
    darning: () => darning_exports,
    random: () => random_exports,
    supplementary: () => supplementary_exports,
    weave: () => weave_exports
  });

  // engine/core/random.js
  var random_exports = {};
  __export(random_exports, {
    hash2: () => hash2,
    noise1: () => noise1,
    noise2: () => noise2,
    rng: () => rng
  });
  function rng(seed = 1) {
    let a = seed >>> 0 || 1;
    return () => {
      a = a + 1831565813 >>> 0;
      let t = a;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function hash2(x, y, seed = 1) {
    let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 2246822519) | 0;
    h = Math.imul(h ^ h >>> 13, 1274126177);
    return ((h ^ h >>> 16) >>> 0) / 4294967296;
  }
  function noise1(x, seed = 1) {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    const a = hash2(i, 0, seed) * 2 - 1, b = hash2(i + 1, 0, seed) * 2 - 1;
    return a + (b - a) * u;
  }
  function noise2(x, y, seed = 1) {
    const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    const v = (a, b) => hash2(a, b, seed) * 2 - 1;
    const top = v(i, j) + (v(i + 1, j) - v(i, j)) * ux;
    const bot = v(i, j + 1) + (v(i + 1, j + 1) - v(i, j + 1)) * ux;
    return top + (bot - top) * uy;
  }

  // engine/core/weave.js
  var weave_exports = {};
  __export(weave_exports, {
    DEFAULTS: () => DEFAULTS,
    OFF: () => OFF,
    STRUCTURES: () => STRUCTURES,
    cloth: () => cloth,
    drawdown: () => drawdown,
    floats: () => floats,
    fromDraft: () => fromDraft,
    paint: () => paint
  });
  var mod = (a, n) => (a % n + n) % n;
  var STRUCTURES = {
    plain: { ends: 2, picks: 2, up: (i, j) => mod(i + j, 2) === 0 },
    "twill-2-2": { ends: 4, picks: 4, up: (i, j) => mod(j - i, 4) < 2 },
    "twill-3-1": { ends: 4, picks: 4, up: (i, j) => mod(j - i, 4) < 3 },
    "twill-1-3": { ends: 4, picks: 4, up: (i, j) => mod(j - i, 4) < 1 },
    "basket-2-2": { ends: 4, picks: 4, up: (i, j) => mod(Math.floor(i / 2) + Math.floor(j / 2), 2) === 0 },
    // five-end satin, move 2: each end is under the weft once in five picks (warp floats of four)
    "satin-5": { ends: 5, picks: 5, up: (i, j) => mod(2 * j - i, 5) !== 0 },
    // its weft-faced reverse (sateen): weft floats of four
    "sateen-5": { ends: 5, picks: 5, up: (i, j) => mod(2 * j - i, 5) === 0 }
  };
  function fromDraft({ threading, tieup, treadling }) {
    const lifted = (i, j) => {
      const t = treadling[mod(i, treadling.length)];
      const s = threading[mod(j, threading.length)];
      return (Array.isArray(t) ? t : [t]).some((k) => !!(tieup[s] && tieup[s][k]));
    };
    return { ends: threading.length, picks: treadling.length, up: lifted };
  }
  function drawdown(unit) {
    return Array.from({ length: unit.picks }, (_, i) => Array.from({ length: unit.ends }, (_2, j) => unit.up(i, j) ? 1 : 0));
  }
  function floats(unit) {
    const runs = (n, get) => {
      const v = Array.from({ length: n }, (_, k) => get(k));
      if (v.every((x) => x === v[0])) return v[0] ? [n] : [];
      const start = v.findIndex((x, k) => x && !v[mod(k - 1, n)]);
      const out = [];
      let len = 0;
      for (let k = 0; k < n; k++) {
        const x = v[mod(start + k, n)];
        if (x) len++;
        else if (len) {
          out.push(len);
          len = 0;
        }
      }
      if (len) out.push(len);
      return out;
    };
    const warp = [], weft = [];
    for (let j = 0; j < unit.ends; j++) warp.push(...runs(unit.picks, (i) => unit.up(i, j)));
    for (let i = 0; i < unit.picks; i++) weft.push(...runs(unit.ends, (j) => !unit.up(i, j)));
    return { warp, weft };
  }
  var hexRgb = (h) => {
    const n = parseInt(String(h).replace("#", ""), 16);
    return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
  };
  function boundaries(count, size, vary, seed, freq) {
    const r = rng(seed);
    const b = [0];
    for (let k = 0; k < count; k++) {
      const w = size * (1 + vary * (0.45 * (r() - 0.5) + 0.35 * noise1(k * freq, seed + 7)));
      b.push(b[k] + Math.max(0.45 * size, w));
    }
    return b;
  }
  function find(b, x) {
    let lo = 0, hi = b.length - 2;
    while (lo < hi) {
      const mid = lo + hi + 1 >> 1;
      if (b[mid] <= x) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  }
  function cloth(opts) {
    const {
      unit,
      width = 320,
      height = 320,
      sett = 8,
      pickSett = sett,
      warp = ["#1d2a4a"],
      weft = ["#e9e1cf"],
      ground = "#3a3330",
      seed = 1,
      slub = 0.25,
      beat = 0.2,
      wobble = 0.25,
      gap = 0.12,
      round = 0.55,
      dip = 0.35,
      fibre = 0.25
    } = opts;
    const W = warp.map(hexRgb), F = weft.map(hexRgb), G = hexRgb(ground);
    const nEnds = Math.ceil(width / (sett * 0.45)) + 4, nPicks = Math.ceil(height / (pickSett * 0.45)) + 4;
    const xb = boundaries(nEnds, sett, slub, seed * 31 + 1, 0.17);
    const yb = boundaries(nPicks, pickSett, beat, seed * 31 + 2, 0.11);
    const endTone = Array.from({ length: nEnds }, (_, j) => 1 + 0.08 * slub * (hash2(j, 1, seed) * 2 - 1));
    const pickTone = Array.from({ length: nPicks }, (_, i) => 1 + 0.08 * slub * (hash2(i, 2, seed) * 2 - 1));
    const rgb = new Float32Array(width * height * 3), top = new Uint8Array(width * height);
    const half = (1 - gap) / 2;
    const up = (i, j) => unit.up(mod(i, unit.picks), mod(j, unit.ends));
    const amp = wobble * 0.22;
    const disp = (x, y) => [
      x + amp * sett * noise2(x / (sett * 9), y / (sett * 9), seed + 11),
      y + amp * pickSett * noise2(x / (pickSett * 9) + 50, y / (pickSett * 9), seed + 13)
    ];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const [xs, ys] = disp(x, y);
        const j = find(xb, Math.max(0, xs)), i = find(yb, Math.max(0, ys));
        const s = (xs - xb[j]) / (xb[j + 1] - xb[j]) - 0.5, t = (ys - yb[i]) / (yb[i + 1] - yb[i]) - 0.5;
        const warpHere = Math.abs(s) < half, weftHere = Math.abs(t) < half;
        const u = up(i, j);
        let who;
        if (u) who = warpHere ? 1 : weftHere ? 0 : 2;
        else who = weftHere ? 0 : warpHere ? 1 : 2;
        let c, shade = 1;
        if (who === 1) {
          c = W[mod(j, W.length)];
          shade = 1 - round * 0.5 * (s / half) ** 2;
          if (u) {
            if (!up(i - 1, j)) shade *= 1 - dip * Math.max(0, 1 - (t + 0.5) / 0.35) ** 2;
            if (!up(i + 1, j)) shade *= 1 - dip * Math.max(0, 1 - (0.5 - t) / 0.35) ** 2;
          } else shade *= 0.72;
          shade *= endTone[j] * (1 + 0.07 * fibre * noise1(ys / (pickSett * 0.6), j * 7 + seed));
        } else if (who === 0) {
          c = F[mod(i, F.length)];
          shade = 1 - round * 0.5 * (t / half) ** 2;
          if (!u) {
            if (up(i, j - 1)) shade *= 1 - dip * Math.max(0, 1 - (s + 0.5) / 0.35) ** 2;
            if (up(i, j + 1)) shade *= 1 - dip * Math.max(0, 1 - (0.5 - s) / 0.35) ** 2;
          } else shade *= 0.72;
          shade *= pickTone[i] * (1 + 0.07 * fibre * noise1(xs / (sett * 0.6), i * 7 + seed + 3));
        } else {
          c = G;
        }
        const k = (y * width + x) * 3;
        rgb[k] = Math.min(1, c[0] * shade);
        rgb[k + 1] = Math.min(1, c[1] * shade);
        rgb[k + 2] = Math.min(1, c[2] * shade);
        top[y * width + x] = who;
      }
    }
    return { width, height, rgb, top, xb, yb, disp, half, sett, pickSett };
  }
  function paint(ctx, img) {
    const out = ctx.createImageData(img.width, img.height);
    for (let p = 0; p < img.width * img.height; p++) {
      out.data[p * 4] = Math.round(img.rgb[p * 3] * 255);
      out.data[p * 4 + 1] = Math.round(img.rgb[p * 3 + 1] * 255);
      out.data[p * 4 + 2] = Math.round(img.rgb[p * 3 + 2] * 255);
      out.data[p * 4 + 3] = 255;
    }
    ctx.putImageData(out, 0, 0);
  }
  var DEFAULTS = { sett: 8, slub: 0.25, beat: 0.2, wobble: 0.25, gap: 0.12, round: 0.55, dip: 0.35, fibre: 0.25 };
  var OFF = { slub: 0, beat: 0, wobble: 0, gap: 0.12, round: 0.55, dip: 0.35, fibre: 0 };

  // engine/core/supplementary.js
  var supplementary_exports = {};
  __export(supplementary_exports, {
    MOTIFS: () => MOTIFS,
    SUPP_DEFAULTS: () => SUPP_DEFAULTS,
    band: () => band,
    bitmap: () => bitmap,
    figured: () => figured,
    layout: () => layout
  });
  var mod2 = (a, n) => (a % n + n) % n;
  var hexRgb2 = (h) => {
    const n = parseInt(String(h).replace("#", ""), 16);
    return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
  };
  var find2 = (b, x) => {
    let lo = 0, hi = b.length - 2;
    while (lo < hi) {
      const mid = lo + hi + 1 >> 1;
      if (b[mid] <= x) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  };
  function bitmap(rows) {
    const h = rows.length, w = Math.max(...rows.map((r) => r.length));
    return { w, h, at: (r, c) => r >= 0 && r < h && c >= 0 && c < w && "#XxOo*".includes(rows[r][c] || " ") };
  }
  function layout(m, { across = m.w + 6, down = m.h + 4, halfDrop = true, x0 = 2, y0 = 2 } = {}) {
    return (p, j) => {
      const col = Math.floor((j - x0) / across);
      const dy = halfDrop && mod2(col, 2) ? Math.floor(down / 2) : 0;
      return m.at(mod2(p - y0 - dy, down), mod2(j - x0, across));
    };
  }
  function band(m, { across = m.w, y0 = 2, x0 = 0 } = {}) {
    return (p, j) => p >= y0 && p < y0 + m.h && m.at(p - y0, mod2(j - x0, across));
  }
  var MOTIFS = {
    buti: bitmap([
      "....#....",
      "...###...",
      "..##.##..",
      ".##...##.",
      "##..#..##",
      ".##...##.",
      "..##.##..",
      "...###...",
      "....#...."
    ]),
    kalka: bitmap([
      ".....##....",
      "....####...",
      "...##..#...",
      "..##...##..",
      ".##.##..##.",
      ".#.####..#.",
      ".#..##...#.",
      ".##.....##.",
      "..##...##..",
      "...#####...",
      "....###...."
    ]),
    vine: bitmap([
      ".##.........##..........",
      "#..#.......#..#.........",
      "#..##.....##..#..##.....",
      ".#..##...##..#..#..#....",
      "..#..#####..#...#..#....",
      "...##.....##.....##....."
    ])
  };
  var SUPP_DEFAULTS = { kind: "discontinuous", ratio: 2, bind: 6, suppScale: 1.5, wander: 0.25, turn: 0.35, sheen: 0, cut: 1 };
  function figured(opts) {
    const o = { ...SUPP_DEFAULTS, ...opts };
    const { on, kind, side = "face", ratio, bind, suppScale, wander, turn, sheen, cut, seed = 1 } = o;
    const ground = o.ground || STRUCTURES.plain;
    const unit = side === "back" ? { ends: ground.ends, picks: ground.picks, up: (i, j) => !ground.up(i, j) } : ground;
    const base = cloth({ ...o, unit, seed });
    const { width, height, rgb, top, xb, yb, disp, half } = base;
    const pickSett = o.pickSett || o.sett || 8;
    const S = (Array.isArray(o.supp) ? o.supp : [o.supp || "#d4a017"]).map(hexRgb2);
    const W = (o.warp || ["#1d2a4a"]).map(hexRgb2);
    const hs = suppScale * pickSett * (1 - (o.gap ?? 0.12)) / 2;
    const stagger = Math.floor(bind / 2) + 1;
    const bound = (p, j) => mod2(j + p * stagger, bind) === 0;
    const face = (p, j) => on(p, j) && !bound(p, j);
    const lineY = (p) => yb[Math.min(yb.length - 1, p * ratio + ratio)];
    const near = (p, j, d) => {
      for (let k = 1; k <= d; k++) if (on(p, j - k) || on(p, j + k)) return true;
      return false;
    };
    const round = o.round ?? 0.55, dip = o.dip ?? 0.35;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const [xs, ys] = disp(x, y);
        const j = find2(xb, Math.max(0, xs)), i = find2(yb, Math.max(0, ys));
        const s = (xs - xb[j]) / (xb[j + 1] - xb[j]) - 0.5;
        let hit = null;
        for (let p2 = Math.floor(i / ratio) - 2; p2 <= Math.floor(i / ratio) + 1; p2++) {
          if (p2 < 0) continue;
          const yc = lineY(p2) + wander * pickSett * 0.35 * noise2(xs / (o.sett || 8) / 6, p2 * 1.7, seed + 21);
          const tt2 = (ys - yc) / hs;
          if (Math.abs(tt2) < 1) {
            hit = { p: p2, tt: tt2 };
            break;
          }
        }
        if (!hit) continue;
        const { p, tt } = hit;
        let show = false, binder = false, edgeL = false, edgeR = false;
        if (side === "face") {
          if (on(p, j)) {
            if (bound(p, j)) binder = true;
            else show = true;
          }
          edgeL = !face(p, j - 1);
          edgeR = !face(p, j + 1);
        } else {
          const behind = (q) => kind === "continuous" ? !on(p, q) : kind === "cutwork" ? !on(p, q) && near(p, q, cut) : false;
          if (on(p, j)) show = bound(p, j);
          else show = behind(j);
          const shows = (q) => on(p, q) ? bound(p, q) : behind(q);
          edgeL = !shows(j - 1);
          edgeR = !shows(j + 1);
        }
        const k = (y * width + x) * 3;
        if (binder) {
          if (Math.abs(s) < half) {
            const c2 = W[mod2(j, W.length)];
            const sh2 = (1 - round * 0.5 * (s / half) ** 2) * (1 - 0.25 * Math.max(0, Math.abs(tt) - 0.6));
            rgb[k] = c2[0] * sh2;
            rgb[k + 1] = c2[1] * sh2;
            rgb[k + 2] = c2[2] * sh2;
            top[y * width + x] = 4;
            continue;
          }
          show = true;
        }
        if (!show) continue;
        const c = S[mod2(p, S.length)];
        let sh = 1 - round * 0.5 * tt * tt;
        if (edgeL) sh *= 1 - dip * Math.max(0, 1 - (s + 0.5) / 0.35) ** 2;
        if (edgeR) sh *= 1 - dip * Math.max(0, 1 - (0.5 - s) / 0.35) ** 2;
        const atTurn = kind === "discontinuous" && side === "face" && (edgeL && !on(p, j - 1) || edgeR && !on(p, j + 1));
        if (atTurn) sh *= 1 - turn * 0.35 * (1 - Math.abs(tt));
        sh *= 1 + 0.06 * (hash2(p, j, seed + 5) - 0.5);
        const hl = sheen * Math.exp(-((tt + 0.25) ** 2) / 0.04) * (0.7 + 0.3 * noise2(xs / 3, ys / 3, seed + 9));
        rgb[k] = Math.min(1, c[0] * sh + hl);
        rgb[k + 1] = Math.min(1, c[1] * sh + hl);
        rgb[k + 2] = Math.min(1, c[2] * sh + hl);
        top[y * width + x] = 3;
      }
    }
    return { ...base, rgb, top, ratio, bind, hs, lineY };
  }

  // engine/core/darning.js
  var darning_exports = {};
  __export(darning_exports, {
    DARN_DEFAULTS: () => DARN_DEFAULTS,
    PLANS: () => PLANS,
    blocks: () => blocks,
    darned: () => darned
  });
  var mod3 = (a, n) => (a % n + n) % n;
  var hexRgb3 = (h) => {
    const n = parseInt(String(h).replace("#", ""), 16);
    return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
  };
  var find3 = (b, x) => {
    let lo = 0, hi = b.length - 2;
    while (lo < hi) {
      const mid = lo + hi + 1 >> 1;
      if (b[mid] <= x) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  };
  function blocks({ cellEnds = 12, cellPicks = 12, cell }) {
    const memo = /* @__PURE__ */ new Map();
    return (j, i) => {
      const bx = Math.floor(j / cellEnds), by = Math.floor(i / cellPicks), key = bx * 100003 + by;
      if (!memo.has(key)) memo.set(key, cell(bx, by));
      return memo.get(key);
    };
  }
  var PLANS = {
    // half the blocks darned, directions alternating: the ground shows between them
    sparse: blocks({ cell: (bx, by) => mod3(bx + by, 2) ? null : { dir: mod3(bx, 2) ? "v" : "h", colour: 0 } }),
    // every block darned, directions in a checker: the whole ground covered, as in a bagh
    bagh: blocks({ cell: (bx, by) => ({ dir: mod3(bx + by, 2) ? "v" : "h", colour: 0 }) }),
    // concentric diamonds, direction and colour changing ring by ring, from a centre
    diamond: blocks({ cellEnds: 6, cellPicks: 6, cell: (bx, by) => {
      const r = Math.abs(mod3(bx, 12) - 5.5) + Math.abs(mod3(by, 12) - 5.5);
      const ring = Math.floor(r);
      return ring > 9 ? null : { dir: ring % 2 ? "v" : "h", colour: ring % 3, stagger: ring % 4 < 2 ? 1 : -1 };
    } })
  };
  var DARN_DEFAULTS = {
    float: 5,
    pickup: 1,
    stagger: 1,
    row: 1,
    spread: 1,
    sheen: 0.45,
    light: 0,
    streak: 0.5,
    tension: 0.2,
    miscount: 0.02,
    aligned: true
  };
  function darned(opts) {
    const o = { ...DARN_DEFAULTS, ...opts };
    const ground = o.ground || STRUCTURES.plain;
    const unit = o.side === "back" ? { ends: ground.ends, picks: ground.picks, up: (i, j) => !ground.up(i, j) } : ground;
    const seed = o.seed || 1;
    const base = cloth({ ...o, unit, seed });
    const { width, height, rgb, top, xb, yb, disp } = base;
    const sett = o.sett || 8, pickSett = o.pickSett || sett;
    const F = (Array.isArray(o.floss) ? o.floss : [o.floss || "#e8b423"]).map(hexRgb3);
    const P = o.float + o.pickup, th = o.light * Math.PI / 180;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const [xs, ys] = disp(x, y);
        const j = find3(xb, Math.max(0, xs)), i = find3(yb, Math.max(0, ys));
        const fx = (xs - xb[j]) / (xb[j + 1] - xb[j]), fy = (ys - yb[i]) / (yb[i + 1] - yb[i]);
        const b = o.plan(j, i);
        if (!b) continue;
        const h = b.dir === "h";
        const rowIdx = h ? i : j;
        if (mod3(rowIdx, o.row) !== 0) continue;
        const across = (h ? fy : fx) - 0.5;
        if (Math.abs(across) > o.spread / 2) continue;
        const along = o.aligned ? h ? j + fx : i + fy : h ? xs / sett : ys / pickSett;
        const u = along - (b.stagger ?? o.stagger) * rowIdx - (b.phase || 0);
        const n = Math.floor(u / P), q = u - n * P;
        const mis = hash2(n, rowIdx, seed + 31) < o.miscount ? hash2(n, rowIdx, seed + 37) < 0.5 ? -1 : 1 : 0;
        const fl = o.float + mis;
        const trim = o.tension * 0.12 * (0.5 + hash2(n, rowIdx, seed + 41));
        const onFace = q >= trim && q < fl - trim;
        const show = o.side === "back" ? q >= fl && q < P : onFace;
        if (!show) continue;
        const w = across / (o.spread / 2);
        const streak = noise1(across * 27 + rowIdx * 3.1, seed + (h ? 51 : 58));
        let sh = (1 - 0.18 * w * w) * (1 + 0.12 * o.streak * streak);
        const e = o.side === "back" ? Math.min(q - fl, P - q) : Math.min(q - trim, fl - trim - q);
        sh *= 1 - 0.35 * Math.max(0, 1 - e / 0.35) ** 2;
        const cs = Math.cos((h ? 0 : Math.PI / 2) - th);
        const hl = o.sheen * cs * cs * (0.55 + 0.45 * (0.5 + 0.5 * streak)) * (1 - w * w) * 0.6;
        const c = F[mod3(b.colour || 0, F.length)];
        const k = (y * width + x) * 3;
        rgb[k] = Math.min(1, c[0] * sh + hl);
        rgb[k + 1] = Math.min(1, c[1] * sh + hl);
        rgb[k + 2] = Math.min(1, c[2] * sh + hl);
        top[y * width + x] = 5;
      }
    }
    return base;
  }
  return __toCommonJS(engine_exports);
})();
