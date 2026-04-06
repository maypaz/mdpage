import { escapeHtml, stripMarkdownInline } from "./utils";
import { ICON_SVG_INNER } from "./assets";

const FONT_URL_BOLD = "https://cdn.jsdelivr.net/fontsource/fonts/inter@5.2.8/latin-700-normal.ttf";
const FONT_URL_REGULAR = "https://cdn.jsdelivr.net/fontsource/fonts/inter@5.2.8/latin-400-normal.ttf";

let fontPromise: Promise<{ bold: ArrayBuffer; regular: ArrayBuffer }> | null = null;

function getFonts(): Promise<{ bold: ArrayBuffer; regular: ArrayBuffer }> {
  if (!fontPromise) {
    fontPromise = Promise.all([
      fetch(FONT_URL_BOLD).then(r => r.arrayBuffer()),
      fetch(FONT_URL_REGULAR).then(r => r.arrayBuffer()),
    ]).then(([bold, regular]) => ({ bold, regular }))
      .catch(err => { fontPromise = null; throw err; });
  }
  return fontPromise;
}

export function wrapText(text: string, maxCharsPerLine: number, maxLines = 3): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    const truncatedWord = word.length > maxCharsPerLine
      ? word.slice(0, maxCharsPerLine - 3) + "..."
      : word;
    if (currentLine && (currentLine + " " + truncatedWord).length > maxCharsPerLine) {
      lines.push(currentLine);
      currentLine = truncatedWord;
    } else {
      currentLine = currentLine ? currentLine + " " + truncatedWord : truncatedWord;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.slice(0, maxLines);
}

type OgBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; lines: string[] }
  | { type: "list"; items: string[] };

