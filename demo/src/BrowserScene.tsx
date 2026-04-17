import { Img, staticFile, useCurrentFrame, interpolate } from "remotion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

interface BrowserSceneProps {
  screenshotFile?: string;
  url?: string;
}

export const BrowserScene: React.FC<BrowserSceneProps> = ({
  screenshotFile = "browser.png",
  url = "md.page/a8Xk2m",
}) => {
  const frame = useCurrentFrame();

  // URL typing animation
  const charsToShow = Math.min(
    url.length,
    Math.floor(
      interpolate(frame, [0, 20], [0, url.length], CLAMP),
    ),
  );
  const displayUrl = url.slice(0, charsToShow);

  // Cursor blink
  const cursorVisible = charsToShow < url.length || Math.floor(frame / 8) % 2 === 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: "#e8e8e8",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
        </div>
        <div
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: 6,
            padding: "5px 12px",
            fontSize: 13,
            color: "#333",
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span>{displayUrl}</span>
          {cursorVisible && charsToShow <= url.length && (
            <span
              style={{
                display: "inline-block",
                width: 1,
                height: 14,
                background: "#333",
                marginLeft: 1,
              }}
            />
          )}
        </div>
      </div>
      {/* Page content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Img
          src={staticFile(screenshotFile)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
          }}
        />
      </div>
    </div>
  );
};
