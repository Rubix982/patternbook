# Runs

One folder per card that tested something (`c001/`, `c002/`, …). Each holds:

- `prompts/` — the exact prompt each agent got, verbatim. Rerun a test by giving a
  fresh agent the same prompt.
- `arm-*.html` — what each agent built.
- `.blind-key` — which blind page was which. Written before the judge looks; opened only
  after they answer.
- Any reference the agent wrote for itself (e.g. `c002/self-reference.md`).

Results, scores and the judge's words live in `CARD.md`, under the card's ID.

Agent-run timings, because they matter for the effort confound:

| Run | Time | Size |
|---|---|---|
| c001/arm-a (no guidance) | ~1.5 min | 22 KB |
| c001/arm-b (IKEA entry) | ~13 min | 202 KB |
| c002/arm-c (self-reference) | ~6 min | 36 KB |
