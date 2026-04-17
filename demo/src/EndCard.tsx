import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.8 },
  });

  const taglineOpacity = interpolate(frame, [15, 30], [0, 1], {
    ...CLAMP,
  });

  const taglineY = interpolate(frame, [15, 30], [10, 0], {
    ...CLAMP,
  });

  const subtitleOpacity = interpolate(frame, [30, 45], [0, 1], {
    ...CLAMP,
  });

  const subtitleY = interpolate(frame, [30, 45], [8, 0], {
    ...CLAMP,
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#fafafa",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          transform: `scale(${logoScale})`,
        }}
      >
        <svg width="72" height="72" viewBox="0 0 48 48">
          <rect width="48" height="48" rx="11" fill="#4285F4"/>
          <g stroke="#fff" strokeWidth="4.5" strokeLinecap="round" fill="none" transform="translate(11, 8)">
            <line x1="11" y1="2" x2="7" y2="32"/>
            <line x1="21" y1="2" x2="17" y2="32"/>
            <line x1="4" y1="11" x2="25" y2="11"/>
            <line x1="3" y1="23" x2="24" y2="23"/>
          </g>
        </svg>
        <span
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#1a1a1a",
            letterSpacing: -2,
          }}
        >
          md.page
        </span>
      </div>

      <div
        style={{
          fontSize: 32,
          color: "#6b7280",
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          marginTop: 24,
        }}
      >
        Markdown in, beautiful page out.
      </div>

      <div
        style={{
          fontSize: 24,
          fontWeight: 500,
          color: "#9ca3af",
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          marginTop: 16,
        }}
      >
        Free &amp; Open Source
      </div>
    </div>
  );
};
