import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { TerminalScene } from "./TerminalScene";
import { BrowserScene } from "./BrowserScene";
import { EndCard } from "./EndCard";
import { AnimatedCursor } from "./Cursor";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Timeline (frames at 30fps)
// Phase 1+2: Welcome screen → user types first query
const FIRST_PROMPT_START = 50; // prompt begins (overlaps welcome fade)
const FIRST_PROMPT_END = 88; // typing finishes

// Phase 3: Agent response (1s pause after typing finishes)
const RESPONSE_START = FIRST_PROMPT_END + 30; // ~1s gap
// 27 lines × 2 frame delay = 54 frames → response done ~frame 146

// Phase 4: Second prompt (~1s after response ends)
const SCROLL_START = 200;
const PROMPT_START = 205;
const PROMPT_END = 260; // URL appears

// Phase 5: Cursor + browser
const CURSOR_APPEAR = 265;
const CURSOR_CLICK = 278;
const CURSOR_DISAPPEAR = 288;
const TRANSITION_START = CURSOR_DISAPPEAR;
const BROWSER_START = 300;

// Phase 6: End card
const ENDCARD_START = 400;

const FIRST_PROMPT_TEXT =
  "what is the root cause of the rate limiting bug?";
const SECOND_PROMPT_TEXT = "create md.page I can share";

export const MdPageDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── First scroll: push welcome box up when response starts ──
  const firstScrollSpring = spring({
    frame: frame - RESPONSE_START,
    fps,
    config: { damping: 30, stiffness: 40, mass: 1 },
  });
  const firstScrollOffset = interpolate(firstScrollSpring, [0, 1], [0, 220]);

  // ── First prompt typing ──
  const showFirstPrompt = frame >= FIRST_PROMPT_START;
  const firstPromptChars = Math.min(
    FIRST_PROMPT_TEXT.length,
    Math.floor(
      interpolate(
        frame,
        [FIRST_PROMPT_START + 5, FIRST_PROMPT_END],
        [0, FIRST_PROMPT_TEXT.length],
        CLAMP,
      ),
    ),
  );

  // ── Response ──
  const showResponse = frame >= RESPONSE_START;

  // ── Second scroll: push response up for second prompt ──
  const secondScrollSpring = spring({
    frame: frame - SCROLL_START,
    fps,
    config: { damping: 30, stiffness: 40, mass: 1 },
  });
  const secondScrollOffset = interpolate(secondScrollSpring, [0, 1], [0, 380]);

  // Combined scroll
  const scrollOffset = firstScrollOffset + secondScrollOffset;

  // ── Second prompt typing ──
  const showSecondPrompt = frame >= PROMPT_START;
  const secondPromptChars = Math.min(
    SECOND_PROMPT_TEXT.length,
    Math.floor(
      interpolate(
        frame,
        [PROMPT_START, PROMPT_START + 30],
        [0, SECOND_PROMPT_TEXT.length],
        CLAMP,
      ),
    ),
  );

  // ── Publishing & URL ──
  const showPublishing = frame >= PROMPT_START + 35 && frame < PROMPT_END;
  const showUrl = frame >= PROMPT_END;
  const urlGlow = interpolate(
    frame,
    [PROMPT_END, PROMPT_END + 15, PROMPT_END + 30],
    [0, 10, 4],
    CLAMP,
  );

  // ── Token count (animates during response) ──
  const tokenCount = Math.floor(
    interpolate(frame, [RESPONSE_START, RESPONSE_START + 60], [0, 1247], CLAMP),
  );

  // ── Terminal → browser transition ──
  const terminalOpacity = interpolate(
    frame,
    [TRANSITION_START, TRANSITION_START + 12],
    [1, 0],
    CLAMP,
  );
  const terminalScale = interpolate(
    frame,
    [TRANSITION_START, TRANSITION_START + 12],
    [1, 0.97],
    CLAMP,
  );

  // ── Browser ──
  const browserProgress = spring({
    frame: frame - BROWSER_START,
    fps,
    config: { damping: 24, stiffness: 100, mass: 0.8 },
  });
  const browserScale = interpolate(browserProgress, [0, 1], [0.92, 1]);
  const browserOpacity = interpolate(browserProgress, [0, 1], [0, 1]);
  const browserFadeOut = interpolate(
    frame,
    [ENDCARD_START - 10, ENDCARD_START + 5],
    [1, 0],
    CLAMP,
  );

  // ── End card ──
  const endCardOpacity = interpolate(
    frame,
    [ENDCARD_START, ENDCARD_START + 15],
    [0, 1],
    CLAMP,
  );

  return (
    <AbsoluteFill style={{ background: "#1a1a1e" }}>
      {/* Terminal scene */}
      {frame < BROWSER_START + 15 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: terminalOpacity,
            transform: `scale(${terminalScale})`,
          }}
        >
          <TerminalScene
            showFirstPrompt={showFirstPrompt}
            firstPromptChars={firstPromptChars}
            firstPromptText={FIRST_PROMPT_TEXT}
            showResponse={showResponse}
            responseFrame={RESPONSE_START}
            showSecondPrompt={showSecondPrompt}
            secondPromptChars={secondPromptChars}
            secondPromptText={SECOND_PROMPT_TEXT}
            showPublishing={showPublishing}
            showUrl={showUrl}
            urlGlow={urlGlow}
            scrollOffset={scrollOffset}
            tokenCount={tokenCount}
          />

          <AnimatedCursor
            appearFrame={CURSOR_APPEAR}
            clickFrame={CURSOR_CLICK}
            disappearFrame={CURSOR_DISAPPEAR}
            startX={50}
            startY={30}
            targetX={15}
            targetY={24}
          />
        </AbsoluteFill>
      )}

      {/* Browser scene */}
      {frame >= BROWSER_START && frame < ENDCARD_START + 15 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: browserOpacity * browserFadeOut,
            transform: `scale(${browserScale})`,
          }}
        >
          <BrowserScene />
        </AbsoluteFill>
      )}

      {/* End card */}
      {frame >= ENDCARD_START && (
        <AbsoluteFill style={{ opacity: endCardOpacity }}>
          <EndCard />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
