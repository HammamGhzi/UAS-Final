import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit3, Lock, PackagePlus, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "../../components/UI/Button";
import { useMySanggar } from "./useMySanggar";
import {
  getCategoryName,
  productToFormValues,
  type ProductFormValues,
  type ProductRecord,
} from "@/pages/adminSanggar/productStore";
import { useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct } from "./useProducts";
import ProductFormModal from "@/pages/adminSanggar/productFormModal";

const AdminSanggarProducts = () => {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null);

  const { data: sanggar } = useMySanggar();
  const complete = Boolean(sanggar);

  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(query.toLowerCase())
  );

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);

  const openCreateModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product: ProductRecord) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (values: ProductFormValues) => {
    if (editingProduct) {
      updateProduct.mutate(
        { id: editingProduct.id, values },
        { onSuccess: closeModal }
      );
    } else {
      createProduct.mutate(values, { onSuccess: closeModal });
    }
  };

  const handleDelete = (product: ProductRecord) => {
    const confirmed = window.confirm(
      `Hapus produk "${product.productName}"? Tindakan ini tidak bisa dibatalkan.`
    );
    if (confirmed) {
      deleteProduct.mutate(product.id);
    }
  };

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-3">
        <InfoCard title="Total Produk" value={complete ? String(products.length) : "0"} />
        <InfoCard title="Stok Tersedia" value={complete ? String(totalStock) : "0"} />
        <InfoCard
          title="Kategori Terpakai"
          value={
            complete ? String(new Set(products.map((product) => product.categoryId)).size) : "0"
          }
        />
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
                  Lengkapi data wajib sanggar terlebih dahulu di halaman Utama supaya toko dianggap aktif.
                </p>
              </div>
            </div>
            <Link
              to="/admin-sanggar"
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
              Struktur produk mengikuti model `Product`: kategori, nama, harga, stok, deskripsi, gambar.
            </p>
          </div>
          <Button
            type="button"
            disabled={!complete}
            onClick={openCreateModal}
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
          {complete && isLoading && (
            <div className="rounded-[24px] border border-dashed border-[#d7d7d7] py-12 text-center text-[#777777]">
              Memuat produk...
            </div>
          )}

          {complete &&
            !isLoading &&
            filteredProducts.map((product) => (
              <article
                key={product.id}
                className="grid gap-4 rounded-[24px] border border-[#e2e2e2] bg-white p-5 md:grid-cols-[64px_1fr_auto]"
              >
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-[#fff4df] text-[#ff9800]">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <PackagePlus size={28} />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#333333]">
                    {product.productName}
                  </h2>
                  <p className="mt-1 text-sm text-[#777777]">
                    {getCategoryName(product.categoryId)} - Rp{" "}
                    {product.price.toLocaleString("id-ID")} - Stok {product.stock}
                  </p>
                  {product.description && (
                    <p className="mt-2 line-clamp-1 text-sm text-[#999999]">
                      {product.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(product)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f5] text-[#666666] transition hover:bg-[#fff4df] hover:text-[#ff9800]"
                    aria-label="Edit produk"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f5] text-[#666666] transition hover:bg-red-50 hover:text-red-500"
                    aria-label="Hapus produk"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            ))}

          {complete && !isLoading && filteredProducts.length === 0 && (
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

      <ProductFormModal
        open={modalOpen}
        mode={editingProduct ? "edit" : "create"}
        initialValues={editingProduct ? productToFormValues(editingProduct) : undefined}
        isSubmitting={isSubmitting}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
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