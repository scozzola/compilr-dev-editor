# @compilr-dev/editor

AI-powered terminal markdown editor with Notion-style slash commands and 418 themes.

*"Notion in your terminal"*

## Features

- **Slash Commands** - Type `/` to open command palette with 40+ commands
- **23 Mermaid Templates** - Instant diagram insertion
- **418 Themes** - Full Ghostty theme collection
- **AI Writing** - Smart writing assistance (coming soon)
- **Document Management** - Tags, wiki-links, search (coming soon)

## Installation

```bash
npm install -g @compilr-dev/editor
```

## Usage

```bash
# Open a file
edit document.md

# Show help
edit --help

# Show version
edit --version
```

## Slash Commands

Type `/` in the editor to open the command palette. Available commands:

### Content
- `/h1`, `/h2`, `/h3` - Headings
- `/bold`, `/italic`, `/strikethrough` - Formatting
- `/link`, `/img` - Media
- `/code`, `/inlinecode` - Code blocks
- `/table` - Markdown tables
- `/list`, `/numbered`, `/checklist` - Lists
- `/quote`, `/callout` - Quotes and callouts
- `/hr`, `/toc`, `/frontmatter` - Structure

### Mermaid Diagrams
- `/mermaid flowchart` - Flow diagrams
- `/mermaid sequence` - Sequence diagrams
- `/mermaid class` - UML class diagrams
- `/mermaid gantt` - Gantt charts
- `/mermaid pie` - Pie charts
- `/mermaid mindmap` - Mind maps
- ...and 17 more diagram types!

### AI Commands (Coming Soon)
- `/ai expand` - Expand bullets to prose
- `/ai summarize` - TL;DR of selection
- `/ai fix` - Grammar and spelling
- `/ai diagram` - Generate diagram from description

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Open command palette |
| `Ctrl+S` | Save file |
| `Ctrl+C` | Exit editor |
| `Esc` | Close command palette |
| `↑/↓` | Navigate commands |
| `Enter` | Execute command |

## Themes

Press `Ctrl+T` to open theme picker. 418 themes available from the Ghostty collection.

## Requirements

- Node.js 18+
- Terminal with ANSI support

## Related Packages

- [@compilr-dev/editor-core](https://www.npmjs.com/package/@compilr-dev/editor-core) - Core library (commands, templates, themes)
- [@compilr-dev/agents](https://www.npmjs.com/package/@compilr-dev/agents) - AI agent library (optional, for AI features)

## License

MIT
