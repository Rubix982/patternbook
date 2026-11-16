No agent prompts in C-012. Both pages come from runs/c011/arm-b.html (the C-011 winner):
- arm-a.html: an unchanged copy.
- arm-b.html: the same page with treatments/treatments.js inlined and the press treatment
  applied to every svg[role=img], made with:
  python3 -I tools/inline-treatment.py runs/c011/arm-b.html runs/c012/arm-b.html --treatment press --opt ink=#1a1a1a --opt spot=#3f6e96
