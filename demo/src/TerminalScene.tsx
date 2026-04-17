import { useCurrentFrame, interpolate, Easing } from "remotion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE_OUT = Easing.out(Easing.ease);

// Claude Code color palette
const CORAL = "#d97757";
const CORAL_DARK = "#c05a3a";
const BG = "#1a1a1e";
const TEXT = "#e8e6df";
const DIM = "#6b6b65";
const MONO = "'SF Mono', 'Fira Code', 'JetBrains Mono', monospace";

// Pixel mascot — 8 columns × 7 rows
// 0 = transparent, 1 = coral, 2 = dark coral, 3 = bg (eyes)
const MASCOT: number[][] = [
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 2, 1, 1, 2, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 3, 3, 1, 1, 3, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 3, 3, 0, 0, 3, 3, 0],
];
const MASCOT_COLORS: Record<number, string> = { 1: CORAL, 2: CORAL_DARK, 3: BG };

const PixelMascot: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 0, margin: "10px auto 8px" }}>
    {MASCOT.map((row, y) => (
      <div key={y} style={{ display: "flex", gap: 0 }}>
        {row.map((cell, x) => (
          <div
            key={x}
            style={{
              width: 7,
              height: 7,
              background: MASCOT_COLORS[cell] || "transparent",
            }}
          />
        ))}
      </div>
    ))}
  </div>
);

interface Line {
  text: string;
  color?: string;
  dim?: boolean;
  bold?: boolean;
  prefix?: "tool";
}

const RESPONSE_LINES: Line[] = [
  { text: "Read src/index.ts", prefix: "tool", dim: true },
  { text: "Read src/utils.ts", prefix: "tool", dim: true },
  { text: 'Grep "rateKey" in src/', prefix: "tool", dim: true },
  { text: "" },
  { text: "# Root Cause Analysis: Rate Limiting Bug", color: TEXT, bold: true },
  { text: "" },
  { text: "The issue is in `src/index.ts:154`. The rate limit counter", color: "#bac2de" },
  { text: "**never resets properly** because the KV key uses the raw", color: "#bac2de" },
  { text: "IP without normalization.", color: "#bac2de" },
  { text: "" },
  { text: "## The Bug", color: TEXT, bold: true },
  { text: "" },
  { text: "```typescript", color: DIM },
  { text: 'const ip = request.headers.get("CF-Connecting-IP");', color: "#a6e3a1" },
  { text: "const rateKey = `rate:${ip}`;", color: "#a6e3a1" },
  { text: "```", color: DIM },
  { text: "" },
  { text: "## Impact", color: TEXT, bold: true },
  { text: "" },
  { text: "| Scenario       | Expected | Actual      |", color: "#bac2de" },
  { text: "|----------------|----------|-------------|", color: "#585b70" },
  { text: "| IPv4 clients   | 60/hr    | 60/hr ✅    |", color: "#bac2de" },
  { text: "| IPv6 clients   | 60/hr    | 5-15/hr ❌  |", color: "#bac2de" },
  { text: "| Behind proxy   | 60/hr    | Shared ⚠️    |", color: "#bac2de" },
  { text: "" },
  { text: "Affects **~34%** of users (those on IPv6 networks).", color: "#a6adc8" },
];

const LINE_DELAY = 2;

const PromptLine: React.FC<{
  text: string;
  chars?: number;
  color?: string;
  cursorVisible: boolean;
}> = ({ text, chars, color = TEXT, cursorVisible }) => {
  const displayText = chars !== undefined ? text.slice(0, chars) : text;
  const showCursor = chars !== undefined ? chars < text.length && cursorVisible : cursorVisible;
  return (
    <div style={{ display: "flex", gap: 8, fontSize: 13 }}>
      <span style={{ color: CORAL, fontWeight: 700 }}>❯</span>
      <span style={{ color }}>
        {displayText}
        {showCursor && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 15,
              background: color,
              marginLeft: 1,
              verticalAlign: "text-bottom",
            }}
          />
        )}
      </span>
    </div>
  );
};

interface TerminalSceneProps {
  // First prompt
  showFirstPrompt: boolean;
  firstPromptChars: number;
  firstPromptText: string;
  // Response
  showResponse: boolean;
  responseFrame: number;
  // Second prompt
  showSecondPrompt: boolean;
  secondPromptChars: number;
  secondPromptText: string;
  showPublishing: boolean;
  showUrl: boolean;
  urlGlow: number;
  // Layout
  scrollOffset: number;
  tokenCount: number;
}

