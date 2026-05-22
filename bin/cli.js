#!/usr/bin/env node

'use strict';

const fs   = require('fs');
const path = require('path');
const { generateCard } = require('../src/report');

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage:
  ai-risk-card <input.json> [options]

Options:
  --output, -o <file>   Output file path (overrides auto-generated name)
  --help,  -h           Show this help

Examples:
  ai-risk-card card.json
  ai-risk-card card.json --output my-ai-card.html

Auto-generated filename format:
  <ai-name>-<UTC timestamp>-ai-card.html
  e.g. credit-scorer-20260522091500-ai-card.html
`);
  process.exit(0);
}

const inputFile = args[0];
let outputFile  = null;

for (let i = 1; i < args.length; i++) {
  if ((args[i] === '--output' || args[i] === '-o') && args[i + 1]) {
    outputFile = args[++i];
  }
}

if (!fs.existsSync(inputFile)) {
  console.error(`Error: file not found: ${inputFile}`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
} catch (e) {
  console.error(`Error: could not parse JSON: ${e.message}`);
  process.exit(1);
}

if (!outputFile) {
  const slug = (data.general?.name || 'ai-card')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const ts   = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
  outputFile = `${slug}-${ts}-ai-card.html`;
}

const html = generateCard(data);
fs.writeFileSync(outputFile, html, 'utf8');
console.log(`AI Card written to: ${path.resolve(outputFile)}`);