export function parseMarkdownBlocks(markdown: string): OgBlock[] {
  const blocks: OgBlock[] = [];
  const lines = markdown.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.match(/^#\s+/)) { i++; continue; }
    const hMatch = line.match(/^(#{2,6})\s+(.+)$/);
    if (hMatch) {
      blocks.push({ type: "heading", text: stripMarkdownInline(hMatch[2]) });
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].startsWith("```")) { codeLines.push(lines[i]); i++; }
      if (i < lines.length) i++;
      blocks.push({ type: "code", lines: codeLines.slice(0, 4) });
      continue;
    }
    if (line.match(/^\s*[-*+]\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*[-*+]\s/)) {
        items.push(stripMarkdownInline(lines[i].replace(/^\s*[-*+]\s/, "")));
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() && !lines[i].match(/^#{1,6}\s/) && !lines[i].startsWith("```") && !lines[i].match(/^\s*[-*+]\s/)) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length) blocks.push({ type: "paragraph", text: stripMarkdownInline(paraLines.join(" ")) });
  }
  return blocks;
}

export function generateOgSvg(title: string, markdownOrText: string): string {
  const cardX = 60, cardY = 40, cardW = 1080, cardH = 540;
  const pad = 48;
  const cx = cardX + pad;
  const cw = cardW - pad * 2;
  const maxY = cardY + cardH - 80;

  const titleFs = 32;
  const titleLh = Math.round(titleFs * 1.3);
  const titleLines = wrapText(title, Math.floor(cw / (titleFs * 0.55)), 2);
  let y = cardY + pad + titleFs;
  let svg = `<text x="${cx}" y="${y}" font-family="Inter" font-size="${titleFs}" font-weight="700" fill="#1a1a1a">` +
    titleLines.map((l, i) => `<tspan x="${cx}" dy="${i === 0 ? 0 : titleLh}">${escapeHtml(l)}</tspan>`).join("") +
    `</text>`;
  y += (titleLines.length - 1) * titleLh + 14;

  const isMarkdown = markdownOrText.includes("\n") || markdownOrText.match(/^#{1,6}\s/m);
  const blocks = isMarkdown ? parseMarkdownBlocks(markdownOrText) : [{ type: "paragraph" as const, text: markdownOrText }];

  for (const block of blocks) {
    if (y >= maxY) break;
    switch (block.type) {
      case "heading": {
        y += 10;
        const fs = 22, lh = Math.round(fs * 1.3);
        if (y + fs > maxY) break;
        const lines = wrapText(block.text, Math.floor(cw / (fs * 0.55)), 2);
        y += fs;
        svg += `<text x="${cx}" y="${y}" font-family="Inter" font-size="${fs}" font-weight="700" fill="#1a1a1a">` +
          lines.map((l, i) => `<tspan x="${cx}" dy="${i === 0 ? 0 : lh}">${escapeHtml(l)}</tspan>`).join("") +
          `</text>`;
        y += (lines.length - 1) * lh + 6;
        break;
      }
      case "paragraph": {
        y += 2;
        const fs = 17, lh = Math.round(fs * 1.5);
        if (y + fs > maxY) break;
        const maxLines = Math.max(1, Math.floor((maxY - y) / lh));
        const lines = wrapText(block.text, Math.floor(cw / (fs * 0.50)), maxLines);
        y += fs;
        svg += `<text x="${cx}" y="${y}" font-family="Inter" font-size="${fs}" font-weight="400" fill="#4b5563">` +
          lines.map((l, i) => `<tspan x="${cx}" dy="${i === 0 ? 0 : lh}">${escapeHtml(l)}</tspan>`).join("") +
          `</text>`;
        y += (lines.length - 1) * lh + 4;
        break;
      }
      case "code": {
        y += 4;
        const codeLh = 18, codePad = 12;
        const visibleLines = block.lines.slice(0, Math.min(block.lines.length, Math.floor((maxY - y - codePad * 2) / codeLh)));
        if (visibleLines.length === 0) break;
        const codeH = visibleLines.length * codeLh + codePad * 2;
        if (y + codeH > maxY + 40) break;
        svg += `<rect x="${cx}" y="${y}" width="${cw}" height="${codeH}" rx="8" fill="#1e1e1e"/>`;
        visibleLines.forEach((line, i) => {
          const truncated = line.length > 70 ? line.slice(0, 67) + "..." : line;
          svg += `<text x="${cx + 14}" y="${y + codePad + 13 + i * codeLh}" font-family="monospace" font-size="14" fill="#d4d4d4">${escapeHtml(truncated)}</text>`;
        });
        y += codeH + 6;
        break;
      }
      case "list": {
        y += 2;
        const fs = 17, lh = Math.round(fs * 1.4);
        for (const item of block.items) {
          if (y + fs > maxY) break;
          y += fs;
          const truncated = item.length > 75 ? item.slice(0, 72) + "..." : item;
          svg += `<text x="${cx + 12}" y="${y}" font-family="Inter" font-size="${fs}" font-weight="400" fill="#4b5563">\u2022 ${escapeHtml(truncated)}</text>`;
          y += lh - fs + 2;
        }
        break;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <clipPath id="card"><rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="12"/></clipPath>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#fff"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#f5f5f0"/>
  <g clip-path="url(#card)">
    <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" fill="#fff"/>
    ${svg}
    <rect x="${cardX}" y="${cardY + cardH - 80}" width="${cardW}" height="80" fill="url(#fade)"/>
  </g>
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="12" fill="none" stroke="#e5e7eb" stroke-width="1"/>
  <text x="600" y="${cardY + cardH + 32}" font-family="Inter" font-size="20" font-weight="700" text-anchor="middle"><tspan fill="#1a3a7a">#</tspan><tspan fill="#9ca3af"> md.page</tspan></text>
</svg>`;
}

export async function renderOgPng(title: string, description: string): Promise<Uint8Array> {
  const svg = generateOgSvg(title, description);
  return renderSvgToPng(svg);
}

function generateLandingOgSvg(): string {
  const iconSize = 56;
  const totalLogoWidth = iconSize + 16 + 280;
  const iconX = (1200 - totalLogoWidth) / 2;
  const iconY = 245;
  const scale = iconSize / 48;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f5f5f0"/>
  <g transform="translate(${iconX}, ${iconY}) scale(${scale})">${ICON_SVG_INNER}</g>
  <text x="${iconX + iconSize + 16}" y="${iconY + 44}" font-family="Inter" font-size="56" font-weight="700" fill="#1a1a1a">md.page</text>
  <text x="600" y="370" font-family="Inter" font-size="24" font-weight="400" fill="#6b7280" text-anchor="middle">Markdown in, beautiful page out.</text>
</svg>`;
}

let landingPngPromise: Promise<Uint8Array> | null = null;

export function renderLandingOgPng(): Promise<Uint8Array> {
  if (!landingPngPromise) {
    landingPngPromise = renderSvgToPng(generateLandingOgSvg())
      .catch(err => { landingPngPromise = null; throw err; });
  }
  return landingPngPromise;
}

async function renderSvgToPng(svg: string): Promise<Uint8Array> {
  const [fonts, { Resvg }] = await Promise.all([
    getFonts(),
    import("@cf-wasm/resvg/workerd"),
  ]);
  const resvg = await Resvg.async(svg, {
    fitTo: { mode: "width" as const, value: 1200 },
    font: {
      fontBuffers: [new Uint8Array(fonts.bold), new Uint8Array(fonts.regular)],
      loadSystemFonts: false,
      defaultFontFamily: "Inter",
    },
  });
  const rendered = resvg.render();
  return rendered.asPng();
}
