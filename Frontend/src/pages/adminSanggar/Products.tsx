import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit3, Lock, PackagePlus, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "../../components/UI/Button";
import {
  fieldLabels,
  getMissingSanggarFields,
  getStoredSanggarDraft,
  isSanggarComplete,
} from "./sanggarDraft";

const sampleProducts = [
  {
    id: 1,
    productName: "Batik Tegalan Pesisir",
    category: "Flora",
    price: 185000,
    stock: 12,
    status: "Aktif",
  },
  {
    id: 2,
    productName: "Batik Curug Klawi",
    category: "Geometris",
    price: 210000,
    stock: 8,
    status: "Draft",
  },
];

const AdminSanggarProducts = () => {
  const [query, setQuery] = useState("");
  const sanggarDraft = useMemo(() => getStoredSanggarDraft(), []);
  const complete = isSanggarComplete(sanggarDraft);
  const missingFields = getMissingSanggarFields(sanggarDraft);

  const filteredProducts = sampleProducts.filter((product) =>
    product.productName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-3">
        <InfoCard title="Total Produk" value={complete ? "2" : "0"} />
        <InfoCard title="Stok Tersedia" value={complete ? "20" : "0"} />
        <InfoCard title="Produk Draft" value={complete ? "1" : "0"} />
      </section>

      {!complete && (
        <section className="rounded-[28px] border border-[#dedede] bg-white px-8 py-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fff4df] text-[#ff9800]">
                <Lock size={27} />
              </div>
              <div>
                <h1 className="text-[26px] font-extrabold text-[#2f2f2f]">
                  Produk belum bisa dikelola
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#747474]">
                  Lengkapi data wajib sanggar terlebih dahulu supaya toko dianggap aktif.
                  Data yang belum lengkap:{" "}
                  <span className="font-bold text-[#333333]">
                    {missingFields.map((field) => fieldLabels[field]).join(", ")}
                  </span>
                  .
                </p>
              </div>
            </div>
            <Link
              to="/admin-sanggar/settings"
              className="inline-flex items-center justify-center rounded-full bg-[#252525] px-6 py-3 text-sm font-bold text-white transition hover:bg-black"
            >
              Lengkapi Data
            </Link>
          </div>
        </section>
      )}

      <section className="rounded-[28px] border border-[#dedede] bg-white px-8 py-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[28px] font-extrabold text-[#2f2f2f]">Kelola Produk</h1>
            <p className="mt-1 text-sm text-[#777777]">
              Struktur produk mengikuti model `Product`: sanggar, kategori, nama, harga, stok, deskripsi, gambar.
            </p>
          </div>
          <Button
            type="button"
            disabled={!complete}
            className="rounded-full bg-[#ff9800] px-6 text-white hover:bg-[#e48600] disabled:cursor-not-allowed disabled:bg-[#d8d8d8]"
          >
            <Plus size={18} />
            Tambah Produk
          </Button>
        </div>

        <div className="mt-7 flex h-[58px] items-center gap-3 rounded-[22px] border border-[#c9c9c9] bg-[#f7f8fd] px-5">
          <Search size={22} className="text-[#8a8a8a]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari produk batik..."
            disabled={!complete}
            className="h-full flex-1 bg-transparent text-[17px] outline-none placeholder:text-[#8a8a8a] disabled:cursor-not-allowed"
          />
        </div>

        <div className="mt-7 grid gap-4">
          {(complete ? filteredProducts : []).map((product) => (
            <article
              key={product.id}
              className="grid gap-4 rounded-[24px] border border-[#e2e2e2] bg-white p-5 md:grid-cols-[64px_1fr_auto]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff4df] text-[#ff9800]">
                <PackagePlus size={28} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#333333]">{product.productName}</h2>
                <p className="mt-1 text-sm text-[#777777]">
                  {product.category} - Rp {product.price.toLocaleString("id-ID")} - Stok {product.stock}
                </p>
                <span className="mt-3 inline-flex rounded-full bg-[#f0f0f0] px-3 py-1 text-xs font-bold text-[#555555]">
                  {product.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f5] text-[#666666] transition hover:bg-[#fff4df] hover:text-[#ff9800]"
                  aria-label="Edit produk"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f5] text-[#666666] transition hover:bg-red-50 hover:text-red-500"
                  aria-label="Hapus produk"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}

          {complete && filteredProducts.length === 0 && (
            <div className="rounded-[24px] border border-dashed border-[#d7d7d7] py-12 text-center text-[#777777]">
              Produk tidak ditemukan.
            </div>
          )}

          {!complete && (
            <div className="rounded-[24px] border border-dashed border-[#d7d7d7] py-12 text-center text-[#777777]">
              Area CRUD produk akan aktif setelah data toko lengkap.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const InfoCard = ({ title, value }: { title: string; value: string }) => (
  <div className="h-[146px] rounded-[24px] border border-[#d0d0d0] bg-white px-7 py-6">
    <p className="text-sm font-bold text-[#777777]">{title}</p>
    <p className="mt-5 text-[34px] font-extrabold text-[#262626]">{value}</p>
  </div>
);

export default AdminSanggarProducts;
