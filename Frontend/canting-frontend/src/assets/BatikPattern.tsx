interface BatikPatternProps {
  className?: string;
  variant?: "hero" | "center";
}

export const BatikPattern = ({
  className,
  variant = "hero",
}: BatikPatternProps) => {
  if (variant === "center") {
    return (
      <div
        className={className}
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <img
          src="/batik-pattern-4.png"
          alt=""
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(900px, 90%)",
            opacity: 0.10,
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {/* pattern-5 di kiri atas */}
      <img
        src="/batik-pattern-5.png"
        alt=""
        style={{
          position: "absolute",
          top: "-1.5rem",
          left: "1rem",
          width: "44%",
          maxWidth: "520px",
          opacity: 0.42,
          pointerEvents: "none",
        }}
      />
      {/* pattern-3 di kanan */}
      <img
        src="/batik-pattern-3.png"
        alt=""
        style={{
          position: "absolute",
          top: "39%",
          right: "-1.5rem",
          width: "34%",
          maxWidth: "430px",
          opacity: 0.24,
          pointerEvents: "none",
        }}
      />
      <img
        src="/batik-pattern-4.png"
        alt=""
        style={{
          position: "absolute",
          top: "30%",
          left: "-2rem",
          width: "28%",
          maxWidth: "360px",
          opacity: 0.16,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
