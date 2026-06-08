import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo / icon area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100px",
            height: "100px",
            borderRadius: "24px",
            background: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.3)",
            fontSize: "56px",
            marginBottom: "32px",
          }}
        >
          🦷
        </div>

        {/* Site name */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "#ffffff",
            letterSpacing: "-2px",
            marginBottom: "16px",
          }}
        >
          Dentobook
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.85)",
            marginBottom: "40px",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Find Trusted Dental Clinics Across India
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "16px",
          }}
        >
          {["Mumbai", "Delhi", "Bengaluru", "Chennai"].map((city) => (
            <div
              key={city}
              style={{
                padding: "10px 24px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#ffffff",
                fontSize: "20px",
              }}
            >
              {city}
            </div>
          ))}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "20px",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          dentobook.in
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
