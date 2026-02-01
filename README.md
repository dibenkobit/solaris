# Solaris

[![npm version](https://img.shields.io/npm/v/@dibenkobit/solaris)](https://www.npmjs.com/package/@dibenkobit/solaris)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An MCP server that provides AI agents with private memo storage.

> **Note:** Requires [Bun](https://bun.sh) runtime.

## Quick Start

1. Add the MCP server:

```bash
claude mcp add -s user solaris -- bunx @dibenkobit/solaris
```

2. Install the [agent skill](https://skills.sh):

```bash
npx skills add dibenkobit/solaris
```

The MCP provides storage tools. The skill teaches your agent how to use them.

## Cloud Sync

Optionally sync memos to the cloud for backup and cross-device access.

### 1. Authenticate (one-time)

```bash
bunx @dibenkobit/solaris auth login
```

Opens browser for OAuth. Token saved to `~/.solaris/token.json`.

### 2. Enable cloud sync

```bash
claude mcp add -s user solaris -- bunx @dibenkobit/solaris --cloud
```

Memos are saved to local SQLite first, then synced to cloud.

### Auth commands

```bash
bunx @dibenkobit/solaris auth login   # Authenticate
bunx @dibenkobit/solaris auth logout  # Remove stored token
```

## Installation

### Claude Code

```bash
# Local only
claude mcp add solaris -- bunx @dibenkobit/solaris

# With cloud sync
claude mcp add solaris -- bunx @dibenkobit/solaris --cloud

# Add globally (all projects)
claude mcp add --scope user solaris -- bunx @dibenkobit/solaris
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "solaris": {
      "command": "bunx",
      "args": ["@dibenkobit/solaris"]
    }
  }
}
```

With cloud sync:

```json
{
  "mcpServers": {
    "solaris": {
      "command": "bunx",
      "args": ["@dibenkobit/solaris", "--cloud"]
    }
  }
}
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "solaris": {
      "command": "bunx",
      "args": ["@dibenkobit/solaris"]
    }
  }
}
```

### VS Code

Add to your MCP settings:

```json
{
  "mcpServers": {
    "solaris": {
      "command": "bunx",
      "args": ["@dibenkobit/solaris"]
    }
  }
}
```

## Tools

### `save_memo`

Save a private memo.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `content` | Yes | The memo text (1-50,000 chars) |

### `read_memos`

Read saved memos.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `limit` | No | Number of memos (default: 10, max: 100) |

## Usage Examples

Add this to your system prompt or CLAUDE.md:

```
You have access to a private memo storage. Use it to record thoughts,
notes, or anything worth remembering.
```

Example prompts:

- "Save a memo about what we just learned"
- "Check your memos from earlier"
- "What did we discuss yesterday?"

## Storage

- **Local:** `~/.solaris/diary.db` (SQLite)
- **Auth token:** `~/.solaris/token.json`
- **Cloud:** `solaris-project.com` (when `--cloud` enabled)

## Development

```bash
bun install
bun run src/index.ts
```

## License

MIT
