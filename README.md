# ai-risk-card

Generate clean, shareable HTML AI disclosure cards aligned with the [MindForge AI Risk Management Framework](https://www.mas.gov.sg/news/media-releases/2026/mas-partners-industry-to-develop-ai-risk-management-toolkit-for-the-financial-sector) (MAS, January 2026).

AI Cards are structured disclosure documents that AI vendors provide to financial institutions (FIs) to support risk assessment and governance. This tool turns a JSON description of your AI system into a formatted, printable HTML card based on Appendix E of the MindForge Operationalisation Handbook.

For AI agents, an optional **Agentic Runtime Safeguards** section documents how the agent is governed at the point of action, following MAS' [Safeguards for Agentic Finance at Runtime (SAFR)](https://www.mas.gov.sg/publications/monographs-or-information-paper/2026/safeguards-for-agentic-finance-at-runtime) white paper (v1.0, July 2026).

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

See [`examples/sample-credit-scorer.json`](examples/sample-credit-scorer.json) for a complete example, and [`examples/sample-payments-agent.json`](examples/sample-payments-agent.json) for an agent with the SAFR section filled in.

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
  },
  "agentic": {                      // optional, for AI agents (SAFR)
    "integration": "Native",        // Native | Gateway
    "identity": {
      "registry": "...",
      "agentId": "agent://...",
      "verification": "..."
    },
    "mandate": {
      "principal": "...",           // who delegated the authority, and who can revoke it
      "permittedActions": ["Read invoice", "Propose payment"],
      "exposureLimits": "...",
      "rateLimits": "...",
      "validity": "...",
      "revocation": "..."
    },
    "controls": [
      { "category": "Exposure Limits", "source": "Product rules", "rule": "..." }
    ],
    "actions": [
      {
        "action": "Propose payment above SGD 20,000",
        "outcome": "Escalate",      // Auto-Execute | Observe | Escalate | Deny
        "irreversible": true,       // risk factors, all optional booleans:
        "financiallyMaterial": true,//   irreversible, financiallyMaterial, customerImpact,
        "customerImpact": true,     //   regulatorySensitive, novel
        "rationale": "..."
      }
    ],
    "escalation": {
      "reviewer": "...",
      "reviewerAuthority": "...",
      "timeout": "2 business hours",
      "timeoutDefault": "block",    // what happens if nobody decides in time
      "volume": "...",              // expected escalations vs reviewer capacity
      "coverage": "..."
    },
    "envelope": "...",              // what each governance envelope carries
    "auditLog": "..."               // where decisions are recorded, and how
  }
}
```

If `aiType` is `"Agentic"` and there is no `agentic` block, the CLI prints a warning.

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

## SAFR alignment (agentic AI)

The optional `agentic` block maps to the SAFR reference model (MAS, white paper v1.0, July 2026):

| Card sub-section | SAFR concept |
|---|---|
| Agent Identity | Agent Identity component, integration pattern (Native or Gateway) |
| Mandate | Mandate and control parameters: permitted action types, principal authority, validity period |
| Controls Repository | Controls Repository and its control categories (Authorisation, Exposure Limits, Rate Limits, Evidence Quality) |
| Action Dispositions | Disposition Engine outcomes (Auto-Execute, Observe, Escalate, Deny) and the calibration factors |
| Human Reviewer Escalation | Escalation volume, review turnaround with a timeout default, reviewer authority |
| Governance Envelope and Audit Log | Governance Envelope contents and the tamper-evident Audit Log |

SAFR is an industry reference model, not a regulatory requirement. The card records how an institution has applied it.

## License

MIT
