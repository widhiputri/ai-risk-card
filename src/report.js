'use strict';

const DIMENSION_COLORS = {
  'Fairness & Bias':             { border: '#e53935', bg: '#fff5f5', color: '#c62828', pill: '#fce4ec' },
  'Accountability & Governance': { border: '#5c6bc0', bg: '#f5f6ff', color: '#3949ab', pill: '#e8eaf6' },
  'Transparency':                { border: '#00897b', bg: '#f0faf9', color: '#00695c', pill: '#e0f2f1' },
  'Legal & Regulatory':          { border: '#f57c00', bg: '#fff8f0', color: '#e65100', pill: '#fff3e0' },
  'Robustness & Stability':      { border: '#43a047', bg: '#f3fbf4', color: '#2e7d32', pill: '#e8f5e9' },
  'Cyber & Data Security':       { border: '#8e24aa', bg: '#fdf4ff', color: '#6a1b9a', pill: '#f3e5f5' },
  'Ethics':                      { border: '#fb8c00', bg: '#fffbf0', color: '#e65100', pill: '#fff8e1' },
};

const AI_TYPE_COLORS = {
  'Diagnostic':  { bg: '#e3f2fd', color: '#1565c0', border: '#1565c0' },
  'Predictive':  { bg: '#e8f5e9', color: '#2e7d32', border: '#2e7d32' },
  'Generative':  { bg: '#ede7f6', color: '#6a1b9a', border: '#6a1b9a' },
  'Agentic':     { bg: '#fff3e0', color: '#e65100', border: '#e65100' },
};

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function safe(val) {
  return val ? esc(val) : `<span class="empty">Not provided</span>`;
}

function nl2br(str) {
  if (!str) return `<span class="empty">Not provided</span>`;
  return esc(str).replace(/\n/g, '<br>');
}

