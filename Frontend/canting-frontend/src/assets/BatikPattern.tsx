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
            width: "50%",
            opacity: 0.08,
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
          top: 0,
          left: 0,
          width: "35%",
          opacity: 0.8,
          pointerEvents: "none",
        }}
      />
      {/* pattern-3 di kanan */}
      <img
        src="/batik-pattern-3.png"
        alt=""
        style={{
          position: "absolute",
          top: "40%",
          right: 0,
          width: "35%",
          opacity: 0.1,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
