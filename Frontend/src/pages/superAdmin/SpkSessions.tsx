import { useState, useMemo } from "react";
import { Search, Eye, X, ChevronDown, ChevronUp } from "lucide-react";
import { useSpkSessions, useSpkSessionDetail } from "./useSpkSessions";
import type {
  SpkSessionItem,
  TopsisBaseRow,
  TopsisNormRow,
  TopsisJarakRow,
  TopsisHasilRow,
} from "./useSpkSessions";

// ─── Helper ──────────────────────────────────────────────────────────────────

const fmt = (n: number, d = 4) => n.toFixed(d);
const fmtPrice = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const fmtDate = (s: string) =>
  new Date(s).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const WEIGHT_LABELS: Record<string, string> = {
  priceWeight: "Harga",
  distanceWeight: "Jarak",
  qualityWeight: "Kualitas",
  popularityWeight: "Popularitas",
  designWeight: "Desain",
};

function weightBadges(session: SpkSessionItem) {
  const keys = ["priceWeight", "distanceWeight", "qualityWeight", "popularityWeight", "designWeight"] as const;
  return keys.map((k) => ({ label: WEIGHT_LABELS[k], value: session[k] }));
}

const PAGE_SIZE = 10;

// ─── Collapsible Step Section ─────────────────────────────────────────────────

function StepSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl border border-[#e4e4e4] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between bg-[#f9f9f9] px-5 py-3 text-left"
      >
        <span className="text-sm font-extrabold text-[#2f2f2f]">{title}</span>
        {open ? <ChevronUp size={16} className="text-[#888]" /> : <ChevronDown size={16} className="text-[#888]" />}
      </button>
      {open && <div className="overflow-x-auto p-4">{children}</div>}
    </div>
  );
}

// ─── Shared Table Wrapper ─────────────────────────────────────────────────────

function TopsisTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  if (!rows.length) return <p className="text-xs text-[#999]">Tidak ada data.</p>;
  return (
    <table className="min-w-full text-xs">
      <thead>
        <tr className="border-b border-[#ececec]">
          {headers.map((h) => (
            <th key={h} className="whitespace-nowrap px-3 py-2 text-left font-bold text-[#555]">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
            {row.map((cell, j) => (
              <td key={j} className="whitespace-nowrap px-3 py-2 text-[#444]">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}


// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ sessionId, onClose }: { sessionId: string; onClose: () => void }) {
  const { data, isPending, isError } = useSpkSessionDetail(sessionId);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#eee] px-7 py-5">
          <div>
            <h2 className="text-lg font-extrabold text-[#2f2f2f]">Detail Sesi SPK TOPSIS</h2>
            <p className="mt-0.5 text-xs text-[#888] break-all">{sessionId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#888] hover:bg-[#f2f2f2]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-7 py-6">
          {isPending && <p className="text-sm text-[#777]">Memuat perhitungan TOPSIS...</p>}
          {isError && <p className="text-sm text-red-500">Gagal memuat detail sesi.</p>}

          {data && (
            <>
              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#e4e4e4] bg-[#fafafa] p-5 sm:grid-cols-3 lg:grid-cols-4">
                <MetaItem label="Waktu" value={fmtDate(data.meta.createdAt)} />
                <MetaItem label="User" value={data.meta.userEmail ?? "Tamu"} />
                <MetaItem label="Koordinat" value={`${Number(data.meta.userLat).toFixed(6)}, ${Number(data.meta.userLon).toFixed(6)}`} />
                <MetaItem label="Wilayah" value={data.meta.regionName ?? "Semua"} />
                <MetaItem label="Kategori" value={data.meta.categoryName ?? "Semua"} />
                <MetaItem label="Min Harga" value={fmtPrice(data.meta.minPrice)} />
                <MetaItem label="Max Harga" value={data.meta.maxPrice >= 999999999 ? "Tak Terbatas" : fmtPrice(data.meta.maxPrice)} />
                <MetaItem label="Total Produk" value={String(data.steps.topsisBase.length)} />
              </div>

              {/* Bobot */}
              <div className="rounded-2xl border border-[#e4e4e4] p-5">
                <p className="mb-3 text-sm font-extrabold text-[#2f2f2f]">Bobot Kriteria (W)</p>
                <div className="flex flex-wrap gap-3">
                  {(["priceWeight","distanceWeight","qualityWeight","popularityWeight","designWeight"] as const).map((k) => (
                    <div key={k} className={`rounded-xl px-4 py-2 text-xs font-bold ${data.meta[k] >= 5 ? "bg-[#fff4df] text-[#e08800]" : "bg-[#f2f2f2] text-[#666]"}`}>
                      {WEIGHT_LABELS[k]}: {data.meta[k]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1 — Base */}
              <StepSection title="Step 1 — Data Mentah (v_topsis_base)">
                <TopsisTable
                  headers={["#", "Produk", "C1 Harga (Rp)", "C2 Jarak (km)", "C3 Kualitas", "C4 Popularitas", "C5 Desain"]}
                  rows={(data.steps.topsisBase as TopsisBaseRow[]).map((r, i) => [
                    i + 1,
                    r.productName,
                    fmtPrice(r.c1_harga),
                    fmt(r.c2_jarak, 4),
                    fmt(r.c3_kualitas, 4),
                    fmt(r.c4_popularitas, 4),
                    fmt(r.c5_desain, 4),
                  ])}
                />
              </StepSection>

              {/* Step 2 — Pembagi */}
              <StepSection title="Step 2 — Pembagi √(Σx²) (v_topsis_pembagi)">
                {data.steps.topsisPembagi ? (
                  <TopsisTable
                    headers={["√(ΣC1²) Harga", "√(ΣC2²) Jarak", "√(ΣC3²) Kualitas", "√(ΣC4²) Popularitas", "√(ΣC5²) Desain"]}
                    rows={[[
                      fmt(data.steps.topsisPembagi.p_c1),
                      fmt(data.steps.topsisPembagi.p_c2),
                      fmt(data.steps.topsisPembagi.p_c3),
                      fmt(data.steps.topsisPembagi.p_c4),
                      fmt(data.steps.topsisPembagi.p_c5),
                    ]]}
                  />
                ) : <p className="text-xs text-[#999]">Tidak ada data pembagi.</p>}
              </StepSection>

              {/* Step 3 — Normalisasi Terbobot */}
              <StepSection title="Step 3 — Normalisasi × Bobot (v_topsis_norm_terbobot)">
                <TopsisTable
                  headers={["#", "Produk", "n_C1 Harga", "n_C2 Jarak", "n_C3 Kualitas", "n_C4 Popularitas", "n_C5 Desain"]}
                  rows={(data.steps.topsisNormTerbobot as TopsisNormRow[]).map((r, i) => {
                    const base = data.steps.topsisBase.find((b) => b.productId === r.productId);
                    return [i + 1, base?.productName ?? r.productId, fmt(r.n_c1), fmt(r.n_c2), fmt(r.n_c3), fmt(r.n_c4), fmt(r.n_c5)];
                  })}
                />
              </StepSection>

              {/* Step 4 — Ideal */}
              <StepSection title="Step 4 — Solusi Ideal A+ dan A- (v_topsis_ideal)">
                {data.steps.topsisIdeal ? (
                  <TopsisTable
                    headers={["", "C1 Harga", "C2 Jarak", "C3 Kualitas", "C4 Popularitas", "C5 Desain"]}
                    rows={[
                      ["A+ (Ideal Positif)", fmt(data.steps.topsisIdeal.a_plus_c1), fmt(data.steps.topsisIdeal.a_plus_c2), fmt(data.steps.topsisIdeal.a_plus_c3), fmt(data.steps.topsisIdeal.a_plus_c4), fmt(data.steps.topsisIdeal.a_plus_c5)],
                      ["A- (Ideal Negatif)", fmt(data.steps.topsisIdeal.a_min_c1), fmt(data.steps.topsisIdeal.a_min_c2), fmt(data.steps.topsisIdeal.a_min_c3), fmt(data.steps.topsisIdeal.a_min_c4), fmt(data.steps.topsisIdeal.a_min_c5)],
                    ]}
                  />
                ) : <p className="text-xs text-[#999]">Tidak ada data ideal.</p>}
              </StepSection>

              {/* Step 5 — Jarak */}
              <StepSection title="Step 5 — Jarak ke Ideal D+ dan D- (v_topsis_jarak)">
                <TopsisTable
                  headers={["#", "Produk", "D+ (ke Ideal+)", "D- (ke Ideal-)"]}
                  rows={(data.steps.topsisJarak as TopsisJarakRow[]).map((r, i) => {
                    const base = data.steps.topsisBase.find((b) => b.productId === r.productId);
                    return [i + 1, base?.productName ?? r.productId, fmt(r.d_plus), fmt(r.d_min)];
                  })}
                />
              </StepSection>

              {/* Step 6 — Hasil */}
              <StepSection title="Step 6 — Skor Preferensi & Ranking Final (v_topsis_hasil)">
                <TopsisTable
                  headers={["Rank", "Produk", "Sanggar", "Harga", "D-", "D+", "Skor (Ci)"]}
                  rows={(data.steps.topsisHasil as TopsisHasilRow[]).map((r) => {
                    const jarak = data.steps.topsisJarak.find((j) => j.productId === r.productId);
                    return [
                      r.ranking,
                      r.productName,
                      r.sanggarName,
                      fmtPrice(r.price),
                      jarak ? fmt(jarak.d_min) : "-",
                      jarak ? fmt(jarak.d_plus) : "-",
                      fmt(r.nilai_preferensi),
                    ];
                  })}
                />
              </StepSection>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-[#aaa]">{label}</p>
      <p className="mt-0.5 text-xs font-semibold text-[#333]">{value}</p>
    </div>
  );
}


// ─── Main Page ────────────────────────────────────────────────────────────────

const SuperAdminSpkSessionsPage = () => {
  const { data: sessions = [], isPending, isError } = useSpkSessions();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"terbaru" | "terlama">("terbaru");
  const [page, setPage] = useState(1);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const result = q
      ? sessions.filter(
          (s) =>
            s.sessionId.toLowerCase().includes(q) ||
            (s.userEmail ?? "").toLowerCase().includes(q) ||
            (s.regionName ?? "").toLowerCase().includes(q) ||
            (s.categoryName ?? "").toLowerCase().includes(q)
        )
      : [...sessions];

    result.sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sort === "terbaru" ? -diff : diff;
    });

    return result;
  }, [sessions, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isPending) return <p className="text-sm text-[#777]">Memuat data sesi SPK...</p>;
  if (isError) return <p className="text-sm text-red-500">Gagal mengambil data sesi SPK.</p>;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-[28px] font-extrabold text-[#2f2f2f]">SPK Sessions</h1>
        <p className="mt-1 text-sm text-[#777]">
          Riwayat sesi pencarian SPK TOPSIS dari seluruh pengguna. Klik Detail untuk melihat
          perhitungan lengkap setiap step.
        </p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-[48px] w-full max-w-md items-center gap-3 rounded-2xl border border-[#c9c9c9] bg-white px-4">
          <Search size={18} className="shrink-0 text-[#8a8a8a]" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Cari session ID, email, wilayah, kategori..."
            className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-[#a3a3a3]"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value as "terbaru" | "terlama"); setPage(1); }}
          className="h-[48px] rounded-2xl border border-[#c9c9c9] bg-white px-4 text-sm font-semibold text-[#444] outline-none focus:border-[#ff9800]"
        >
          <option value="terbaru">Terbaru</option>
          <option value="terlama">Terlama</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#e2e2e2] bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-[#ececec] bg-[#fafafa]">
              <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold text-[#555]">Waktu</th>
              <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold text-[#555]">User</th>
              <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold text-[#555]">Wilayah</th>
              <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold text-[#555]">Kategori</th>
              <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold text-[#555]">Bobot Prioritas</th>
              <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold text-[#555]">Produk</th>
              <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold text-[#555]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((session, i) => {
              const highWeights = weightBadges(session).filter((w) => w.value >= 5);
              return (
                <tr key={session.sessionId} className={i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                  <td className="whitespace-nowrap px-5 py-3 text-xs text-[#555]">
                    {fmtDate(session.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-xs text-[#555]">
                    {session.userEmail ?? (
                      <span className="rounded-full bg-[#f2f2f2] px-2 py-0.5 text-[#999]">Tamu</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-[#555]">{session.regionName ?? "Semua"}</td>
                  <td className="px-5 py-3 text-xs text-[#555]">{session.categoryName ?? "Semua"}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {highWeights.length === 0 ? (
                        <span className="text-xs text-[#aaa]">Default</span>
                      ) : (
                        highWeights.map((w) => (
                          <span key={w.label} className="rounded-full bg-[#fff4df] px-2 py-0.5 text-[10px] font-bold text-[#e08800]">
                            {w.label}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs font-bold text-[#333]">{session.totalProducts}</td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedSessionId(session.sessionId)}
                      className="flex items-center gap-1.5 rounded-lg border border-[#e2e2e2] px-3 py-1.5 text-xs font-semibold text-[#555] transition hover:bg-[#f5f5f5]"
                    >
                      <Eye size={13} />
                      Detail
                    </button>
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center text-sm text-[#999]">
                  Tidak ada sesi ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-[#e2e2e2] px-3 py-1.5 text-xs font-semibold text-[#555] disabled:opacity-40 hover:bg-[#f5f5f5]"
          >
            ← Prev
          </button>
          <span className="text-xs text-[#777]">
            Halaman {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-[#e2e2e2] px-3 py-1.5 text-xs font-semibold text-[#555] disabled:opacity-40 hover:bg-[#f5f5f5]"
          >
            Next →
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedSessionId && (
        <DetailModal sessionId={selectedSessionId} onClose={() => setSelectedSessionId(null)} />
      )}
    </div>
  );
};

export default SuperAdminSpkSessionsPage;
