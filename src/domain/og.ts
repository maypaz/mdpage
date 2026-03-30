import { escapeHtml } from "./html";
import { stripMarkdownInline } from "./markdown";

export type OgBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; lines: string[] }
  | { type: "list"; items: string[] };

export function wrapText(text: string, maxCharsPerLine: number, maxLines = 3): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const truncatedWord = word.length > maxCharsPerLine
      ? `${word.slice(0, maxCharsPerLine - 3)}...`
      : word;

    if (currentLine && `${currentLine} ${truncatedWord}`.length > maxCharsPerLine) {
      lines.push(currentLine);
      currentLine = truncatedWord;
    } else {
      currentLine = currentLine ? `${currentLine} ${truncatedWord}` : truncatedWord;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.slice(0, maxLines);
}

export function parseMarkdownBlocks(markdown: string): OgBlock[] {
  const blocks: OgBlock[] = [];
  const lines = markdown.split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.match(/^#\s+/)) {
      index += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{2,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({ type: "heading", text: stripMarkdownInline(headingMatch[2]) });
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      index += 1;
      const codeLines: string[] = [];
      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) {
        index += 1;
      }
      blocks.push({ type: "code", lines: codeLines.slice(0, 4) });
      continue;
    }

    if (line.match(/^\s*[-*+]\s/)) {
      const items: string[] = [];
      while (index < lines.length && lines[index].match(/^\s*[-*+]\s/)) {
        items.push(stripMarkdownInline(lines[index].replace(/^\s*[-*+]\s/, "")));
        index += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].match(/^#{1,6}\s/) &&
      !lines[index].startsWith("```") &&
      !lines[index].match(/^\s*[-*+]\s/)
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    if (paragraphLines.length > 0) {
      blocks.push({ type: "paragraph", text: stripMarkdownInline(paragraphLines.join(" ")) });
    }
  }

  return blocks;
}

export function generateOgSvg(title: string, markdownOrText: string): string {
  const cardX = 60;
  const cardY = 40;
  const cardW = 1080;
  const cardH = 540;
  const padding = 48;
  const contentX = cardX + padding;
  const contentW = cardW - padding * 2;
  const maxY = cardY + cardH - 80;

  const titleFontSize = 32;
  const titleLineHeight = Math.round(titleFontSize * 1.3);
  const titleLines = wrapText(title, Math.floor(contentW / (titleFontSize * 0.55)), 2);

  let y = cardY + padding + titleFontSize;
  let svg = `<text x="${contentX}" y="${y}" font-family="Inter" font-size="${titleFontSize}" font-weight="700" fill="#1a1a1a">`
    + titleLines.map((line, index) => `<tspan x="${contentX}" dy="${index === 0 ? 0 : titleLineHeight}">${escapeHtml(line)}</tspan>`).join("")
    + "</text>";
  y += (titleLines.length - 1) * titleLineHeight + 14;

  const looksLikeMarkdown = markdownOrText.includes("\n") || /^#{1,6}\s/m.test(markdownOrText);
  const blocks = looksLikeMarkdown
    ? parseMarkdownBlocks(markdownOrText)
    : [{ type: "paragraph" as const, text: markdownOrText }];

  for (const block of blocks) {
    if (y >= maxY) {
      break;
    }

    switch (block.type) {
      case "heading": {
        y += 10;
        const fontSize = 22;
        const lineHeight = Math.round(fontSize * 1.3);
        if (y + fontSize > maxY) {
          break;
        }
        const lines = wrapText(block.text, Math.floor(contentW / (fontSize * 0.55)), 2);
        y += fontSize;
        svg += `<text x="${contentX}" y="${y}" font-family="Inter" font-size="${fontSize}" font-weight="700" fill="#1a1a1a">`
          + lines.map((line, index) => `<tspan x="${contentX}" dy="${index === 0 ? 0 : lineHeight}">${escapeHtml(line)}</tspan>`).join("")
          + "</text>";
        y += (lines.length - 1) * lineHeight + 6;
        break;
      }
      case "paragraph": {
        y += 2;
        const fontSize = 17;
        const lineHeight = Math.round(fontSize * 1.5);
        if (y + fontSize > maxY) {
          break;
        }
        const maxLines = Math.max(1, Math.floor((maxY - y) / lineHeight));
        const lines = wrapText(block.text, Math.floor(contentW / (fontSize * 0.5)), maxLines);
        y += fontSize;
        svg += `<text x="${contentX}" y="${y}" font-family="Inter" font-size="${fontSize}" font-weight="400" fill="#4b5563">`
          + lines.map((line, index) => `<tspan x="${contentX}" dy="${index === 0 ? 0 : lineHeight}">${escapeHtml(line)}</tspan>`).join("")
          + "</text>";
        y += (lines.length - 1) * lineHeight + 4;
        break;
      }
      case "code": {
        y += 4;
        const codeLineHeight = 18;
        const codePadding = 12;
        const maxVisibleLines = Math.floor((maxY - y - codePadding * 2) / codeLineHeight);
        const visibleLines = block.lines.slice(0, Math.min(block.lines.length, maxVisibleLines));
        if (visibleLines.length === 0) {
          break;
        }
        const codeHeight = visibleLines.length * codeLineHeight + codePadding * 2;
        if (y + codeHeight > maxY + 40) {
          break;
        }
        svg += `<rect x="${contentX}" y="${y}" width="${contentW}" height="${codeHeight}" rx="8" fill="#1e1e1e"/>`;
        visibleLines.forEach((line, index) => {
          const truncatedLine = line.length > 70 ? `${line.slice(0, 67)}...` : line;
          svg += `<text x="${contentX + 14}" y="${y + codePadding + 13 + index * codeLineHeight}" font-family="monospace" font-size="14" fill="#d4d4d4">${escapeHtml(truncatedLine)}</text>`;
        });
        y += codeHeight + 6;
        break;
      }
      case "list": {
        y += 2;
        const fontSize = 17;
        const lineHeight = Math.round(fontSize * 1.4);
        for (const item of block.items) {
          if (y + fontSize > maxY) {
            break;
          }
          y += fontSize;
          const truncatedItem = item.length > 75 ? `${item.slice(0, 72)}...` : item;
          svg += `<text x="${contentX + 12}" y="${y}" font-family="Inter" font-size="${fontSize}" font-weight="400" fill="#4b5563">• ${escapeHtml(truncatedItem)}</text>`;
          y += lineHeight - fontSize + 2;
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
