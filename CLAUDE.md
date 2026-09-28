# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

`ai-risk-card` is a public npm package that turns a JSON description of an AI system into a
single HTML "AI Card": the disclosure document an AI vendor gives a financial institution for
risk assessment. It follows the AI Card Template in Appendix E of the MindForge AI Risk
Management Operationalisation Handbook (MAS, January 2026). Zero runtime dependencies, Node 16+.

## Layout

| Path | Role |
|---|---|
| `src/report.js` | The whole generator: one render function per card section, plus the HTML and CSS. Exports `generateCard(data)` |
| `bin/cli.js` | CLI: reads the JSON, warns about gaps, names the output file |
| `examples/*.json` | Fixtures and documentation: credit scorer (Predictive), customer chatbot (Generative), payments agent (Agentic, with the SAFR block) |
| `examples/*.html` | Generated from the JSON and committed on purpose (`.gitignore` re-includes them) so the README can link to real output. Regenerate after a render change |
| `.github/workflows/ci.yml` | Generates a card from the credit scorer sample on each Node version |
| `.github/workflows/publish.yml` | Publishes to npm on a `v*` tag |

## Commands

```bash
npm test                                                   # credit scorer sample to test-report.html
node bin/cli.js examples/sample-payments-agent.json -o examples/sample-payments-agent.html
```

There is no unit suite. After a change, generate every example, open them, and check a phone
width and print preview.

## Source frameworks, and what maps to what

- **MindForge Appendix E** defines the nine core sections, in order. The README table maps each
  one; keep the card and the table in step.
- **MindForge Appendix B** is the source of the seven risk dimensions (`DIMENSION_COLORS`).
  Appendix F is where the example evaluation metrics come from.
- **SAFR** (Safeguards for Agentic Finance at Runtime, MAS white paper v1.0, July 2026) drives
  the optional `agentic` block: Agent Identity, Mandate, Controls Repository, Disposition Engine
  outcomes (Auto-Execute, Observe, Escalate, Deny) with its calibration factors, human reviewer
  escalation, Governance Envelope and Audit Log. Use SAFR's own terms in labels.
- Optional blocks (`components`, `agentic`) render only when present, so an existing card JSON
  never breaks when a section is added.

## Regulatory watch

The card cites documents that are still moving. When one changes, check the card against it:

- **MAS Guidelines on AI Risk Management**: consulted November 2025, not yet final as of
  September 2026 (MAS said on 5 August 2026 they "will be finalised soon"). When they are
  issued, compare the final text with the card's sections, update the "proposed" wording in the
  example standards entries, and consider a minor release.
- **MindForge handbook**: MAS says it will be updated periodically. A new edition may renumber
  appendices or change the Appendix E template; the footer and README cite January 2026.
- **SAFR**: v1.0 is a white paper developed under BuildFin.ai. A later version may rename
  components or outcomes.

## Releasing

1. Bump `version` in `package.json` (new sections or fields are a minor bump).
2. Regenerate `examples/*.html`.
3. Merge to `main`, then push a `v<version>` tag; `publish.yml` publishes to npm. The `NPM_TOKEN`
   secret must be a granular token with "Bypass two-factor authentication" enabled, or the
   publish fails with EOTP.

## Writing rules

- No em dashes anywhere: code, comments, card copy, README, commit messages.
- Comments only for a non-obvious why, one line where possible.
- Card copy is read by risk and compliance staff, not only engineers: plain words first.
- Commits and PRs: no Claude co-author trailer and no "Generated with Claude Code" line.
