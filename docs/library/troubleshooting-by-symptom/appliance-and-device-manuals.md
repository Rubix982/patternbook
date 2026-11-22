---
source: troubleshooting sections of official owner's manuals (dishwasher, printer, car, GPS)
source_family: multi-maker (Miele, Brother, Toyota, Garmin)
source_docs:
  - https://media.miele.com/downloads/c2/ed/04_C7F138387C871EDFAE8DA11946D3C2ED.pdf
  - https://download.brother.com/welcome/doc003144/dcp152w_uke_busr_lel828004_a.pdf
  - https://www.toyota.ca/content/dam/toyota/documents/manuals/en/OM04009U/OM04009U.pdf
  - https://www8.garmin.com/manuals/webhelp/GUID-413FE004-9D7D-474E-8423-3B787BC4A5BF/EN-US/GUID-5DDC41B8-E786-41C9-85FD-7D8A45BB0C23.html
problem: troubleshooting-by-symptom
also_teaches: [error-message-reference, urgency-tiers]
patterns: [symptom-first, symptom-as-displayed, cause-then-action, cheapest-cause-first, escalation-last, not-a-fault, link-out-long-fixes]
art_style: typographic tables, mostly monochrome with one maker colour for navigation
tested_in: [C-007]
best_example:
---

# Troubleshooting by symptom: learned from appliance, printer, car and GPS manuals

**Problem this entry is for:** something has gone wrong and the reader doesn't know why.
They know only what they can see or hear: a light, a message, a noise, a bad result.
They want to fix it themselves if they can, and to know quickly when they can't.

**Use for:** troubleshooting pages, error-message references, "something's wrong" help,
FAQ-style support pages for products and software.

> **Version note.** Written in C-006. **C-007 blind test: lost** "which would you use" to a page
> built with no guidance. That page already followed rules 1, 3, 4, 5 and 6 unprompted, and
> delivered them interactively (one check at a time), while the entry's page copied the
> printed manuals' exhaustive index and tables (2,466 words vs 399). Treat rules 1 and 3–6 as
> things the agent already does; the entry's added value is unproven. See T-008.

## 1. Source

Four makers, four product types, chosen so they wouldn't share a house style:

| Maker / product | Document | Section | Pages read |
|---|---|---|---|
| Miele dishwasher (en-CA, HG07) | operating instructions, 88 pp, A5 | "Problem solving guide" | 65–72 |
| Brother DCP-J152W printer | Basic User's Guide, 90 pp, A4 | "B Troubleshooting" | 39–46 (PDF 45–52) |
| Toyota Tacoma 2015 | owner's manual OM04009U, 591 pp | "When trouble arises" + "What to do if…" index | 476–480, 585–586 |
| Garmin GPSMAP Touch | online owner's manual (web help, v13, Jan 2025) | "Troubleshooting" | landing page + 2 topics |

Three are printed PDFs, one is web help. Unlike IKEA (C-003), there's no shared house
standard here, so anything constant across all four is a convention of the problem itself.

## 2. Observed facts

### Constant: in all four

- **The entry point is the symptom, in terms the reader can observe.** Never the internal
  part or the cause. Miele: "The dishwasher will not start." Brother: the exact LCD
  message, or "Poor print quality." Toyota: the warning light itself, and a back-of-book
  index in the owner's words ("The engine does not start", "Steam can be seen coming
  from under the hood"). Garmin writes headings in the first person: "My device will not
  turn on or keeps turning off."
- **The cause is stated separately from the action.** Miele puts a cause sentence, then ■
  action bullets. Brother uses separate Cause and Action columns, and Toyota uses Details and
  Correction procedure. Garmin opens with an intro sentence naming the likely cause, then bullets.
- **Several causes under one symptom, each with its own fix.** Miele lists four causes for
  "will not start". Brother has five sub-rows for "No Paper Fed". Toyota splits by the
  light's state ("when the light comes on" / "when the light flashes"). Garmin gives
  three checks for "will not turn on", then support.
- **Escalation is the last step,** named and specific: "Contact Miele Service",
  "contact Brother customer service or your local Brother dealer", "contact your Toyota
  dealer", "contact Garmin product support".
- **Long fixes are linked out, not repeated.** Miele says "see 'Cleaning the filters' under
  'Cleaning and care'". Brother says "(See Replacing the ink cartridges on page 32.)",
  Toyota uses "(→P. 482)", and Garmin links to Software Updates. The troubleshooting row stays
  short, and a full illustrated procedure lives elsewhere (Brother's paper-jam steps,
  pages 45–46).
- **Actions are short imperatives:** "Insert the plug." "Refuel the vehicle." Most
  instructional writing does this, so it's the weakest of the constants.

### Conditional: appears when the product or problem calls for it

