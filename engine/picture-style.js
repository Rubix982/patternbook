// engine/picture-style.js
// A picture style: a style (the shape in styles/, see README "How a style is written") whose work is a pure function,
// `treat(pic, params) -> image`, on { width, height, rgb } arrays. In the studio it renders like any still; the
// service (service.js) calls `treat` directly, so it also runs in Node with no canvas. patternbook's section P.
import { still } from './utils.js';
import { pixels } from './helpers.js';
import { fromRGBA, toRGBA } from './core/picture.js';

export function pictureStyle(def) {
  const style = still({
    maxSide: 900,
    ...def,
    render(ctx, work, p, env, W, H, cache) {
      const pic = fromRGBA(W, H, pixels(work, W, H, cache).data);
      const out = def.treat(pic, p);
      const img = ctx.createImageData(out.width, out.height);
      img.data.set(toRGBA(out));
      ctx.putImageData(img, 0, 0);
    },
  });
  style.treat = def.treat;
  return style;
}
