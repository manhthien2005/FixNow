# Project Note (FixNow)

## What was installed

Only `SKILL.md` was copied from the upstream repo
(`nextlevelbuilder/ui-ux-pro-max-skill`).

The original skill ships with a Python search engine in `scripts/search.py`
backed by CSV data in `data/`. Those are NOT included here to keep the
project surface minimal.

## Consequences

- `SKILL.md` references commands like:
  `python3 skills/ui-ux-pro-max/scripts/search.py "<query>"`
  These commands will NOT work as-is in this project.
- Treat those code blocks as illustrative of WHAT to think about
  (product type, style tokens, palette, font pairing, UX heuristics),
  not as literal commands.

## Two ways to recover the lookup capability

### A. Use the official CLI (recommended if you actually need lookups)

```bash
npm install -g uipro-cli
uipro init --ai claude --offline
```

That writes the full `scripts/` and `data/` tree into
`.claude/skills/ui-ux-pro-max/`. Then the python commands in SKILL.md work.

### B. Use the SKILL.md as a guide only

Read it as a checklist of considerations (style, palette, type, UX rules,
responsive, accessibility) and apply judgment manually using the rest of
the design system that lives in `docs/ui-system.md`.

For FixNow we are using option B by default — the design system in
`docs/ui-system.md` plus shadcn/ui + Tailwind is enough for the MVP.
Switch to option A only if you need broad style/palette exploration.
