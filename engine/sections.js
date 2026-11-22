// engine/sections.js
// The studio's sections: the fourteen of the styles that came from Lumenary (A to N, from its data in
// processes/sources/lumenary/data/sections.js), and patternbook's own (P), whose styles render a picture through a
// process modelled in core/. A style shows in the studio only if a section names it.
import { SECTIONS as RECEIVED, slugify } from '../processes/sources/lumenary/data/sections.js';

export { slugify };
export const OWN = { id: 'processes', letter: 'P', title: 'Processes', items: [] };
export const SECTIONS = [...RECEIVED, OWN];
