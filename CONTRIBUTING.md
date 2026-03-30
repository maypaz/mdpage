# Contributing to md.page

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/maypaz/md.page.git
cd md.page
npm install
npm run dev
```

This starts a local dev server at `http://localhost:8787`.

## Making Changes

1. Fork the repo
2. Create a branch: `git checkout -b my-feature`
3. Make your changes
4. Update the relevant spec in `docs/spec/` if behavior or architecture changes
5. Check `AGENTS.md` for the code map and contributor guidance
4. Test locally with `npm run dev`
5. Commit with a clear message
6. Push and open a Pull Request

## Guidelines

- Keep changes focused — one feature or fix per PR
- Follow the existing code style
- Test your changes locally before submitting

## Reporting Bugs

Open an [issue](https://github.com/maypaz/md.page/issues) with:
- What you expected to happen
- What actually happened
- Steps to reproduce

## Feature Requests

Open an [issue](https://github.com/maypaz/md.page/issues) and describe the use case. We'd love to hear how you're using md.page.
