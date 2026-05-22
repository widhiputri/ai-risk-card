# ai-risk-card

Generate clean, shareable HTML AI disclosure cards aligned with the [MindForge AI Risk Management Framework](https://www.mas.gov.sg/news/media-releases/2026/mas-partners-industry-to-develop-ai-risk-management-toolkit-for-the-financial-sector) (MAS, January 2026).

AI Cards are structured disclosure documents that AI vendors provide to financial institutions (FIs) to support risk assessment and governance. This tool turns a JSON description of your AI system into a formatted, printable HTML card based on Appendix E of the MindForge Operationalisation Handbook.

## Install

```bash
npm install -g ai-risk-card
```

## Usage

```bash
ai-risk-card <input.json> [options]

Options:
  --output, -o <file>   Output file path (default: auto-generated)
  --help,  -h           Show help
```

**Examples:**

```bash
ai-risk-card my-model.json
ai-risk-card my-model.json --output credit-scorer-ai-card.html
```

Auto-generated filename format: `<ai-name>-<timestamp>-ai-card.html`

## Input format

See [`examples/sample-credit-scorer.json`](examples/sample-credit-scorer.json) for a complete example.

```jsonc
{
  "general": {
    "name": "Credit Risk Scorer",
    "version": "3.2.1",
    "lastUpdated": "2026-03-10",
    "provider": "FinAI Solutions Pte. Ltd.",
    "contact": "ai-governance@finai.example.com",
    "license": "Proprietary"
  },
  "aiType": "Predictive",           // Diagnostic | Predictive | Generative | Agentic
  "modalities": ["Text", "Image"],  // for Generative/Agentic only, or null
  "purpose": {
    "intendedUse": "...",
    "usageGuidance": "..."
  },
  "techniques": {
    "description": "...",
    "architecture": "...",
    "externalServices": "..."       // or null
  },
  "risks": [
    {
      "risk": "Lack of explainability",
      "dimension": "Transparency",  // MindForge Appendix B risk dimension
      "mitigation": "...",
      "guidance": "..."             // optional
    }
  ],
  "datasets": [
    {
      "name": "Training dataset",
      "type": "Structured tabular",
      "sources": "...",
      "preprocessing": "...",
      "personalData": "...",
      "representativeness": "..."
    }
  ],
  "evaluation": [
    {
      "metric": "Equal Opportunity Difference (EOD)",
      "justification": "...",
      "result": "0.018",
      "methodology": "..."
    }
  ],
  "cybersecurity": {
    "dataShared": "...",
    "dataHandling": "...",
    "securityMetrics": "...",
    "attestations": "SOC 2 Type II"
  },
  "changes": [
    {
      "change": "Quarterly model retraining",
      "frequency": "Quarterly",
      "expectedImpact": "..."
    }
  ],
  "standards": [
    {
      "standard": "ISO/IEC 42001:2023",
      "details": "...",
      "link": "https://..."         // optional
    }
  ],
  "components": {                   // optional addendum
    "components": [
      {
        "name": "XGBoost model",
        "version": "3.2.1",
        "description": "...",
        "source": "https://..."     // optional
      }
    ],
    "dataFlowDescription": "..."
  }
}
```

## Risk dimensions

Risk entries should reference one of the seven MindForge AI Risk Taxonomy dimensions (Appendix B):

- Fairness & Bias
- Accountability & Governance
- Transparency
- Legal & Regulatory
- Robustness & Stability
- Cyber & Data Security
- Ethics

## MindForge alignment

This tool implements the AI Card Template from Appendix E of the MindForge AI Risk Management Operationalisation Handbook (January 2026), published by MAS and the MindForge Consortium.

The nine sections of the output card correspond directly to the nine sections of the Appendix E template:

| Section | Template section |
|---|---|
| General Information | Section 1 |
| Purpose and Usage | Section 2 |
| Techniques and Development | Section 3 |
| Risks | Section 4 |
| Datasets | Section 5 |
| Evaluation and Testing | Section 6 |
| Cybersecurity and Data Protection | Section 7 |
| Pre-Determined Changes | Section 8 |
| Standards and Certifications | Section 9 |
| Components and Architecture | Optional Addendum |

## License

MIT
