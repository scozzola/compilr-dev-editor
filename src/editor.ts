/**
 * Terminal Markdown Editor
 * "Notion in your terminal"
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import {
  registerCommands,
  builtinCommands,
  executeCommand,
  parseCommandInput,
  getAllCommands,
  searchCommands,
  type CommandContext,
  type SlashCommand,
} from '@compilr-dev/editor-core';

export interface EditorOptions {
  /** File path to edit */
  filePath?: string;
  /** Initial content (if no file) */
  content?: string;
  /** Theme name */
  theme?: string;
}

export interface EditorState {
  /** Document content split into lines */
  lines: string[];
  /** Current cursor line (0-indexed) */
  cursorLine: number;
  /** Current cursor column (0-indexed) */
  cursorColumn: number;
  /** Scroll offset for display */
  scrollOffset: number;
  /** Whether content has been modified */
  isDirty: boolean;
  /** File path (if editing a file) */
  filePath?: string;
  /** Current theme name */
  theme: string;
  /** Whether slash command palette is open */
  isCommandPaletteOpen: boolean;
  /** Current command input */
  commandInput: string;
  /** Filtered commands for palette */
  filteredCommands: SlashCommand[];
  /** Selected command index in palette */
  selectedCommandIndex: number;
}

/**
 * Terminal markdown editor with slash commands
 */
export class Editor {
  private state: EditorState;
  private _isRunning: boolean = false;

  constructor(options: EditorOptions = {}) {
    // Register built-in commands
    registerCommands(builtinCommands);

    // Initialize state
    let content = options.content || '';

    if (options.filePath && existsSync(options.filePath)) {
      content = readFileSync(options.filePath, 'utf-8');
    }

    this.state = {
      lines: content.split('\n'),
      cursorLine: 0,
      cursorColumn: 0,
      scrollOffset: 0,
      isDirty: false,
      filePath: options.filePath,
      theme: options.theme || 'default',
      isCommandPaletteOpen: false,
      commandInput: '',
      filteredCommands: [],
      selectedCommandIndex: 0,
    };
  }

  /**
   * Get current document content
   */
  getContent(): string {
    return this.state.lines.join('\n');
  }

  /**
   * Set document content
   */
  setContent(content: string): void {
    this.state.lines = content.split('\n');
    this.state.isDirty = true;
  }

  /**
   * Get cursor position
   */
  getCursor(): { line: number; column: number } {
    return {
      line: this.state.cursorLine,
      column: this.state.cursorColumn,
    };
  }

  /**
   * Insert text at current cursor position
   */
  insertText(text: string): void {
    const { cursorLine, cursorColumn } = this.state;
    const currentLine = this.state.lines[cursorLine] || '';

    // Split the text into lines
    const insertLines = text.split('\n');

    if (insertLines.length === 1) {
      // Single line insert
      this.state.lines[cursorLine] =
        currentLine.slice(0, cursorColumn) + text + currentLine.slice(cursorColumn);
      this.state.cursorColumn += text.length;
    } else {
      // Multi-line insert
      const beforeCursor = currentLine.slice(0, cursorColumn);
      const afterCursor = currentLine.slice(cursorColumn);

      // First line
      this.state.lines[cursorLine] = beforeCursor + insertLines[0];

      // Middle lines
      for (let i = 1; i < insertLines.length - 1; i++) {
        this.state.lines.splice(cursorLine + i, 0, insertLines[i]);
      }

      // Last line
      const lastLineIndex = cursorLine + insertLines.length - 1;
      const lastInsertLine = insertLines[insertLines.length - 1];
      this.state.lines.splice(lastLineIndex, 0, lastInsertLine + afterCursor);

      // Update cursor position
      this.state.cursorLine = lastLineIndex;
      this.state.cursorColumn = lastInsertLine.length;
    }

    this.state.isDirty = true;
  }

  /**
   * Save document to file
   */
  save(): boolean {
    if (!this.state.filePath) {
      return false;
    }

    try {
      writeFileSync(this.state.filePath, this.getContent(), 'utf-8');
      this.state.isDirty = false;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Open slash command palette
   */
  openCommandPalette(): void {
    this.state.isCommandPaletteOpen = true;
    this.state.commandInput = '';
    this.state.filteredCommands = getAllCommands();
    this.state.selectedCommandIndex = 0;
  }

  /**
   * Close slash command palette
   */
  closeCommandPalette(): void {
    this.state.isCommandPaletteOpen = false;
    this.state.commandInput = '';
    this.state.filteredCommands = [];
    this.state.selectedCommandIndex = 0;
  }

  /**
   * Filter commands based on input
   */
  filterCommands(input: string): void {
    this.state.commandInput = input;
    if (input) {
      this.state.filteredCommands = searchCommands(input);
    } else {
      this.state.filteredCommands = getAllCommands();
    }
    this.state.selectedCommandIndex = 0;
  }

  /**
   * Execute the selected command
   */
  async executeSelectedCommand(): Promise<void> {
    const command = this.state.filteredCommands[this.state.selectedCommandIndex];
    if (!command) return;

    // Parse any arguments from the command input
    const fullInput = `/${command.name} ${this.state.commandInput.replace(command.name, '').trim()}`;
    const parsed = parseCommandInput(fullInput);

    if (parsed) {
      const context = this.createCommandContext();
      const result = await executeCommand(parsed.name, parsed.args, context);
      this.insertText(result);
    }

    this.closeCommandPalette();
  }

  /**
   * Execute a command by string input
   */
  async executeCommand(input: string): Promise<string | null> {
    const parsed = parseCommandInput(input);
    if (!parsed) return null;

    const context = this.createCommandContext();
    return executeCommand(parsed.name, parsed.args, context);
  }

  /**
   * Create command context from current state
   */
  private createCommandContext(): CommandContext {
    const { cursorLine, cursorColumn } = this.state;
    const content = this.getContent();

    // Calculate offset from line/column
    let offset = 0;
    for (let i = 0; i < cursorLine; i++) {
      offset += this.state.lines[i].length + 1; // +1 for newline
    }
    offset += cursorColumn;

    return {
      cursor: { line: cursorLine, column: cursorColumn, offset },
      content,
      selection: undefined, // TODO: implement selection
      metadata: undefined, // TODO: parse frontmatter
    };
  }

  /**
   * Get editor state (for rendering)
   */
  getState(): EditorState {
    return { ...this.state };
  }

  /**
   * Check if editor is dirty (has unsaved changes)
   */
  isDirty(): boolean {
    return this.state.isDirty;
  }

  /**
   * Start the editor (placeholder for interactive mode)
   */
  async start(): Promise<void> {
    this._isRunning = true;
    console.log('Editor started. Press Ctrl+C to exit.');
    console.log(`Editing: ${this.state.filePath || '(new file)'}`);
    console.log(`Lines: ${this.state.lines.length}`);
    console.log('');
    console.log('Type / to open command palette');
    console.log('');

    // TODO: Implement full interactive mode with raw terminal handling
    // For now, this is a placeholder
  }

  /**
   * Stop the editor
   */
  stop(): void {
    this._isRunning = false;
  }

  /**
   * Check if editor is running
   */
  isRunning(): boolean {
    return this._isRunning;
  }
}
