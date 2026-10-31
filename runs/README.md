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
| c004/arm-d (old entry) | ~9 min | 36 KB |
| c004/arm-e (revised entry) | ~9 min | 98 KB |
| c005/* (five briefs, no guidance) | ~1–3.5 min each | 17–44 KB |
| c007/arm-a (no guidance) | ~2.5 min | 35 KB |
| c007/arm-b (troubleshooting entry) | ~2.5 min | 40 KB |
| c008/arm-a (no guidance) | ~2.5 min | 34 KB |
| c008/arm-b (art style only) | ~3.5 min | 31 KB |
| c009/arm-a (no guidance) | ~1.5 min | 25 KB |
| c009/arm-b (NASA-derived style) | ~1.5 min | 24 KB |
| c011/arm-a (line-art style) | ~4 min | 28 KB |
| c011/arm-b (PS Magazine style) | ~4 min | 52 KB |
