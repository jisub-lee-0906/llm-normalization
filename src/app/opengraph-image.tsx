import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          color: "#111111",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          border: "2px solid #e5e5e5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              maxWidth: "760px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 22,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#737373",
              }}
            >
              AI Text Cleanup
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 68,
                lineHeight: 1.05,
                fontWeight: 700,
                letterSpacing: "-0.04em",
              }}
            >
              Paste AI output.
              <br />
              Get clean plain text.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.45,
                color: "#525252",
              }}
            >
              Remove citations, markdown residue, trailing links, and awkward line breaks from
              ChatGPT, Gemini, Perplexity, and Claude.
            </div>
          </div>
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: 36,
              background: "#111111",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "40px 34px",
              gap: "18px",
            }}
          >
            <div style={{ height: 14, borderRadius: 99, background: "#fafafa" }} />
            <div style={{ height: 14, width: "72%", borderRadius: 99, background: "#fafafa" }} />
            <div style={{ height: 14, width: "48%", borderRadius: 99, background: "#fafafa" }} />
            <div
              style={{
                display: "flex",
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#fafafa",
                alignSelf: "flex-end",
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#525252",
          }}
        >
          <div>AI 답변 정리기</div>
          <div>Browser-only. No server storage.</div>
        </div>
      </div>
    ),
    size,
  );
}
