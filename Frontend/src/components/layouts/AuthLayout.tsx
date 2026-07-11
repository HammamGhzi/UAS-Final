import { useEffect, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

/** Foto batik HD untuk panel auth (2816×1536) */
export const AUTH_HERO_IMAGE = "/about.png";

interface AuthLayoutProps {
  headline: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  backTo?: string;
  backLabel?: string;
}

export const AuthLayout = ({
  headline,
  description,
  children,
  footer,
  backTo = "/",
  backLabel = "Kembali ke halaman utama",
}: AuthLayoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <div className="flex h-dvh max-h-dvh w-full overflow-hidden flex-col-reverse lg:flex-row">
      {/* Left panel — form area */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden bg-[#1a100a] px-5 py-4 sm:px-8 sm:py-6 lg:w-[44%] lg:flex-none lg:shrink-0 lg:border-r lg:border-white/10 lg:px-14 lg:py-8 xl:px-16">
        <button
          type="button"
          onClick={() => navigate(backTo)}
          className="mb-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-white/25 hover:bg-white/5 hover:text-white sm:mb-4 sm:h-10 sm:w-10 lg:absolute lg:left-8 lg:top-8 lg:mb-0"
          aria-label={backLabel}
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex min-h-0 flex-1 flex-col justify-center lg:pt-12">
          <div className="mb-3 shrink-0 sm:mb-6 lg:mb-8">
            <p className="text-xl font-bold tracking-wide text-white lg:text-2xl">
              CANTING
            </p>
          </div>

          <h1 className="shrink-0 text-[1.65rem] font-bold leading-tight text-white sm:text-[2rem] lg:text-[2.35rem]">
            {headline}
          </h1>
          <p className="mt-2 line-clamp-3 max-w-md shrink-0 text-xs leading-relaxed text-white/55 sm:mt-3 sm:text-sm lg:line-clamp-none">
            {description}
          </p>

          <div className="mt-4 shrink-0 sm:mt-6 lg:mt-10">{children}</div>

          {footer && <div className="mt-3 shrink-0 sm:mt-5">{footer}</div>}
        </div>

        <p className="mt-2 shrink-0 text-[10px] text-white/30 sm:text-xs lg:mt-auto">
          Copyright © 2025 Canting Batik Tegal. All rights reserved.
        </p>
      </div>

      {/* Right panel — batik image (desktop) */}
      <div className="relative hidden min-h-0 flex-1 overflow-hidden lg:block">
        <img
          src={AUTH_HERO_IMAGE}
          alt="Proses pembuatan batik Tegal"
          className="h-full w-full object-cover object-center"
          decoding="async"
          fetchPriority="high"
        />
      </div>

      {/* Mobile batik banner */}
      <div className="relative h-[20vh] min-h-[110px] max-h-[160px] w-full shrink-0 overflow-hidden lg:hidden">
        <img
          src={AUTH_HERO_IMAGE}
          alt="Proses pembuatan batik Tegal"
          className="h-full w-full object-cover object-center"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a100a] via-[#1a100a]/30 to-transparent" />
      </div>
    </div>
  );
};

export const authInputClass =
  "h-11 rounded-full border-0 bg-[#2d1f14] px-5 text-sm text-white shadow-none placeholder:text-white/35 focus:ring-2 focus:ring-[#9c8360]/60 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12";

export const authButtonClass =
  "mt-1 h-11 w-full rounded-xl bg-[#9c8360] py-0 text-sm font-semibold text-white shadow-none transition hover:bg-[#b09570] disabled:cursor-not-allowed disabled:opacity-70 sm:mt-2 sm:h-12";

export const authLinkClass =
  "font-semibold text-[#c4a882] transition hover:text-[#dbc4a0]";
