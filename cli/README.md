# mdpage-cli

Share Markdown as a beautiful web page in one command.

```bash
npx mdpage-cli README.md
```

```
  Published → https://md.page/a8Xk2m
  Expires in 24h
```

No accounts. No API keys. No setup. Pages auto-expire after 24 hours.

## Install

```bash
# Use directly with npx (no install needed)
npx mdpage-cli README.md

# Or install globally
npm install -g mdpage-cli
```

## Usage

```bash
# Publish a file
mdpage-cli README.md

# Publish and copy URL to clipboard
mdpage-cli notes.md --copy

# Publish and open in browser
mdpage-cli notes.md --open

# Pipe from stdin
cat CHANGELOG.md | mdpage-cli
echo "# Hello" | mdpage-cli
```

## Options

| Flag | Short | Description |
|------|-------|-------------|
| `--copy` | `-c` | Copy URL to clipboard |
| `--open` | `-o` | Open page in browser |
| `--help` | `-h` | Show help |
| `--version` | | Show version |

## What you get

- Clean, responsive HTML page with beautiful typography
- Short URL: `md.page/a8Xk2m`
- Dark mode support
- Code blocks, tables, images, and all standard Markdown
- OpenGraph meta tags for link previews
- Auto-expires after 24 hours

## API

The CLI uses the [md.page](https://md.page) API under the hood:

```bash
curl -X POST https://md.page/api/publish \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Hello World"}'
```

## License

MIT