export const TerminalScene: React.FC<TerminalSceneProps> = ({
  showFirstPrompt,
  firstPromptChars,
  firstPromptText,
  showResponse,
  responseFrame,
  showSecondPrompt,
  secondPromptChars,
  secondPromptText,
  showPublishing,
  showUrl,
  urlGlow,
  scrollOffset,
  tokenCount,
}) => {
  const frame = useCurrentFrame();
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: BG,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: MONO,
        fontSize: 12.5,
        lineHeight: 1.65,
      }}
    >
      {/* Scrollable content area */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative", minHeight: 0 }}>
        <div
          style={{
            padding: "16px 24px",
            transform: `translateY(-${scrollOffset}px)`,
          }}
        >
          {/* ── Welcome Box ── */}
          <div style={{ marginBottom: 16 }}>
              {/* Dashed border box with title in top border */}
              <div style={{ position: "relative", marginBottom: 12 }}>
                {/* Top border with embedded title */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0,
                    marginBottom: -1,
                  }}
                >
                  <div
                    style={{
                      flex: "0 0 12px",
                      borderTop: `1px dashed ${CORAL}`,
                      height: 0,
                    }}
                  />
                  <span
                    style={{
                      color: CORAL,
                      fontSize: 12,
                      padding: "0 8px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Claude Code v2.1.81
                  </span>
                  <div style={{ flex: 1, borderTop: `1px dashed ${CORAL}`, height: 0 }} />
                </div>

                {/* Box content */}
                <div
                  style={{
                    border: `1px dashed ${CORAL}`,
                    borderTop: "none",
                    borderRadius: "0 0 4px 4px",
                    display: "flex",
                    padding: "12px 16px",
                    gap: 0,
                  }}
                >
                  {/* Left column */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      borderRight: `1px dashed ${CORAL}40`,
                      paddingRight: 16,
                    }}
                  >
                    <div style={{ color: TEXT, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                      Welcome back!
                    </div>
                    <PixelMascot />
                    <div style={{ color: DIM, fontSize: 11, marginTop: 4, lineHeight: 1.5 }}>
                      claude-opus-4-6@default · API Usage Billing
                      <br />
                      ~/dev/agents-products/md.page
                    </div>
                  </div>

                  {/* Right column */}
                  <div style={{ flex: 1.2, paddingLeft: 16 }}>
                    <div style={{ color: CORAL, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      Tips for getting started
                    </div>
                    <div style={{ color: TEXT, fontSize: 11.5, lineHeight: 1.5, marginBottom: 10 }}>
                      Run /init to create a CLAUDE.md file with instructions for Claude
                    </div>
                    <div style={{ color: CORAL, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      Recent activity
                    </div>
                    <div style={{ color: DIM, fontSize: 11.5 }}>No recent activity</div>
                  </div>
                </div>
              </div>
          </div>

          {/* ── Prompt + Conversation ── */}

          {/* First user prompt or placeholder */}
          {showFirstPrompt ? (
            <div style={{ marginBottom: 12 }}>
              <PromptLine
                text={firstPromptText}
                chars={firstPromptChars}
                cursorVisible={cursorVisible}
              />
            </div>
          ) : (
            <PromptLine
              text={'Try "how do I log an error?"'}
              color={DIM}
              cursorVisible={cursorVisible}
            />
          )}

          {/* Agent response */}
          {showResponse &&
            RESPONSE_LINES.map((line, i) => {
              const appearFrame = responseFrame + i * LINE_DELAY;
              const opacity = interpolate(
                frame,
                [appearFrame, appearFrame + 3],
                [0, 1],
                { ...CLAMP, easing: EASE_OUT },
              );
              const ty = interpolate(
                frame,
                [appearFrame, appearFrame + 3],
                [3, 0],
                { ...CLAMP, easing: EASE_OUT },
              );

              if (line.text === "") {
                return <div key={i} style={{ height: 6, opacity }} />;
              }

              if (line.prefix === "tool") {
                return (
                  <div
                    key={i}
                    style={{
                      opacity,
                      transform: `translateY(${ty}px)`,
                      color: DIM,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 1,
                    }}
                  >
                    <span style={{ color: CORAL }}>⏺</span>
                    <span>{line.text}</span>
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  style={{
                    opacity,
                    transform: `translateY(${ty}px)`,
                    color: line.dim ? DIM : line.color || TEXT,
                    fontWeight: line.bold ? 600 : 400,
                    whiteSpace: "pre",
                  }}
                >
                  {line.text}
                </div>
              );
            })}

          {/* Second user prompt + response */}
          {showSecondPrompt && (
            <div style={{ marginTop: 16, borderTop: `1px solid #2a2a2e`, paddingTop: 12 }}>
              <PromptLine
                text={secondPromptText}
                chars={secondPromptChars}
                cursorVisible={cursorVisible}
              />

              {showPublishing && (
                <div
                  style={{
                    marginTop: 10,
                    color: DIM,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ color: CORAL }}>⏺</span>
                  <span>Publishing to md.page…</span>
                </div>
              )}

              {showUrl && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ color: "#bac2de", fontSize: 12.5, marginBottom: 4 }}>
                    Published! Here&apos;s your shareable link:
                  </div>
                  <div style={{ display: "inline-block", position: "relative" }} data-url-link>
                    <span
                      style={{
                        color: "#89dceb",
                        fontSize: 14,
                        fontWeight: 600,
                        textShadow: `0 0 ${urlGlow}px rgba(137, 220, 235, 0.6)`,
                        textDecoration: "underline",
                        textDecorationColor: "rgba(137, 220, 235, 0.4)",
                        textUnderlineOffset: 3,
                      }}
                    >
                      https://md.page/a8Xk2m
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Status Bar ── */}
      <div
        style={{
          padding: "5px 24px",
          borderTop: `1px dashed #2a2a2e`,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: DIM,
          flexShrink: 0,
        }}
      >
        <span>
          md.page | Tokens: {tokenCount.toLocaleString()}
        </span>
        <span>◎ medium · /effort</span>
      </div>
    </div>
  );
};
