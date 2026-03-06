import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 16,
                    background: "linear-gradient(to bottom right, #00f0ff, #a855f7)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "20%",
                    color: "#050508", // dark-900 background color
                    fontWeight: 900,
                    fontFamily: "monospace",
                    letterSpacing: "-1px",
                }}
            >
                {"</>"}
            </div>
        ),
        {
            ...size,
        }
    );
}