function formatDate(str) {
  if (!str) return null;
  const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const parts  = String(str).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!parts) return str;
  const d = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
  if (isNaN(d)) return str;
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function formatLocalTimestamp() {
  const d      = new Date();
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const pad    = n => String(n).padStart(2, '0');
  const offset = -d.getTimezoneOffset();
  const sign   = offset >= 0 ? '+' : '-';
  const abs    = Math.abs(offset);
  const tz     = `UTC${sign}${pad(Math.floor(abs/60))}:${pad(abs%60)}`;
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} `
       + `${pad(d.getHours())}:${pad(d.getMinutes())} (${tz})`;
}

function renderDimensionPill(dimension) {
  const c = DIMENSION_COLORS[dimension] || { pill: '#f1f5f9', color: '#64748b' };
  return `<span class="dim-pill" style="background:${c.pill};color:${c.color}">${esc(dimension)}</span>`;
}

function renderSection(id, title, icon, content, badge) {
  const badgeHtml = badge != null
    ? `<span class="section-count">${badge}</span>`
    : '';
  return `
  <section class="card-section" id="${id}">
    <div class="section-header">
      <span class="section-icon">${icon}</span>
      <h2 class="section-title">${title}</h2>
      ${badgeHtml}
    </div>
    <div class="section-body">${content}</div>
  </section>`;
}

function renderRow(label, value) {
  return `
  <div class="info-row">
    <span class="info-label">${label}</span>
    <span class="info-value">${value}</span>
  </div>`;
}

function renderProseBlock(label, content) {
  return `
  <div class="prose-block">
    <div class="prose-label">${label}</div>
    <div class="prose-content">${content}</div>
  </div>`;
}

function renderGeneral(g = {}, aiType, modalities) {
  const typeCell = aiType
    ? (() => { const c = AI_TYPE_COLORS[aiType] || { bg: '#f1f5f9', color: '#64748b', border: '#94a3b8' };
        return `<span class="type-pill" style="background:${c.bg};color:${c.color};border-left-color:${c.border}">${esc(aiType)}</span>`; })()
    : `<span class="empty">Not specified</span>`;

  const modalCell = modalities && modalities.length
    ? modalities.map(m => `<span class="tag">${esc(m)}</span>`).join('')
    : `<span class="empty">N/A</span>`;

  return `<div class="info-grid">
    ${renderRow('System Name', safe(g.name))}
    ${renderRow('AI Type', typeCell)}
    ${renderRow('System Version', safe(g.version))}
    ${renderRow('System License', safe(g.license))}
    ${renderRow('System Last Updated', safe(formatDate(g.lastUpdated)))}
    ${renderRow('Provider / Developer', safe(g.provider))}
    ${renderRow('Contact', g.contact ? `<a href="mailto:${esc(g.contact)}">${esc(g.contact)}</a>` : `<span class="empty">Not provided</span>`)}
    ${renderRow('Input / Output Modalities', modalCell)}
  </div>`;
}

function renderPurpose(p = {}) {
  return renderProseBlock('Intended Uses, Users and Domains', nl2br(p.intendedUse))
       + renderProseBlock('Usage Guidance', nl2br(p.usageGuidance));
}

function renderTechniques(t = {}) {
  return renderProseBlock('Main AI Techniques', nl2br(t.description))
       + renderProseBlock('Architecture and Components', nl2br(t.architecture))
       + renderProseBlock('External AI Service Calls', nl2br(t.externalServices));
}

function renderRisks(risks = []) {
  if (!risks.length) return `<p class="empty-state">No risks listed.</p>`;

  return `<div class="risk-list">` + risks.map((r, i) => {
    const dc = r.dimension ? (DIMENSION_COLORS[r.dimension] || { border: '#cbd5e1', bg: '#f8fafc', color: '#64748b' }) : { border: '#cbd5e1', bg: '#f8fafc', color: '#64748b' };
    return `
    <details class="risk-item" style="border-left-color:${dc.border};background:${dc.bg}" ${i === 0 ? 'open' : ''}>
      <summary class="risk-summary">
        <span class="expand-icon">&#9654;</span>
        <span class="risk-name">${esc(r.risk || 'Unnamed risk')}</span>
        ${r.dimension ? renderDimensionPill(r.dimension) : ''}
      </summary>
      <div class="risk-body">
        ${renderProseBlock('Mitigation Strategy', nl2br(r.mitigation))}
        ${r.guidance ? renderProseBlock('Appropriate Use Guidance', nl2br(r.guidance)) : ''}
      </div>
    </details>`;
  }).join('') + `</div>`;
}

function renderDatasets(datasets = []) {
  if (!datasets.length) return `<p class="empty-state">No dataset information provided.</p>`;

  return `<div class="dataset-list">` + datasets.map((d, i) => `
    <details class="dataset-item" ${i === 0 ? 'open' : ''}>
      <summary class="dataset-summary">
        <span class="expand-icon">&#9654;</span>
        <div class="dataset-summary-main">
          <span class="dataset-name">${esc(d.name || `Dataset ${i + 1}`)}</span>
          ${d.type ? `<span class="tag tag-teal">${esc(d.type)}</span>` : ''}
        </div>
      </summary>
      <div class="dataset-body">
        <div class="info-grid">
          ${renderRow('Sources', safe(d.sources))}
          ${renderRow('Pre-processing', safe(d.preprocessing))}
          ${renderRow('Personal / Private Data', safe(d.personalData))}
          ${renderRow('Representativeness', safe(d.representativeness))}
        </div>
      </div>
    </details>`).join('') + `</div>`;
}

function renderEvaluation(evaluation = []) {
  if (!evaluation.length) return `<p class="empty-state">No evaluation metrics provided.</p>`;

  return `<div class="eval-grid">` + evaluation.map(e => `
    <div class="eval-card">
      <div class="eval-metric-name">${esc(e.metric || '')}</div>
      ${e.justification ? `<div class="eval-justification">${nl2br(e.justification)}</div>` : ''}
      <div class="eval-result-row">
        <span class="eval-result-label">Result</span>
        <span class="eval-result">${safe(e.result)}</span>
      </div>
      ${e.methodology ? `
      <details class="eval-method-details">
        <summary class="eval-method-toggle">
          <span class="expand-icon-sm">&#9654;</span> Methodology
        </summary>
        <div class="eval-method-body">${nl2br(e.methodology)}</div>
      </details>` : ''}
    </div>`).join('') + `</div>`;
}

function renderCybersecurity(c = {}) {
  return renderProseBlock('Data Shared with Provider', nl2br(c.dataShared))
       + renderProseBlock('Data Handling by Provider', nl2br(c.dataHandling))
       + renderProseBlock('Cybersecurity Metrics and Results', nl2br(c.securityMetrics))
       + renderProseBlock('Security and Data Protection Attestations', nl2br(c.attestations));
}

function renderChanges(changes = []) {
  if (!changes.length) return `<p class="empty-state">No pre-determined changes listed.</p>`;

  return `<div class="changes-list">` + changes.map(c => `
    <div class="change-card">
      <div class="change-card-top">
        <span class="change-name">${esc(c.change || '')}</span>
        ${c.frequency ? `<span class="change-freq-badge">${esc(c.frequency)}</span>` : ''}
      </div>
      ${c.expectedImpact ? `<div class="change-impact">${nl2br(c.expectedImpact)}</div>` : ''}
    </div>`).join('') + `</div>`;
}

function renderStandards(standards = []) {
  if (!standards.length) return `<p class="empty-state">No standards or certifications listed.</p>`;

  return `<div class="standards-list">` + standards.map((s, i) => `
    <div class="standard-item">
      <span class="standard-num">${String(i + 1).padStart(2, '0')}</span>
      <div class="standard-main">
        <span class="standard-name">${esc(s.standard || '')}</span>
        ${s.details ? `<span class="standard-detail">${esc(s.details)}</span>` : ''}
      </div>
      ${s.link ? `<a class="standard-link" href="${esc(s.link)}" target="_blank">View &#8599;</a>` : ''}
    </div>`).join('') + `</div>`;
}

function renderComponents(c = {}) {
  const listHtml = (c.components || []).length
    ? `<div class="component-list">` + c.components.map(comp => `
      <div class="component-item">
        <div class="component-main">
          <span class="component-name">${esc(comp.name || '')}</span>
          ${comp.version ? `<span class="tag">${esc('v' + comp.version)}</span>` : ''}
          ${comp.source ? `<a class="standard-link" href="${esc(comp.source)}" target="_blank">Source &#8599;</a>` : ''}
        </div>
        ${comp.description ? `<div class="component-desc">${esc(comp.description)}</div>` : ''}
      </div>`).join('') + `</div>`
    : `<p class="empty-state">No components listed.</p>`;

  const flowHtml = c.dataFlowDescription
    ? renderProseBlock('Data Flow Description', nl2br(c.dataFlowDescription))
    : '';

  return listHtml + (flowHtml ? `<div style="margin-top:20px">${flowHtml}</div>` : '');
}

function generateCard(data) {
  const g          = data.general   || {};
  const generated  = formatLocalTimestamp();
  const cardTitle  = g.name ? `AI Disclosure Card Report - ${g.name}` : 'AI Disclosure Card Report';
  const aiType     = data.aiType    || null;
  const modalities = data.modalities || [];
  const risks      = data.risks      || [];
  const datasets   = data.datasets   || [];
  const evaluation = data.evaluation || [];
  const changes    = data.changes    || [];
  const standards  = data.standards  || [];

  const navItems = [
    ['general',       'General'],
    ['purpose',       'Purpose'],
    ['techniques',    'Techniques'],
    ['risks',         'Risks'],
    ['datasets',      'Datasets'],
    ['evaluation',    'Evaluation'],
    ['cybersecurity', 'Cybersecurity'],
    ['changes',       'Changes'],
    ['standards',     'Standards'],
  ];
  if (data.components) navItems.push(['components', 'Components']);

  const navHtml = navItems
    .map(([id, label]) => `<a class="nav-link" href="#${id}">${label}</a>`)
    .join('');

  const typeColors  = aiType ? (AI_TYPE_COLORS[aiType] || { bg: '#f1f5f9', color: '#64748b' }) : null;
  const typeBadge   = typeColors
    ? `<span class="header-type-badge" style="background:${typeColors.bg};color:${typeColors.color};border-left-color:${typeColors.border || typeColors.color}">${esc(aiType)}</span>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(cardTitle)}</title>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect fill='%230b1f42' width='24' height='24' rx='4'/><path fill='%23fff' d='M6 7h12v2H6zm0 4h12v2H6zm0 4h8v2H6z'/></svg>">