| Device | Present when… | Miele | Brother | Toyota | Garmin |
|---|---|---|---|---|---|
| Symptom quoted exactly as the product shows it, in its own typeface | the product displays codes, messages or icons | ✓ fault codes `F11` set in a separate display-numeral font (`Z_NUM`) | ✓ LCD messages in Courier New | ✓ the actual warning-light icons | — (no codes) |
| Causes ordered cheapest/most-likely first | a symptom has several causes | ✓ door → plug → breaker → switch | ✓ refill paper → tray → clean rollers | — mostly one cause per light | ✓ power source → fuse → voltage → support |
| "Not a fault" entries (normal behaviour) | something looks wrong but isn't | ✓ "This is part of the normal function of the drying system" | partial: "Ink low… you can continue printing" | ✓ "If a light turns on… then turns off, this does not necessarily indicate a malfunction" | ✓ reacquiring satellites can take longer after a long move |
| Urgency tiers, most severe first | some symptoms are dangerous | — | — | ✓ "Stop the vehicle immediately" / "Have the vehicle inspected immediately" / "Follow the correction procedures" | — |
| Scope statement: what you can fix vs. what needs service | there's a service network | ✓ "This section only lists faults that you can remedy yourself" | ✓ "You can correct most problems by yourself" | via tiers | — |
| Safety step before the fix | the fix touches power or water | ✓ "Before remedying the fault: turn the dishwasher off" | ✓ "Unplug the machine" (jam steps) | ✓ "Stop the vehicle in a safe place" | — |
| Symptom index routing to pages | the manual is long | — (tables are the index) | ✓ "identify your problem and then go to the suggested page" | ✓ "What to do if…" index | ✓ topic list as links |

### Varies freely

- **Layout:** two-column tables (Miele), three-column tables (Brother, Toyota's correctable
  lights), or a heading with bullets per topic (Garmin web help).
- **Grouping:** by kind of problem (Miele: technical, fault messages, water intake,
  drainage, noises, poor cleaning results), alphabetically by message (Brother), by
  urgency (Toyota), or a flat list (Garmin).
- **Colour:** Miele uses black `#231F20` on white with grey table headers `#DEDDDE`.
  Brother has a blue chapter tab and header band (`#004FFF`, `#CCDCFF`). Toyota uses a pink
  section colour (`#F465BA`, `#F9B3DD`) to mark the "When trouble arises" chapter. Each
  maker has at most one colour, and it's used for navigation, not inside the tables.
- **Typefaces:** Helvetica Neue (Miele), Arial (Brother), Arial + Trade Gothic (Toyota).
  All plain sans-serif.

## 3. Why it works (the part that transfers)

- **People arrive with a symptom, not a diagnosis.** If the page is organised by component
  ("Drain pump", "Network settings"), the reader has to already know the answer to
  find it. Writing headings as the observation, even in the first person ("My device
  will not turn on"), matches the question in the reader's head.
- **Quoting the display exactly makes the match certain.** `Cannot Detect Ink` in a
  monospace face, or `F11` in a display-style numeral, lets the reader compare
  character by character with what's on their screen. Paraphrasing ("ink errors") breaks
  that.
- **Cause before action tells the reader whether the row applies.** "The door is not
  closed properly" is something they can check in two seconds. If it isn't true, they
  skip the action and move to the next cause. That's why each cause gets its own row.
- **Cheapest first saves the most time overall.** Checking the plug before testing the
  fuse with a multimeter means most readers stop early. The order is the diagnosis.
- **A named last step stops endless trying.** Every chain ends with who to contact, so
  the reader knows when they've done everything they're expected to do.
- **"Not a fault" entries prevent fixes for things that aren't broken.** Moisture
  after drying, a light that flicks on then off: listing these saves a service call and
  a worried reader.
- **Linking out keeps each row short enough to scan.** The row says what and why. The
  separate procedure says how, with pictures.

## 4. Transferable rules (for an agent building a page)

These describe the problem's needs. Don't copy any maker's logo, symbols, colours or
icon set.

1. **Index by symptom, written as the reader would notice or say it.** Use "The page
   is blank after login", not "Session handling". Every entry heading is an observation,
   never a component or a cause.
2. **When the product shows a message, code or icon, quote it exactly** in monospace (or
   show the icon), and make the list findable by it: sorted by the message text, or
   searchable. Don't paraphrase the message.
3. **Under each symptom, one row per cause: the cause as a checkable sentence, then a
   short imperative fix.** Order the rows cheapest/most likely first.
4. **End every symptom with the escalation step:** who to contact, or what to collect
   before contacting them. If any symptom is dangerous or causes damage, group symptoms by
   urgency first ("Stop now" / "Fix soon" / "Fix when convenient") and say which tier
   each is in.
5. **Include "not a fault" entries** for behaviour that looks wrong but is normal, in the
   same list, so readers searching that symptom find the reassurance.
6. **Keep each row short; link out to the full procedure.** If a fix needs more than
   about two actions, link to its own step-by-step page or section instead of writing it
   inline (that page can follow the step-by-step entry).

## 5. When it doesn't apply

- **The reader already knows the cause** and wants the procedure, e.g. "replace the
  cartridge". That's a step-by-step page, not troubleshooting.
- **Problems that need judgment or investigation over time** (intermittent faults,
  performance tuning). A symptom → cause table can't capture "it depends". Toyota and
  Miele both send these to service.
- **Safety-critical emergencies.** Toyota's "Stop the vehicle immediately" tier is a
  different kind of page: one action, no diagnosis. Don't bury it in a cause table.
- **An interactive page where the reader is mid-problem.** The printed manuals list every
  symptom and cause at once because paper can't ask questions. On a web page, the same
  convention (symptom → cheapest cause → fix → escalation) can be asked one step at a time,
  and in C-007 that version was preferred. Don't copy the printed page's exhaustiveness
  onto an interactive one; keep it for a reference/lookup page.
- **Very long symptom lists without a search.** Brother needs an alphabetical order and
  a routing page; on the web, a filter or search is the equivalent. Without one, 40
  symptoms in a list fail rule 1.
