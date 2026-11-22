// engine/check/dye-designs.mjs: the designs and sequences C-024's check and sheet share. Each design is a set of
// blocks; each sequence carries the cloth through them in an order.
import { BLOCKS } from '../core/dye.js';

export const C = 56; // the lattice cell
export const DESIGN = {
  red: BLOCKS.dots(C, 11),                       // alum fills
  black: BLOCKS.dots(C, 18, 12.5),               // iron rings around them
  white: BLOCKS.dots(C, 24.5, 19.5),             // a resisted line around the rings (marks where to read white)
  resist: BLOCKS.dots(C, 24.5),                  // everything inside the outer line, resisted from indigo
  dabuA: BLOCKS.stars(C, 20),                    // double dabu: the first resist
  // the second resist: the stars' centres (resisted twice: white) and dots between the stars (resisted once)
  dabuB: BLOCKS.union(BLOCKS.dots(C, 8), (x, y) => BLOCKS.dots(C, 9)(x + C / 2, y + C / 2)),
};
// which design flags a print step's mask is
export const MASK_FLAG = new Map([[DESIGN.red, 'red'], [DESIGN.black, 'black'], [DESIGN.resist, 'resist'], [DESIGN.dabuA, 'dabuA'], [DESIGN.dabuB, 'dabuB']]);
export const SEQUENCES = {
  ajrak: [{ op: 'harda' }, { op: 'print', layer: 'alum', mask: DESIGN.red }, { op: 'print', layer: 'iron', mask: DESIGN.black },
    { op: 'print', layer: 'resist', mask: DESIGN.resist }, { op: 'dye', bath: 'indigo' }, { op: 'dye', bath: 'indigo' }, { op: 'wash' },
    { op: 'dye', bath: 'madder' }, { op: 'wash' }],
  // the same steps with the indigo moved before the resist
  'ajrak, indigo first': [{ op: 'harda' }, { op: 'print', layer: 'alum', mask: DESIGN.red }, { op: 'print', layer: 'iron', mask: DESIGN.black },
    { op: 'dye', bath: 'indigo' }, { op: 'dye', bath: 'indigo' }, { op: 'print', layer: 'resist', mask: DESIGN.resist }, { op: 'wash' },
    { op: 'dye', bath: 'madder' }, { op: 'wash' }],
  'double dabu': [{ op: 'print', layer: 'resist', mask: DESIGN.dabuA }, { op: 'dye', bath: 'indigo' }, { op: 'wash' },
    { op: 'print', layer: 'resist', mask: DESIGN.dabuB }, { op: 'dye', bath: 'indigo' }, { op: 'wash' }],
  bagru: [{ op: 'harda' }, { op: 'print', layer: 'iron', mask: DESIGN.black }, { op: 'print', layer: 'alum', mask: DESIGN.red },
    { op: 'dye', bath: 'madder' }, { op: 'wash' }],
};