<style>
:root{
  --navy:#0b1f42;
  --navy-mid:#1a3a6b;
  --navy-light:#2a52a0;
  --navy-subtle:#eef3fb;
  --navy-border:#d5e0f5;
  --body-bg:#edf1f9;
  --card-bg:#ffffff;
  --text-primary:#0f172a;
  --text-secondary:#475569;
  --text-muted:#94a3b8;
  --border:#e2e8f0;
  --radius:12px;
  --shadow:0 2px 8px rgba(11,31,66,.09),0 0 0 1px rgba(11,31,66,.04);
}

*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.6;color:var(--text-primary);background:var(--body-bg)}
a{color:var(--navy-light);text-decoration:none}
a:hover{text-decoration:underline}

/* ── Header ── */
header{background:linear-gradient(135deg,var(--navy) 0%,var(--navy-mid) 100%);color:#fff;padding:0;position:relative;overflow:hidden}
header::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");pointer-events:none}
.header-inner{position:relative;padding:36px 20px 36px;text-align:left}
header h1{font-size:36px;font-weight:800;letter-spacing:-.5px;line-height:1.1;margin-bottom:10px}
.header-subtitle{font-size:20px;font-weight:500;opacity:.75;margin-bottom:16px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.header-type-badge{font-size:11px;font-weight:700;padding:3px 11px;border-radius:4px;letter-spacing:.4px;vertical-align:middle;border-left:3px solid transparent}
.header-meta{display:flex;gap:0;flex-wrap:wrap;margin-top:12px}
.header-meta-item{font-size:12px;opacity:.65;padding-right:20px;margin-right:20px;border-right:1px solid rgba(255,255,255,.2);line-height:2}
.header-meta-item:last-child{border-right:none}
.header-meta-label{opacity:.7;margin-right:4px}
.header-meta-value{font-weight:600}
.framework-tag{margin-top:10px;font-size:12px;opacity:.5;letter-spacing:.2px}

/* ── Nav ── */
.nav-bar{background:var(--card-bg);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:20;box-shadow:0 1px 4px rgba(11,31,66,.06)}
.nav-inner{padding:0 32px;display:flex;overflow-x:auto;scrollbar-width:none}
.nav-inner::-webkit-scrollbar{display:none}
.nav-link{font-size:12px;font-weight:600;color:var(--text-muted);padding:13px 0;flex:1;text-align:center;white-space:nowrap;border-bottom:2px solid transparent;transition:color .15s,border-color .15s;text-decoration:none}
.nav-link:hover{color:var(--navy);border-bottom-color:var(--navy-border);text-decoration:none}

/* ── Layout ── */
.container{padding:28px 32px 48px}

/* ── Cards ── */
.card-section{background:var(--card-bg);border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:16px;overflow:hidden}
.section-header{display:flex;align-items:center;gap:10px;padding:14px 24px;border-bottom:1px solid var(--border);background:var(--navy-subtle)}
.section-icon{width:32px;height:32px;background:var(--navy);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;letter-spacing:.5px;flex-shrink:0;line-height:1;font-family:'Consolas','Monaco',monospace}
.section-title{font-size:11px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:1px;flex:1}
.section-count{font-size:11px;font-weight:700;color:var(--navy-light);background:var(--navy-border);padding:2px 9px;border-radius:20px}
.section-body{padding:22px 24px}

/* ── Info rows ── */
.info-grid{display:flex;flex-direction:column}
.info-row{display:flex;align-items:baseline;gap:16px;padding:10px 0;border-bottom:1px solid var(--border)}
.info-row:last-child{border-bottom:none}
.info-label{font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;width:260px;flex-shrink:0}
.info-value{font-size:13px;color:var(--text-primary);flex:1;display:flex;align-items:center;gap:6px;flex-wrap:wrap}

/* ── Prose blocks ── */
.prose-block{margin-bottom:18px}
.prose-block:last-child{margin-bottom:0}
.prose-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text-muted);margin-bottom:8px}
.prose-content{font-size:13px;color:var(--text-secondary);line-height:1.75;background:var(--navy-subtle);border-left:3px solid var(--navy-border);border-radius:0 8px 8px 0;padding:12px 16px}

