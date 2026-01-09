#!/usr/bin/env node

/**
 * @compilr-dev/editor CLI
 * "Notion in your terminal"
 *
 * Usage:
 *   edit [file]           Open file in editor
 *   edit --version        Show version
 *   edit --help           Show help
 */

import { Editor, VERSION } from '../dist/index.js';

const args = process.argv.slice(2);

// Help
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
@compilr-dev/editor v${VERSION}
AI-powered terminal markdown editor

Usage:
  edit [file]           Open file in editor
  edit --version        Show version
  edit --help           Show help

Features:
  - 40+ slash commands (type / to open palette)
  - 23 mermaid diagram templates
  - 418 themes
  - AI writing assistance (coming soon)

Commands:
  /mermaid [type]       Insert mermaid diagram
  /table [cols] [rows]  Insert markdown table
  /code [lang]          Insert code block
  /callout [type]       Insert callout box
  /h1, /h2, /h3         Insert headings
  ...and many more!

Press Ctrl+S to save, Ctrl+C to exit.
`);
  process.exit(0);
}

// Version
if (args.includes('--version') || args.includes('-v')) {
  console.log(`@compilr-dev/editor v${VERSION}`);
  process.exit(0);
}

// Get file path (first non-flag argument)
const filePath = args.find((arg) => !arg.startsWith('-'));

// Create and start editor
const editor = new Editor({ filePath });

// Handle Ctrl+C
process.on('SIGINT', () => {
  if (editor.isDirty()) {
    console.log('\nUnsaved changes. Press Ctrl+C again to exit without saving.');
    process.once('SIGINT', () => {
      console.log('\nExiting without saving.');
      process.exit(0);
    });
  } else {
    console.log('\nExiting.');
    process.exit(0);
  }
});

editor.start().catch((err) => {
  console.error('Error starting editor:', err);
  process.exit(1);
});
