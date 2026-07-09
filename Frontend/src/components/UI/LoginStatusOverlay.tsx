import { useEffect } from "react";

interface LoginStatusOverlayProps {
  show: boolean;
  variant?: "success" | "error";
  message?: string;
  subMessage?: string;
  onDone?: () => void;
  duration?: number;
  closeOnBackdropClick?: boolean;
}

export const LoginStatusOverlay = ({
  show,
  variant = "success",
  message,
  subMessage,
  onDone,
  duration = 1600,
  closeOnBackdropClick = true,
}: LoginStatusOverlayProps) => {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      onDone?.();
    }, duration);
    return () => clearTimeout(t);
  }, [show, duration, onDone]);

  if (!show) return null;

  const isSuccess = variant === "success";
  const defaultMessage = isSuccess ? "Login berhasil!" : "Login gagal";
  const iconBg = isSuccess ? "bg-[#eafccd]" : "bg-red-100";
  const iconStroke = isSuccess ? "#6aa300" : "#dc2626";
  const cardAnim = isSuccess ? "animate-login-pop" : "animate-login-pop animate-login-shake-once";

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#583822]/40 backdrop-blur-sm animate-login-fade-in px-4"
      onClick={() => {
        if (closeOnBackdropClick) onDone?.();
      }}
    >
      <img
        src="/batik-pattern-corner.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-16 w-72 opacity-10"
      />
      <img
        src="/batik-pattern-corner.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -bottom-16 w-72 rotate-180 opacity-10"
      />

      <div
        className={`relative flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl bg-[#fff7ef] px-12 py-14 shadow-[0_24px_80px_rgba(88,56,34,0.35)] ${cardAnim}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`relative flex h-32 w-32 items-center justify-center rounded-full ${iconBg}`}>
          {isSuccess ? (
            <svg viewBox="0 0 52 52" className="h-20 w-20" fill="none">
              <circle
                cx="26"
                cy="26"
                r="23"
                stroke={iconStroke}
                strokeWidth="3"
                className="login-check-circle"
              />
              <path
                d="M15 27.5L22.5 35L37.5 18"
                stroke={iconStroke}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="login-check-mark"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 52 52" className="h-20 w-20" fill="none">
              <circle
                cx="26"
                cy="26"
                r="23"
                stroke={iconStroke}
                strokeWidth="3"
                className="login-check-circle"
              />
              <path
                d="M18 18L34 34M34 18L18 34"
                stroke={iconStroke}
                strokeWidth="3.5"
                strokeLinecap="round"
                className="login-check-mark"
              />
            </svg>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-center font-serif text-2xl font-bold text-[#583822]">
            {message ?? defaultMessage}
          </p>
          {subMessage && (
            <p className="text-center text-sm text-[#8b7a6b]">{subMessage}</p>
          )}
        </div>
        {!isSuccess && (
          <button
            type="button"
            onClick={() => onDone?.()}
            className="rounded-full bg-[#f0ded0] px-8 py-2.5 text-sm font-semibold text-[#795b44] transition hover:bg-[#e6d0ba]"
          >
            Coba Lagi
          </button>
        )}
      </div>

      <style>{`
        @keyframes login-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes login-pop {
          0% { opacity: 0; transform: scale(0.85); }
          60% { opacity: 1; transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-login-fade-in {
          animation: login-fade-in 0.25s ease-out both;
        }
        .animate-login-pop {
          animation: login-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .login-check-circle {
          stroke-dasharray: 145;
          stroke-dashoffset: 145;
          animation: login-draw-circle 0.5s ease-out forwards;
        }
        .login-check-mark {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: login-draw-mark 0.35s ease-out 0.45s forwards;
        }
        @keyframes login-draw-circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes login-draw-mark {
          to { stroke-dashoffset: 0; }
        }
        @keyframes login-shake-once {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(7px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(3px); }
        }
        .animate-login-shake-once {
          animation: login-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both,
                     login-shake-once 0.5s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
};

interface ShakeWrapperProps {
  triggerKey: number;
  children: React.ReactNode;
  className?: string;
}

export const ShakeWrapper = ({ triggerKey, children, className = "" }: ShakeWrapperProps) => {
  return (
    <div key={triggerKey} className={`${triggerKey > 0 ? "animate-login-shake" : ""} ${className}`}>
      {children}
      <style>{`
        @keyframes login-shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .animate-login-shake {
          animation: login-shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};