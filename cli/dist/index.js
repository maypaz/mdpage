#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const API_URL = "https://md.page/api/publish";
const VERSION = "0.1.0";
const HELP = `
  mdpage-cli - Share Markdown as a beautiful web page

  Usage:
    mdpage-cli <file>              Publish a Markdown file
    mdpage-cli <file> --copy       Publish and copy URL to clipboard
    mdpage-cli <file> --open       Publish and open in browser
    cat file.md | mdpage-cli       Publish from stdin

  Options:
    --copy, -c    Copy the URL to clipboard after publishing
    --open, -o    Open the page in your default browser
    --help, -h    Show this help message
    --version     Show version number

  Examples:
    mdpage-cli README.md
    mdpage-cli notes.md --copy
    cat CHANGELOG.md | mdpage-cli --open
    echo "# Hello" | mdpage-cli

  https://md.page
`.trimStart();
async function readStdin() {
    const chunks = [];
    for await (const chunk of process.stdin) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString("utf-8");
}
async function readFile(path) {
    const { readFile } = await import("node:fs/promises");
    const { resolve } = await import("node:path");
    return readFile(resolve(path), "utf-8");
}
async function copyToClipboard(text) {
    const { exec } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const execAsync = promisify(exec);
    const cmd = process.platform === "darwin"
        ? "pbcopy"
        : process.platform === "win32"
            ? "clip"
            : "xclip -selection clipboard";
    try {
        await execAsync(`echo ${JSON.stringify(text)} | ${cmd}`);
        return true;
    }
    catch {
        return false;
    }
}
async function openBrowser(url) {
    const { exec } = await import("node:child_process");
    const cmd = process.platform === "darwin"
        ? "open"
        : process.platform === "win32"
            ? "start"
            : "xdg-open";
    exec(`${cmd} ${JSON.stringify(url)}`);
}
async function publish(markdown) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown }),
    });
    if (!res.ok) {
        const text = await res.text();
        if (res.status === 413)
            throw new Error("Content too large (max 500KB)");
        if (res.status === 429)
            throw new Error("Rate limited. Try again later.");
        throw new Error(`Publish failed (${res.status}): ${text}`);
    }
    return (await res.json());
}
function formatExpiry(expiresAt) {
    const diff = new Date(expiresAt).getTime() - Date.now();
    const hours = Math.round(diff / (1000 * 60 * 60));
    return hours > 0 ? `${hours}h` : "< 1h";
}
async function main() {
    const args = process.argv.slice(2);
    if (args.includes("--help") || args.includes("-h")) {
        process.stdout.write(HELP);
        return;
    }
    if (args.includes("--version")) {
        console.log(VERSION);
        return;
    }
    const flags = new Set(args.filter((a) => a.startsWith("-")));
    const positional = args.filter((a) => !a.startsWith("-"));
    const shouldCopy = flags.has("--copy") || flags.has("-c");
    const shouldOpen = flags.has("--open") || flags.has("-o");
    // Read markdown from file or stdin
    let markdown;
    if (positional.length > 0) {
        const file = positional[0];
        try {
            markdown = await readFile(file);
        }
        catch (err) {
            if (err.code === "ENOENT") {
                console.error(`Error: File not found: ${file}`);
            }
            else {
                console.error(`Error: Could not read file: ${err.message}`);
            }
            process.exit(1);
        }
    }
    else if (!process.stdin.isTTY) {
        markdown = await readStdin();
    }
    else {
        process.stdout.write(HELP);
        return;
    }
    if (!markdown.trim()) {
        console.error("Error: Empty content");
        process.exit(1);
    }
    // Publish
    process.stderr.write("Publishing...");
    try {
        const result = await publish(markdown);
        // Clear the "Publishing..." text
        process.stderr.write("\r\x1b[K");
        console.log(`\n  Published → ${result.url}`);
        console.log(`  Expires in ${formatExpiry(result.expires_at)}\n`);
        if (shouldCopy) {
            const copied = await copyToClipboard(result.url);
            if (copied) {
                console.log("  Copied to clipboard!");
            }
            else {
                console.log(`  Could not copy — paste this: ${result.url}`);
            }
            console.log();
        }
        if (shouldOpen) {
            await openBrowser(result.url);
        }
        // Show tip on first few uses
        if (!shouldCopy && !shouldOpen) {
            console.log("  Tip: mdpage-cli README.md --copy  (copies URL to clipboard)\n");
        }
    }
    catch (err) {
        process.stderr.write("\r\x1b[K");
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}
main();