/* ── Tags ── */
.tag{font-size:11px;font-weight:600;background:#f1f5f9;color:#475569;padding:2px 8px;border-radius:4px;white-space:nowrap}
.tag-teal{background:#e0f2f1;color:#00695c}
.type-pill{font-size:12px;font-weight:700;padding:4px 12px;border-radius:4px;white-space:nowrap;border-left:3px solid transparent}
.dim-pill{font-size:11px;font-weight:600;padding:2px 10px;border-radius:20px;white-space:nowrap;flex-shrink:0}

/* ── Expand icon ── */
.expand-icon{font-size:9px;color:var(--text-muted);flex-shrink:0;transition:transform .15s;display:inline-block}

/* ── Risks ── */
.risk-list{display:flex;flex-direction:column;gap:8px}
.risk-item{border-left:3px solid #cbd5e1;border-radius:0 10px 10px 0;overflow:hidden;border:1px solid var(--border);border-left-width:3px}
.risk-summary{padding:13px 18px;cursor:pointer;display:flex;align-items:center;gap:10px;list-style:none;user-select:none;transition:filter .1s}
.risk-summary::-webkit-details-marker{display:none}
.risk-summary:hover{filter:brightness(.97)}
details.risk-item[open] .expand-icon{transform:rotate(90deg)}
.risk-name{font-weight:600;font-size:13px;flex:1;color:var(--text-primary)}
.risk-body{padding:16px 18px;border-top:1px solid var(--border)}

/* ── Datasets ── */
.dataset-list{display:flex;flex-direction:column;gap:8px}
.dataset-item{border:1px solid var(--border);border-radius:10px;overflow:hidden}
.dataset-summary{padding:13px 18px;cursor:pointer;display:flex;align-items:center;gap:10px;list-style:none;user-select:none;background:var(--navy-subtle)}
.dataset-summary::-webkit-details-marker{display:none}
.dataset-summary:hover{background:var(--navy-border)}
details.dataset-item[open] .expand-icon{transform:rotate(90deg)}
.dataset-summary-main{display:flex;align-items:center;gap:8px;flex:1;flex-wrap:wrap}
.dataset-name{font-weight:600;font-size:13px;color:var(--text-primary)}
.dataset-body{padding:16px 18px;border-top:1px solid var(--border)}

/* ── Evaluation cards ── */
.eval-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.eval-card{border:1px solid var(--border);border-radius:10px;padding:18px;background:var(--navy-subtle);display:flex;flex-direction:column;gap:10px}
.eval-metric-name{font-weight:700;font-size:13px;color:var(--navy);line-height:1.4}
.eval-justification{font-size:12px;color:var(--text-muted);line-height:1.6;border-top:1px solid var(--border);padding-top:10px}
.eval-result-row{display:flex;align-items:baseline;gap:8px;margin-top:auto;padding-top:10px;border-top:1px solid var(--border)}
.eval-result-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--text-muted)}
.eval-result{font-family:'Consolas','Monaco',monospace;font-size:12px;color:#166534;font-weight:700;background:#dcfce7;padding:2px 10px;border-radius:6px}
.eval-method-details{margin-top:4px}
.eval-method-toggle{cursor:pointer;list-style:none;user-select:none;display:flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--navy-light)}
.eval-method-toggle::-webkit-details-marker{display:none}
.expand-icon-sm{font-size:8px;transition:transform .15s;display:inline-block}
details.eval-method-details[open] .expand-icon-sm{transform:rotate(90deg)}
.eval-method-body{margin-top:8px;font-size:12px;color:var(--text-muted);line-height:1.6;padding:10px 12px;background:var(--card-bg);border-radius:6px;border:1px solid var(--border)}

/* ── Changes ── */
.changes-list{display:flex;flex-direction:column;gap:10px}
.change-card{border:1px solid var(--border);border-radius:10px;padding:16px 20px;background:var(--navy-subtle)}
.change-card-top{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:8px}
.change-name{font-weight:600;font-size:13px;color:var(--text-primary)}
.change-freq-badge{font-size:11px;font-weight:700;color:#9a3412;background:#ffedd5;padding:3px 10px;border-radius:20px;white-space:nowrap;flex-shrink:0}
.change-impact{font-size:13px;color:var(--text-secondary);line-height:1.6}

/* ── Standards ── */
.standards-list{display:flex;flex-direction:column;gap:0}
.standard-item{display:flex;align-items:flex-start;gap:16px;padding:16px 0;border-bottom:1px solid var(--border)}
.standard-item:last-child{border-bottom:none}
.standard-num{font-size:11px;font-weight:700;color:var(--card-bg);background:var(--navy);width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.standard-main{display:flex;flex-direction:column;gap:3px;flex:1}
.standard-name{font-weight:600;font-size:13px;color:var(--text-primary)}
.standard-detail{font-size:12px;color:var(--text-muted);line-height:1.5}
.standard-link{font-size:11px;font-weight:700;color:var(--navy);background:var(--navy-border);padding:3px 10px;border-radius:6px;white-space:nowrap;flex-shrink:0;margin-top:2px}
.standard-link:hover{background:var(--navy-light);color:#fff;text-decoration:none}

/* ── Components ── */
.component-list{display:flex;flex-direction:column;gap:0}
.component-item{display:flex;flex-direction:column;gap:5px;padding:14px 0;border-bottom:1px solid var(--border)}
.component-item:last-child{border-bottom:none}
.component-main{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.component-name{font-weight:600;font-size:13px;color:var(--text-primary)}
.component-desc{font-size:12px;color:var(--text-muted);line-height:1.6}

/* ── Misc ── */
.empty{color:var(--text-muted);font-style:italic;font-size:12px}
.empty-state{color:var(--text-muted);font-style:italic;font-size:13px;padding:8px 0}

footer{background:var(--navy);color:rgba(255,255,255,.4);margin-top:8px;padding:14px 32px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:11px}
footer a{color:rgba(255,255,255,.5);text-decoration:none}
footer a:hover{color:#fff}
.footer-brand{font-weight:700;color:rgba(255,255,255,.7);font-size:11px}

/* ── Responsive ── */
@media(max-width:768px){
  header{padding:22px 20px}
  .info-label{width:130px}
  .eval-grid{grid-template-columns:1fr}
  .nav-link{padding:12px 10px;font-size:11px}
  .section-body{padding:16px}
  .container{padding:20px 16px 40px}
}

/* ── Print ── */
@media print{
  body{background:#fff}
  .nav-bar{display:none}
  .container{padding:16px 0 0;max-width:100%}
  header{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .card-section{box-shadow:none;border:1px solid var(--border);break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  details.risk-item,details.dataset-item,details.eval-method-details{overflow:visible}
  .eval-grid{grid-template-columns:1fr 1fr}
  @page{margin:1.2cm;size:A4}
}
</style>
</head>
<body>

<header>
  <div class="header-inner">
    <h1>AI Disclosure Card Report</h1>
    <div class="header-subtitle">Generated for ${esc(g.name || 'Unnamed System')}</div>
    <div class="header-meta">
      ${risks.length ? `<span class="header-meta-item"><span class="header-meta-label">Known Risks</span><span class="header-meta-value">${risks.length}</span></span>` : ''}
      <span class="header-meta-item"><span class="header-meta-label">Generated</span><span class="header-meta-value">${esc(generated)}</span></span>
    </div>
  </div>
</header>

<nav class="nav-bar">
  <div class="nav-inner">${navHtml}</div>
</nav>

<div class="container">

${renderSection('general', 'General Information', 'GI',
  renderGeneral(g, aiType, modalities)
)}

${renderSection('purpose', 'Purpose and Usage', 'PU',
  renderPurpose(data.purpose)
)}

${renderSection('techniques', 'Techniques and Development', 'TD',
  renderTechniques(data.techniques)
)}

${renderSection('risks', 'Risks', 'RK',
  renderRisks(risks),
  risks.length
)}

${renderSection('datasets', 'Datasets', 'DS',
  renderDatasets(datasets),
  datasets.length
)}

${renderSection('evaluation', 'Evaluation and Testing', 'EV',
  renderEvaluation(evaluation),
  evaluation.length
)}

${renderSection('cybersecurity', 'Cybersecurity and Data Protection', 'CS',
  renderCybersecurity(data.cybersecurity)
)}

${renderSection('changes', 'Pre-Determined Changes', 'CH',
  renderChanges(changes),
  changes.length
)}

${renderSection('standards', 'Standards and Certifications', 'ST',
  renderStandards(standards),
  standards.length
)}

${data.components ? renderSection('components', 'Components and Architecture', 'CA',
  renderComponents(data.components),
  (data.components.components || []).length || null
) : ''}

</div>

<footer>
  <span class="footer-brand">ai-risk-card</span>
  <span>Aligned with the <a href="https://www.mas.gov.sg/news/media-releases/2026/mas-partners-industry-to-develop-ai-risk-management-toolkit-for-the-financial-sector" target="_blank">MindForge AI Risk Management Framework</a> &bull; Appendix E &bull; January 2026</span>
</footer>

</body>
</html>`;
}

module.exports = { generateCard };
