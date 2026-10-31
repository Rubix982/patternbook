# Design reference: a chain-replacement guide

## 1. Problem

The reader is standing at a bike in a garage, hallway, or on a balcony, with a phone or laptop propped on a shelf or a stool a metre or two away. Their hands are greasy, so they touch the screen rarely and with a knuckle. They look at the bike, then glance at the screen, then back. Each glance has to answer one question: "what do I do now, and how do I know I did it right?"

They may not know the names of the parts (cassette, pulley, quick link). They will make one or two irreversible moves (cutting the chain to length is the big one), and a mistake there costs them a new chain. Light may be poor and the screen may be at an angle. Some will read the whole thing first, at a desk, the night before; most will not.

## 2. Observed facts

**Colour (light theme)**
- Page background: warm unbleached paper, `#F3EFE6`. Card/step surface: `#FBF9F4`.
- Ink (body and diagram line work): `#1E1C18`. Secondary text: `#5A554B`. Hairlines: `#D8D1C2`.
- One action colour, signal orange `#C8471A`, used only for the thing the reader must act on in a diagram (the link to cut, the gap to measure, the direction to push) and for the step numerals.
- One caution colour, deep ochre `#8A5A00` on a pale ochre field `#F6E7C4`, used only for "stop and check" boxes before irreversible moves.
- Dark theme mirrors it: background `#16150F`, surface `#1F1D17`, ink `#EDE8DC`, secondary `#A8A194`, hairline `#3A362D`, action `#F07A45`, caution text `#F0C46A` on `#3A2E12`.

**Type**
- One sans-serif family from the system stack (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`), so nothing loads and nothing shifts.
- Body 19px / 1.55, weight 400. Step titles 27px, weight 750. Step numerals 64px, weight 800, tabular figures, in the action colour.
- Measurements and part counts (`12 in`, `+2 links`, `0.5%`) set in the system monospace stack at body size, so numbers line up and are read as numbers.
- No italics for anything that matters; emphasis is weight 650.

**Layout**
- One column, max 760px of content, 16px gutters on phones, 32px on wider screens.
- Top: one-sentence summary, time estimate, difficulty, and a tools checklist the reader can tick.
- Then a "before you start" section on the two facts that decide which chain to buy (gear count, connector type).
- Then numbered steps. Each step is a bordered block with: big numeral, a title that is a command ("Measure the old chain"), a diagram, two to five short instructions, and a final "Done when:" line stating the observable result.
- A "Mark done" toggle at the foot of each step dims the finished step, so a reader who looks away can find their place.
- A compact step index under the header links to each step.

**Diagrams**
- Inline SVG, line drawings only: 2px ink strokes, no shading, no gradients, no perspective. Parts drawn flat, in side view, as a mechanic would sketch on a bench.
- Every diagram labels parts with short words placed beside the part, connected by a thin leader line, never in a separate legend.
- Exactly one element per diagram is drawn in the action colour: the thing the step is about.
- Diagrams inherit colour from CSS variables (`currentColor` and custom properties), so they work in both themes.

## 3. Why it works

The reader's attention is split between the bike and the screen, so the page is built for glances, not reading. Big numerals and command-style titles let them re-find their place in a second. The "Done when" line gives each step an exit condition they can check against the bike itself, which matters more than the instructions: people usually do the step roughly right and then are unsure whether they have finished.

A single action colour works because it carries one meaning. If orange only ever marks "this is the part you touch," the reader learns that in the first diagram and can then read later diagrams without labels. Two or three accent colours would each need to be decoded.

The caution colour is kept separate and rare because it guards the one or two moves that cannot be undone. If every step had a warning box, the warning before cutting the chain would be ignored.

Line drawings in side view match what the reader sees when they crouch beside the drive side of the bike. Photographs would carry more detail but also more noise, and a reader with a different bike would see mismatches everywhere. A simplified drawing shows the relationship (chain goes in front of this pulley, behind that one), which is what transfers between bikes.

Warm paper and dark ink at high contrast stay legible on a phone at arm's length in a dim garage. Large body text costs scrolling, but scrolling with a knuckle is cheaper than leaning in to read.

The numbers that decide whether the job succeeds (wear limits, link counts) are monospaced so they read as measurements, not prose, and so the reader can find them on a second glance.

## 4. Transferable rules

1. Write every step title as a command, and end every step with a "Done when:" line that names something the reader can observe on the object itself.
2. Use one accent colour with one meaning ("the thing you act on here") and apply it to exactly one element per diagram.
3. Put a caution box only before actions that cannot be undone, and no more than two or three per page; style it so it is distinct from the action colour.
4. Draw diagrams as flat, labelled line drawings from the viewpoint the reader actually has, with labels next to parts rather than in a legend, and drive their colours from CSS variables.
5. Size type for reading at arm's length (body at least 18px, step numerals large enough to find in one glance), and keep a single column so the reader never has to choose where to look.
6. Put the facts that change what the reader must buy or choose (sizes, compatibility, limits) before the first step, and set those numbers in monospace.

## 5. When it doesn't apply

- Reference material that people search rather than follow in order, such as a compatibility table or a parts catalogue. There the right design is dense and scannable, with filtering, not one step per screen.
- Tasks where the visual detail is the information, such as identifying a specific worn part or matching a colour. Simplified line drawings hide exactly what the reader needs; photographs or close-ups are better.
- Expert audiences who already know the sequence and want only the numbers. Big numerals and "Done when" lines become padding for them; a one-screen cheat sheet serves better.
- Long procedures with branching (e.g. diagnosing a shifting problem). A linear numbered list misleads when the next step depends on what the reader found; a decision structure is needed.
- Print-only use, where the "Mark done" toggles and dark theme do nothing and the large type wastes paper.
