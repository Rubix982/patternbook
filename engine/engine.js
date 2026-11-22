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
  var __toCommonJS = (mod6) => __copyProps(__defProp({}, "__esModule", { value: true }), mod6);

  // engine/index.js
  var engine_exports = {};
  __export(engine_exports, {
    chain: () => chain_exports,
    darning: () => darning_exports,
    dye: () => dye_exports,
    field: () => field_exports,
    kantha: () => kantha_exports,
    mirror: () => mirror_exports,
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
    const W = warp.map(hexRgb), F = weft.map(hexRgb), G = hexRgb(typeof ground === "string" ? ground : "#3a3330");
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
    const base = cloth({ ...o, unit, seed, ground: o.groundColour ?? "#3a3330" });
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
    const base = cloth({ ...o, unit, seed, ground: o.groundColour ?? "#3a3330" });
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

  // engine/core/chain.js
  var chain_exports = {};
  __export(chain_exports, {
    CHAIN_DEFAULTS: () => CHAIN_DEFAULTS,
    PATHS: () => PATHS,
    arcLength: () => arcLength,
    chained: () => chained,
    holes: () => holes,
    stitch: () => stitch,
    straight: () => straight
  });
  var hexRgb4 = (h) => {
    const n = parseInt(String(h).replace("#", ""), 16);
    return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
  };
  var dense = (f, n) => Array.from({ length: n + 1 }, (_, k) => f(k / n));
  var PATHS = {
    line: (x0, y0, x1, y1) => dense((t) => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t], 400),
    wave: (x0, y0, x1, amp, waves) => dense((t) => [x0 + (x1 - x0) * t, y0 + amp * Math.sin(2 * Math.PI * waves * t)], 800),
    circle: (cx, cy, r) => dense((t) => [cx + r * Math.cos(2 * Math.PI * t), cy + r * Math.sin(2 * Math.PI * t)], 800),
    ellipse: (cx, cy, rx, ry) => dense((t) => [cx + rx * Math.cos(2 * Math.PI * t), cy + ry * Math.sin(2 * Math.PI * t)], 800),
    spiral: (cx, cy, r0, r1, turns) => dense((t) => {
      const r = r0 + (r1 - r0) * t, a = 2 * Math.PI * turns * t;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    }, 1600),
    // concentric rings filling an ellipse, from the outside in, `gap` pixels apart (zalakdozi's fill). A chain can't
    // follow a curve tighter than its own link (each link is a chord), so rings stop where the ellipse's tightest curve,
    // at the ends of its long axis (radius b*b/a), would be tighter than `minRadius` (pass the link length).
    rings: (cx, cy, rx, ry, gap, minRadius = 0) => {
      const out = [];
      for (let k = 0; rx - k * gap > gap * 0.8 && ry - k * gap > gap * 0.8; k++) {
        const a = Math.max(rx, ry) - k * gap, b = Math.min(rx, ry) - k * gap;
        if (b * b / a < minRadius) break;
        out.push(PATHS.ellipse(cx, cy, rx - k * gap, ry - k * gap));
      }
      return out;
    }
  };
  function arcLength(path) {
    const s = [0];
    for (let k = 1; k < path.length; k++) s.push(s[k - 1] + Math.hypot(path[k][0] - path[k - 1][0], path[k][1] - path[k - 1][1]));
    return s;
  }
  function pointAt(path, s, at) {
    let lo = 0, hi = s.length - 1;
    while (lo < hi - 1) {
      const mid = lo + hi >> 1;
      if (s[mid] <= at) lo = mid;
      else hi = mid;
    }
    const f = (at - s[lo]) / (s[hi] - s[lo] || 1);
    return [path[lo][0] + (path[hi][0] - path[lo][0]) * f, path[lo][1] + (path[hi][1] - path[lo][1]) * f];
  }
  function holes(path, { link, jitter = 0.1, wander = 0.2, seed = 1 }) {
    const s = arcLength(path), L = s[s.length - 1], out = [];
    if (!(L > 1)) return [];
    const closed = Math.hypot(path[0][0] - path[path.length - 1][0], path[0][1] - path[path.length - 1][1]) < 0.5;
    if (closed) link = L / Math.max(3, Math.round(L / link));
    link = Math.max(link, 0.5);
    let at = 0, k = 0;
    while (at <= L + 1e-6) {
      const [x, y] = pointAt(path, s, Math.min(at, L));
      const [x2, y2] = pointAt(path, s, Math.min(L, at + 1));
      const [x1, y1] = pointAt(path, s, Math.max(0, at - 1));
      const tx = x2 - x1, ty = y2 - y1, tl = Math.hypot(tx, ty) || 1;
      const off = wander * 1.5 * noise1(k * 0.37, seed + 61);
      out.push([x - ty / tl * off, y + tx / tl * off]);
      at += link * (1 + jitter * (hash2(k, 0, seed + 67) * 2 - 1));
      k++;
    }
    return out;
  }
  var CHAIN_DEFAULTS = {
    link: 9,
    loop: 6.5,
    thread: 2.4,
    jitter: 0.08,
    wander: 0.2,
    swell: 0.08,
    twist: 0.35,
    round: 0.55,
    colour: "#d33a2c",
    side: "face",
    kind: "chain"
  };
  function loopOutline(c, hw) {
    const front = c * 1.14, pts = [];
    for (let k = 0; k <= 28; k++) {
      const a = Math.PI * (k / 28);
      const u = front / 2 * (1 - Math.cos(a)), g = Math.sin(a) ** 0.85;
      pts.push([u, hw * g]);
    }
    for (let k = 27; k >= 1; k--) pts.push([pts[k][0], -pts[k][1]]);
    return pts;
  }
  function segDist(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2));
    return [Math.hypot(px - ax - t * dx, py - ay - t * dy), t];
  }
  function threadPainter(img, o) {
    const { width: W, height: H, rgb, top } = img;
    const C = hexRgb4(o.colour), half = o.thread / 2;
    const put = (x, y, d, along, across) => {
      if (x < 0 || y < 0 || x >= W || y >= H) return;
      let sh = 1 - o.round * 0.5 * (d / half) ** 2;
      sh *= 1 + o.twist * 0.25 * Math.sin(2 * Math.PI * (along / (o.thread * 1.6)) + 2.2 * across);
      const k = (y * W + x) * 3;
      rgb[k] = Math.min(1, C[0] * sh);
      rgb[k + 1] = Math.min(1, C[1] * sh);
      rgb[k + 2] = Math.min(1, C[2] * sh);
      top[y * W + x] = 6;
    };
    const tube = (ax, ay, bx, by, w) => {
      const x0 = Math.floor(Math.min(ax, bx) - w), x1 = Math.ceil(Math.max(ax, bx) + w);
      const y0 = Math.floor(Math.min(ay, by) - w), y1 = Math.ceil(Math.max(ay, by) + w);
      const len = Math.hypot(bx - ax, by - ay);
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const [d, t] = segDist(x + 0.5, y + 0.5, ax, ay, bx, by);
        const taper = w * (0.75 + 0.25 * Math.sin(Math.PI * t));
        if (d < taper) put(x, y, d * (half / taper), t * len, d / taper);
      }
    };
    return { put, tube, half };
  }
  function straight(img, segments, opts = {}) {
    const o = { ...CHAIN_DEFAULTS, ...opts }, { tube, half } = threadPainter(img, o);
    for (const [[ax, ay], [bx, by]] of segments) tube(ax, ay, bx, by, half * (o.widen ?? 1));
    return img;
  }
  function stitch(img, paths, opts = {}) {
    const o = { ...CHAIN_DEFAULTS, ...opts };
    const seed = o.seed || 1, { put, tube, half } = threadPainter(img, o);
    for (const [pi, path] of paths.entries()) {
      const P = holes(path, { link: o.link, jitter: o.jitter, wander: o.wander, seed: seed + pi * 13 });
      for (let k = 0; k + 1 < P.length; k++) {
        const [ax, ay] = P[k], [bx, by] = P[k + 1];
        if (o.kind === "running") {
          const dash = o.dash ?? 0.6;
          tube(ax, ay, ax + (bx - ax) * dash, ay + (by - ay) * dash, half);
          continue;
        }
        if (o.side === "back") {
          tube(ax, ay, bx, by, half * 1.05);
          continue;
        }
        const c = Math.hypot(bx - ax, by - ay) || 1, dx = (bx - ax) / c, dy = (by - ay) / c;
        const hw = o.loop / 2 * (1 + o.swell * (hash2(k, pi, seed + 71) * 2 - 1));
        const outline = loopOutline(c, hw).map(([u, v]) => [ax + u * dx - v * dy, ay + u * dy + v * dx]);
        const bx0 = Math.floor(Math.min(...outline.map((p) => p[0])) - half - 1), bx1 = Math.ceil(Math.max(...outline.map((p) => p[0])) + half + 1);
        const by0 = Math.floor(Math.min(...outline.map((p) => p[1])) - half - 1), by1 = Math.ceil(Math.max(...outline.map((p) => p[1])) + half + 1);
        for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) {
          let best = Infinity, along = 0;
          for (let q = 0; q < outline.length; q++) {
            const [a1, a2] = outline[q], [b1, b2] = outline[(q + 1) % outline.length];
            const [d] = segDist(x + 0.5, y + 0.5, a1, a2, b1, b2);
            if (d < best) {
              best = d;
              along = q;
            }
          }
          if (best < half) put(x, y, best, along * (c * 2.2 / outline.length), along < outline.length / 2 ? 0.5 : -0.5);
        }
      }
    }
    return img;
  }
  function chained(opts) {
    const o = { ...CHAIN_DEFAULTS, ...opts };
    const ground = o.ground || STRUCTURES.plain;
    const unit = o.side === "back" ? { ends: ground.ends, picks: ground.picks, up: (i, j) => !ground.up(i, j) } : ground;
    const img = cloth({ ...o, unit, seed: o.seed || 1, ground: o.groundColour ?? "#3a3330" });
    return stitch(img, o.paths || [], o);
  }

  // engine/core/field.js
  var field_exports = {};
  __export(field_exports, {
    distanceTo: () => distanceTo,
    levelLines: () => levelLines,
    signedDistance: () => signedDistance
  });
  function edt1(f, n, d, v, z) {
    let k = 0;
    v[0] = 0;
    z[0] = -Infinity;
    z[1] = Infinity;
    for (let q = 1; q < n; q++) {
      let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      while (s <= z[k]) {
        k--;
        s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
      }
      k++;
      v[k] = q;
      z[k] = s;
      z[k + 1] = Infinity;
    }
    k = 0;
    for (let q = 0; q < n; q++) {
      while (z[k + 1] < q) k++;
      d[q] = (q - v[k]) ** 2 + f[v[k]];
    }
  }
  function distanceTo(mask, W, H) {
    const INF = 1e20, g = new Float64Array(W * H);
    for (let p = 0; p < W * H; p++) g[p] = mask[p] ? 0 : INF;
    const n = Math.max(W, H), f = new Float64Array(n), d = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1);
    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H; y++) f[y] = g[y * W + x];
      edt1(f, H, d, v, z);
      for (let y = 0; y < H; y++) g[y * W + x] = d[y];
    }
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) f[x] = g[y * W + x];
      edt1(f, W, d, v, z);
      for (let x = 0; x < W; x++) g[y * W + x] = Math.sqrt(d[x]);
    }
    return g;
  }
  function signedDistance(inside, W, H) {
    const m = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) m[y * W + x] = inside(x + 0.5, y + 0.5) ? 1 : 0;
    const toIn = distanceTo(m, W, H), toOut = distanceTo(m.map((b) => 1 - b), W, H);
    const s = new Float64Array(W * H);
    for (let p = 0; p < W * H; p++) s[p] = m[p] ? toOut[p] - 0.5 : -(toIn[p] - 0.5);
    return s;
  }
  function levelLines(field, W, H, level) {
    const segs = [];
    const at = (x, y) => field[y * W + x] - level;
    const lerp = (x0, y0, a, x1, y1, b) => {
      const t = a / (a - b);
      return [x0 + (x1 - x0) * t + 0.5, y0 + (y1 - y0) * t + 0.5];
    };
    for (let y = 0; y < H - 1; y++) for (let x = 0; x < W - 1; x++) {
      const a = at(x, y), b = at(x + 1, y), c = at(x + 1, y + 1), d = at(x, y + 1);
      const idx = (a > 0 ? 8 : 0) | (b > 0 ? 4 : 0) | (c > 0 ? 2 : 0) | (d > 0 ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const T = () => lerp(x, y, a, x + 1, y, b), R = () => lerp(x + 1, y, b, x + 1, y + 1, c);
      const B = () => lerp(x, y + 1, d, x + 1, y + 1, c), L = () => lerp(x, y, a, x, y + 1, d);
      const add = (p, q) => segs.push([p(), q()]);
      switch (idx) {
        case 1:
        case 14:
          add(L, B);
          break;
        case 2:
        case 13:
          add(B, R);
          break;
        case 3:
        case 12:
          add(L, R);
          break;
        case 4:
        case 11:
          add(T, R);
          break;
        case 6:
        case 9:
          add(T, B);
          break;
        case 7:
        case 8:
          add(L, T);
          break;
        case 5:
          add(L, T);
          add(B, R);
          break;
        case 10:
          add(T, R);
          add(L, B);
          break;
      }
    }
    const key = ([x, y]) => `${Math.round(x * 64)},${Math.round(y * 64)}`;
    const ends = /* @__PURE__ */ new Map();
    segs.forEach((s, i) => {
      for (const e of [0, 1]) {
        const k = key(s[e]);
        if (!ends.has(k)) ends.set(k, []);
        ends.get(k).push(i);
      }
    });
    const used = new Uint8Array(segs.length), paths = [];
    for (let i = 0; i < segs.length; i++) {
      if (used[i]) continue;
      used[i] = 1;
      const path = [segs[i][0], segs[i][1]];
      for (const dir of [1, -1]) {
        for (; ; ) {
          const tip = dir === 1 ? path[path.length - 1] : path[0];
          const next = (ends.get(key(tip)) || []).find((j) => !used[j]);
          if (next === void 0) break;
          used[next] = 1;
          const s = segs[next], far = key(s[0]) === key(tip) ? s[1] : s[0];
          if (dir === 1) path.push(far);
          else path.unshift(far);
        }
      }
      if (path.length >= 3) paths.push(path);
    }
    return paths;
  }

  // engine/core/kantha.js
  var kantha_exports = {};
  __export(kantha_exports, {
    KANTHA_DEFAULTS: () => KANTHA_DEFAULTS,
    SHAPES: () => SHAPES,
    contourRows: () => contourRows,
    kantha: () => kantha,
    straightRows: () => straightRows
  });
  var rot = (x, y, a) => [x * Math.cos(a) + y * Math.sin(a), -x * Math.sin(a) + y * Math.cos(a)];
  var SHAPES = {
    circle: (cx, cy, r) => (x, y) => (x - cx) ** 2 + (y - cy) ** 2 < r * r,
    // a paisley: a round head and a tail that tapers and curls
    paisley: (cx, cy, r, angle = 0) => (x, y) => {
      const [u, v] = rot(x - cx, y - cy, angle);
      if (u * u + v * v < r * r) return true;
      if (u < 0 || u > 2.2 * r) return false;
      const t = u / (2.2 * r), mid = -0.55 * r * t * t, w = r * (1 - t) ** 1.2;
      return Math.abs(v - mid) < w;
    },
    // a lotus: petals around a centre, each an ellipse
    lotus: (cx, cy, r, petals = 8) => (x, y) => {
      if ((x - cx) ** 2 + (y - cy) ** 2 < (0.28 * r) ** 2) return true;
      for (let k = 0; k < petals; k++) {
        const a = 2 * Math.PI * k / petals, px = cx + 0.55 * r * Math.cos(a), py = cy + 0.55 * r * Math.sin(a);
        const [u, v] = rot(x - px, y - py, a);
        if ((u / (0.47 * r)) ** 2 + (v / (0.2 * r)) ** 2 < 1) return true;
      }
      return false;
    }
  };
  var KANTHA_DEFAULTS = {
    rowGap: 7,
    stitchLen: 5,
    space: 3,
    thread: 1.6,
    ripple: 0.6,
    wrinkle: 0.3,
    lightAngle: 315,
    margin: 4,
    background: "rows",
    groundThread: "#e6dcc6",
    rows: "contour"
  };
  function contourRows(inside, W, H, gap) {
    const sd = signedDistance(inside, W, H);
    let max = 0;
    for (const v of sd) if (v > max) max = v;
    const rows = [];
    for (let d = gap / 2; d < max - gap * 0.25; d += gap) rows.push(...levelLines(sd, W, H, d));
    return { rows, sd };
  }
  function straightRows(inside, W, H, gap, y0 = gap / 2) {
    const rows = [];
    for (let y = y0; y < H; y += gap) {
      let cur = null;
      for (let x = 0; x <= W; x += 0.5) {
        const ok = x < W && inside(x, y);
        if (ok) {
          if (!cur) cur = [];
          cur.push([x, y]);
        } else if (cur) {
          if (cur.length > 4) rows.push(cur);
          cur = null;
        }
      }
    }
    return rows;
  }
  function kantha(opts) {
    const o = { ...KANTHA_DEFAULTS, ...opts };
    const W = o.width, H = o.height, seed = o.seed || 1;
    const img = cloth({ ...o, unit: o.ground || STRUCTURES.plain, seed, gap: o.threadGap ?? 0.12, ground: o.groundColour ?? "#3a3330" });
    const motifs = o.motifs || [];
    const inAny = (x, y) => motifs.some((m) => m.inside(x, y));
    const groups = [];
    for (const m of motifs) groups.push({ colour: m.colour || "#1f3a7a", rows: o.rows === "straight" ? straightRows(m.inside, W, H, o.rowGap) : contourRows(m.inside, W, H, o.rowGap).rows });
    if (o.background === "rows") {
      const sdAll = signedDistance(inAny, W, H);
      groups.push({ colour: o.groundThread, rows: straightRows((x, y) => {
        const xi = Math.min(W - 1, Math.floor(x)), yi = Math.min(H - 1, Math.floor(y));
        return sdAll[yi * W + xi] < -o.margin;
      }, W, H, o.rowGap) });
    }
    if (o.ripple > 0) {
      const lines = new Uint8Array(W * H);
      for (const g of groups) for (const row of g.rows) for (const [x, y] of row) {
        const xi = Math.floor(x), yi = Math.floor(y);
        if (xi >= 0 && yi >= 0 && xi < W && yi < H) lines[yi * W + xi] = 1;
      }
      const d = distanceTo(lines, W, H);
      const h = new Float64Array(W * H);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const p = y * W + x, t = Math.min(1, d[p] / (o.rowGap / 2));
        h[p] = o.ripple * Math.sin(Math.PI / 2 * t) * (1 + o.wrinkle * noise2(x / 23, y / 23, seed + 81));
      }
      const la = o.lightAngle * Math.PI / 180, lx = Math.cos(la), ly = Math.sin(la);
      for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
        const p = y * W + x;
        const gx = (h[p + 1] - h[p - 1]) / 2, gy = (h[p + W] - h[p - W]) / 2;
        const sh = Math.max(0.5, 1 + 0.9 * (gx * lx + gy * ly)) * (0.94 + 0.06 * h[p] / (o.ripple || 1));
        for (let c = 0; c < 3; c++) img.rgb[p * 3 + c] = Math.min(1, img.rgb[p * 3 + c] * sh);
      }
    }
    const link = o.stitchLen + o.space;
    for (const [k, g] of groups.entries())
      stitch(img, g.rows, {
        kind: "running",
        link,
        dash: o.stitchLen / link,
        thread: o.thread,
        colour: g.colour,
        jitter: o.jitter ?? 0.1,
        wander: o.wanderStitch ?? 0.15,
        twist: 0.2,
        seed: seed + k * 7
      });
    return { ...img, groups };
  }

  // engine/core/dye.js
  var dye_exports = {};
  __export(dye_exports, {
    ABSORB: () => ABSORB,
    BLOCKS: () => BLOCKS,
    DYE_DEFAULTS: () => DYE_DEFAULTS,
    dyed: () => dyed
  });
  var hexRgb5 = (h) => {
    const n = parseInt(String(h).replace("#", ""), 16);
    return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
  };
  var ABSORB = {
    harda: [0.01, 0.04, 0.16],
    indigo: [1.6, 0.9, 0.25],
    madderAlum: [0.15, 1.6, 1.3],
    madderIron: [1.8, 1.8, 1.6],
    madderStain: [0.05, 0.25, 0.2]
  };
  var DYE_DEFAULTS = { cloth: "#f4efe4", impression: 0.25, spread: 0.6, reg: 1.2, wick: 1.2, mottle: 0.12, crackWidth: 0.9 };
  function wickBlur(f, W, H, r) {
    if (r <= 0) return f;
    const R = Math.max(1, Math.round(r * 2)), out = new Float32Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let sx = 0, nx = 0, sy = 0, ny = 0;
      for (let k = -R; k <= R; k++) {
        const w = Math.exp(-(k * k) / (2 * r * r));
        if (x + k >= 0 && x + k < W) {
          sx += w * f[y * W + x + k];
          nx += w;
        }
        if (y + k >= 0 && y + k < H) {
          sy += w * f[(y + k) * W + x];
          ny += w;
        }
      }
      out[y * W + x] = 0.5 * (sx / nx + sy / ny);
    }
    return out;
  }
  function printLayer(field, W, H, step, o, seed) {
    const [tw, th] = step.tile || [64, 64], [ox, oy] = step.offset || [0, 0];
    const sp = o.spread, samples = sp > 0 ? [[0, 0], [sp, 0], [-sp, 0], [0, sp], [0, -sp]] : [[0, 0]];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const tx = Math.floor(x / tw), ty = Math.floor(y / th);
      const jx = o.reg * (hash2(tx, ty, seed + 3) * 2 - 1), jy = o.reg * (hash2(tx, ty, seed + 5) * 2 - 1);
      let c = 0;
      for (const [dx, dy] of samples) c = Math.max(c, step.mask(x - ox - jx + dx, y - oy - jy + dy));
      const press = 1 - o.impression * Math.max(0, noise2(x / 9, y / 9, seed + 7)) - o.impression * 0.5 * hash2(tx, ty, seed + 11);
      const v = Math.max(0, Math.min(1, c * Math.min(1, press * 1.25)));
      field[y * W + x] = Math.max(field[y * W + x], v);
    }
  }
  function crackLines(W, H, density, width, seed) {
    const cell = 9 + 10 * (1 - density), out = new Uint8Array(W * H);
    const pt = (i, j) => [(i + 0.15 + 0.7 * hash2(i, j, seed + 13)) * cell, (j + 0.15 + 0.7 * hash2(i, j, seed + 17)) * cell];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const ci = Math.floor(x / cell), cj = Math.floor(y / cell);
      let d1 = Infinity, d2 = Infinity;
      for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
        const [px, py] = pt(ci + a, cj + b), d = Math.hypot(x + 0.5 - px, y + 0.5 - py);
        if (d < d1) {
          d2 = d1;
          d1 = d;
        } else if (d < d2) d2 = d;
      }
      if (d2 - d1 < width) out[y * W + x] = 1;
    }
    return out;
  }
  function dyed(opts) {
    const o = { ...DYE_DEFAULTS, ...opts };
    const W = o.width, H = o.height, N = W * H, seed = o.seed || 1;
    const R = new Float32Array(N), A = new Float32Array(N), F = new Float32Array(N), OD = [new Float32Array(N), new Float32Array(N), new Float32Array(N)];
    const stain = [new Float32Array(N), new Float32Array(N), new Float32Array(N)];
    let tannin = 0, k = 0;
    for (const step of o.steps || []) {
      k++;
      if (step.op === "harda") {
        tannin = 1;
        for (let c = 0; c < 3; c++) for (let p = 0; p < N; p++) OD[c][p] += ABSORB.harda[c] * (step.amount ?? 1);
      } else if (step.op === "print") printLayer(step.layer === "resist" ? R : step.layer === "alum" ? A : F, W, H, step, o, seed + k * 101);
      else if (step.op === "crack") {
        const cr = crackLines(W, H, step.density ?? 0.5, o.crackWidth, seed + k * 101);
        for (let p = 0; p < N; p++) if (cr[p]) R[p] *= 0.1;
      } else if (step.op === "dye") {
        const Rw = wickBlur(R, W, H, o.wick), s = step.strength ?? 1;
        const Aw = step.bath === "madder" ? wickBlur(A, W, H, o.wick) : null, Fw = step.bath === "madder" ? wickBlur(F, W, H, o.wick) : null;
        for (let p = 0; p < N; p++) {
          const x = p % W, y = p / W | 0;
          const take = (1 - Math.min(1, Rw[p])) * s * (1 + o.mottle * noise2(x / 7, y / 7, seed + k * 31));
          if (step.bath === "indigo") for (let c = 0; c < 3; c++) OD[c][p] += ABSORB.indigo[c] * take;
          else {
            const ir = Math.min(1, Fw[p]) * (tannin ? 1 : 0.6), al = Math.min(1, Aw[p]) * (1 - ir), none = Math.max(0, 1 - al - ir);
            for (let c = 0; c < 3; c++) {
              OD[c][p] += take * (ABSORB.madderAlum[c] * al + ABSORB.madderIron[c] * ir);
              stain[c][p] += take * ABSORB.madderStain[c] * none;
            }
          }
        }
      } else if (step.op === "wash") {
        R.fill(0);
        for (const s of stain) s.fill(0);
      }
    }
    const img = cloth({ ...o, unit: o.ground || STRUCTURES.plain, seed, warp: ["#ffffff"], weft: ["#f7f7f7"], ground: "#bdbdbd" });
    const base = hexRgb5(o.cloth);
    for (let p = 0; p < N; p++) for (let c = 0; c < 3; c++)
      img.rgb[p * 3 + c] = Math.min(1, img.rgb[p * 3 + c] * base[c] * Math.exp(-(OD[c][p] + stain[c][p])));
    return { ...img, fields: { resist: R, alum: A, iron: F } };
  }
  var mod4 = (a, n) => (a % n + n) % n;
  var BLOCKS = {
    // a lattice of circles, `cell` apart, radius r (an inner ring from r0 if given)
    dots: (cell, r, r0 = 0) => (x, y) => {
      const u = mod4(x, cell) - cell / 2, v = mod4(y, cell) - cell / 2, d = Math.hypot(u, v);
      return d < r && d >= r0 ? 1 : 0;
    },
    // an eight-point star lattice (ajrak's), star radius r in each cell
    stars: (cell, r) => (x, y) => {
      const u = mod4(x, cell) - cell / 2, v = mod4(y, cell) - cell / 2, a = Math.atan2(v, u), d = Math.hypot(u, v);
      const rr = r * (0.62 + 0.38 * Math.abs(Math.cos(4 * a)) ** 0.6);
      return d < rr ? 1 : 0;
    },
    rect: (x0, y0, x1, y1) => (x, y) => x >= x0 && x < x1 && y >= y0 && y < y1 ? 1 : 0,
    frame: (x0, y0, x1, y1, w) => (x, y) => x >= x0 && x < x1 && y >= y0 && y < y1 && !(x >= x0 + w && x < x1 - w && y >= y0 + w && y < y1 - w) ? 1 : 0,
    union: (...ms) => (x, y) => Math.max(...ms.map((m) => m(x, y)))
  };

  // engine/core/mirror.js
  var mirror_exports = {};
  __export(mirror_exports, {
    MIRROR_DEFAULTS: () => MIRROR_DEFAULTS,
    lattice: () => lattice,
    mirrored: () => mirrored,
    openingRadius: () => openingRadius
  });
  var hexRgb6 = (h) => {
    const n = parseInt(String(h).replace("#", ""), 16);
    return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
  };
  var mod5 = (a, n) => (a % n + n) % n;
  var smooth = (a, b, x) => {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  var MIRROR_DEFAULTS = {
    // the ring
    grid: 4,
    pull: 0.7,
    overlap: 0.2,
    reach: 0.3,
    link: 4,
    loop: 2.6,
    thread: 1.6,
    ring: "shisha",
    colour: "#c8452a",
    // the glass and what it reflects
    curve: 0.5,
    tilt: 0.12,
    light: [0.25, -0.35],
    glint: 0.12,
    room: "#56606c",
    ceiling: "#c4ced6",
    lamp: "#fffaf0",
    // the hand
    roundness: 0.05,
    offset: 0.04,
    turn: 8,
    jitter: 0.12,
    wanderLeg: 0.15,
    tarnish: 0.05
  };
  function openingRadius(n, pull, a0, mean) {
    if (!n) return () => mean;
    const half = Math.PI / n, secMean = Math.log(1 / Math.cos(half) + Math.tan(half)) / half;
    const apothem = mean / (1 + (1 - pull) * (secMean - 1));
    return (a) => {
      const phi = mod5(a - a0 + half, 2 * half) - half;
      return apothem * (1 + (1 - pull) * (1 / Math.cos(phi) - 1));
    };
  }
  function mirrored(opts) {
    const o = { ...MIRROR_DEFAULTS, ...opts };
    const W = o.width, H = o.height, seed = o.seed || 1;
    const img = cloth({ ...o, unit: o.ground || STRUCTURES.plain, seed, ground: o.groundColour ?? "#3a3330" });
    const room = hexRgb6(o.room), ceiling = hexRgb6(o.ceiling), lamp = hexRgb6(o.lamp);
    const out = [];
    for (const [m, mi] of (o.mirrors || []).entries()) {
      const { x: cx, y: cy, r } = mi, h = (k) => hash2(m, k, seed + 211) * 2 - 1;
      const harm = [2, 3, 4].map((k, i) => [k, h(1 + i) / k, Math.PI * h(4 + i)]);
      const R = (a) => r * (1 + o.roundness * harm.reduce((s, [k, amp, ph]) => s + amp * Math.cos(k * a + ph), 0));
      const tx = o.tilt * h(7), ty = o.tilt * h(8);
      const oa = Math.PI * h(9), od = o.offset * r * Math.abs(h(10));
      const ox = cx + od * Math.cos(oa), oy = cy + od * Math.sin(oa);
      const ro = openingRadius(o.grid, o.pull, o.turn * h(11) * Math.PI / 180, r * (1 - o.overlap));
      const x0 = Math.max(0, Math.floor(cx - 1.3 * r)), x1 = Math.min(W - 1, Math.ceil(cx + 1.3 * r));
      const y0 = Math.max(0, Math.floor(cy - 1.3 * r)), y1 = Math.min(H - 1, Math.ceil(cy + 1.3 * r));
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = Math.hypot(dx, dy), a = Math.atan2(dy, dx), Ra = R(a);
        if (d >= Ra) continue;
        let nx = o.curve * (dx / r) + tx, ny = o.curve * (dy / r) + ty, nz = 1;
        const nl = Math.hypot(nx, ny, nz);
        nx /= nl;
        ny /= nl;
        nz /= nl;
        const rx = 2 * nz * nx, ry = 2 * nz * ny;
        const up = smooth(-1, 1, -ry * 2.2);
        const g = Math.exp(-((rx - o.light[0]) ** 2 + (ry - o.light[1]) ** 2) / (2 * o.glint ** 2));
        const wear = (1 - 0.3 * smooth(0.88, 1, d / Ra)) * (1 - o.tarnish * (0.5 + 0.5 * noise2(x / 5, y / 5, seed + 223 + m)));
        const p = (y * W + x) * 3;
        for (let c = 0; c < 3; c++) img.rgb[p + c] = Math.min(1, 0.88 * wear * ((room[c] * (1 - up) + ceiling[c] * up) * (1 - g) + lamp[c] * g));
        img.top[y * W + x] = 7;
      }
      const colour = Array.isArray(o.colours) && o.colours.length ? o.colours[m % o.colours.length] : o.colour;
      const th = o.thread, thread = { colour, thread: th, link: o.link, loop: o.loop, jitter: o.jitter, wander: 0.1, seed: seed + 307 * (m + 1) };
      const N = 600, outer = Array.from({ length: N + 1 }, (_, k) => {
        const a = 2 * Math.PI * k / N;
        const rr = R(a) + o.reach * r;
        return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
      });
      outer[N] = outer[0];
      const inner = Array.from({ length: N + 1 }, (_, k) => {
        const a = 2 * Math.PI * k / N;
        const rr = ro(a);
        return [ox + rr * Math.cos(a), oy + rr * Math.sin(a)];
      });
      inner[N] = inner[0];
      let stitches = 0;
      if (o.ring === "chain") {
        const rows = [inner];
        for (let k = 1; k * o.loop < o.reach * r + o.overlap * r; k++) {
          const f = k * o.loop;
          rows.push(Array.from({ length: N + 1 }, (_, j) => {
            const a = 2 * Math.PI * j / N;
            const rr = Math.min(ro(a) + f, R(a) + o.reach * r);
            return [ox + rr * Math.cos(a), oy + rr * Math.sin(a)];
          }));
          rows[rows.length - 1][N] = rows[rows.length - 1][0];
        }
        stitch(img, rows, { ...thread, kind: o.rowKind || "chain" });
      } else {
        const P = holes(outer, thread);
        stitches = P.length - 1;
        const base = [];
        for (let k = 0; k < stitches; k++) {
          const a = Math.atan2(P[k][1] - oy, P[k][0] - ox) + o.wanderLeg * (2 * Math.PI / stitches) * h(20 + k);
          base.push([ox + ro(a) * Math.cos(a), oy + ro(a) * Math.sin(a)]);
        }
        straight(img, base.map((b, k) => [b, P[k]]), thread);
        straight(img, base.map((b, k) => [b, base[(k + 1) % stitches]]), { ...thread, widen: 1.25 });
        stitch(img, [outer], { ...thread, kind: "chain" });
      }
      out.push({ x: cx, y: cy, r, stitches });
    }
    return { ...img, mirrors: out };
  }
  function lattice(W, H, spacing, r, margin = 0) {
    const out = [], dy = spacing * Math.sqrt(3) / 2;
    for (let j = 0; ; j++) {
      const y = margin + r + j * dy;
      if (y > H - margin - r) break;
      for (let x = margin + r + (j % 2 ? spacing / 2 : 0); x <= W - margin - r; x += spacing) out.push({ x, y, r });
    }
    return out;
  }
  return __toCommonJS(engine_exports);
})();
