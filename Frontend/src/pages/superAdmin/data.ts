// src/pages/superAdmin/data.ts
// ============================================================================
// DUMMY DATA — Super Admin
// ----------------------------------------------------------------------------
// Semua data di file ini masih statis (frontend only). Nanti kalau backend-nya
// sudah siap, tinggal ganti pemanggilan array-array ini dengan fetch/react-query
// ke endpoint yang sesuai (mis. GET /super-admin/sanggar, /super-admin/produk,
// dst). Struktur field-nya sudah disesuaikan supaya gampang di-mapping ke
// response API nanti.
// ============================================================================

export type AdminRole = "Manager" | "Designer" | "Developer";
export type ReviewTarget = "Produk" | "Sanggar";

export interface SuperAdminSanggar {
  id: string;
  nama: string;
  foto: string;
  wilayah: string;
  alamat: string;
  rating: number;
  jumlahReview: number;
  totalProduk: number;
}

export interface SuperAdminProduk {
  id: string;
  nama: string;
  foto: string;
  kategori: string;
  harga: number;
  stok: number;
  sanggarId: string;
  sanggarNama: string;
}

export interface SuperAdminAdmin {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  role: AdminRole;
  sanggarNama: string;
  avatar: string;
  online: boolean;
}

export interface SuperAdminCustomer {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  avatar: string;
  online: boolean;
  totalTransaksi: number;
}

export interface SuperAdminReview {
  id: string;
  nama: string;
  avatar: string;
  jenis: ReviewTarget;
  target: string;
  rating: number;
  komentar: string;
  tanggal: string;
}

export const WILAYAH_LIST = [
  "Tegal Timur",
  "Tegal Barat",
  "Tegal Selatan",
  "Margadana",
  "Adiwerna",
  "Slawi",
  "Dukuhturi",
  "Talang",
];

export const KATEGORI_LIST = ["Flora", "Fauna", "Geometris", "Abstrak"];

const IMG_SANGGAR = [
  "https://images.unsplash.com/photo-1621252179027-9942ab577336?w=400&q=80",
  "https://images.unsplash.com/photo-1590736969596-c1b62b6f1b6d?w=400&q=80",
  "https://images.unsplash.com/photo-1614251055880-ee96e4803393?w=400&q=80",
];

const IMG_PRODUK = [
  "https://images.unsplash.com/photo-1610030181087-540c6ba00fca?w=200&q=80",
  "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=200&q=80",
  "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&q=80",
];

const avatar = (seed: string) => `https://i.pravatar.cc/80?u=${seed}`;

export const sanggarList: SuperAdminSanggar[] = [
  { id: "sg-01", nama: "Sanggar Batik Harimau", foto: IMG_SANGGAR[0], wilayah: "Tegal Timur", alamat: "Jl. Sultan Agung No. 12", rating: 4.6, jumlahReview: 131, totalProduk: 18 },
  { id: "sg-02", nama: "Sanggar Batik Mangrove", foto: IMG_SANGGAR[1], wilayah: "Tegal Barat", alamat: "Jl. Pantai Alam Indah", rating: 4.2, jumlahReview: 87, totalProduk: 12 },
  { id: "sg-03", nama: "Sanggar Batik Kalimosodo", foto: IMG_SANGGAR[2], wilayah: "Slawi", alamat: "Jl. Prof. Moh. Yamin No. 4", rating: 4.8, jumlahReview: 204, totalProduk: 25 },
  { id: "sg-04", nama: "Sanggar Batik Lestari", foto: IMG_SANGGAR[0], wilayah: "Adiwerna", alamat: "Jl. Raya Adiwerna No. 9", rating: 4.1, jumlahReview: 54, totalProduk: 9 },
  { id: "sg-05", nama: "Sanggar Batik Kencana", foto: IMG_SANGGAR[1], wilayah: "Dukuhturi", alamat: "Jl. Kepandean No. 3", rating: 4.4, jumlahReview: 96, totalProduk: 14 },
  { id: "sg-06", nama: "Sanggar Batik Cahaya Tegal", foto: IMG_SANGGAR[2], wilayah: "Talang", alamat: "Jl. Talang Raya No. 21", rating: 3.9, jumlahReview: 41, totalProduk: 7 },
  { id: "sg-07", nama: "Sanggar Batik Sekar Arum", foto: IMG_SANGGAR[0], wilayah: "Tegal Selatan", alamat: "Jl. Werkudoro No. 5", rating: 4.7, jumlahReview: 158, totalProduk: 20 },
  { id: "sg-08", nama: "Sanggar Batik Margasari", foto: IMG_SANGGAR[1], wilayah: "Margadana", alamat: "Jl. Perintis Kemerdekaan", rating: 4.0, jumlahReview: 63, totalProduk: 11 },
];

export const produkList: SuperAdminProduk[] = [
  { id: "pr-01", nama: "Batik Tulis Harimau", foto: IMG_PRODUK[0], kategori: "Fauna", harga: 120000, stok: 7, sanggarId: "sg-01", sanggarNama: "Sanggar Batik Harimau" },
  { id: "pr-02", nama: "Batik Cap Sido Mukti", foto: IMG_PRODUK[1], kategori: "Geometris", harga: 95000, stok: 15, sanggarId: "sg-01", sanggarNama: "Sanggar Batik Harimau" },
  { id: "pr-03", nama: "Batik Tulis Mangrove Biru", foto: IMG_PRODUK[2], kategori: "Flora", harga: 175000, stok: 5, sanggarId: "sg-02", sanggarNama: "Sanggar Batik Mangrove" },
  { id: "pr-04", nama: "Batik Kombinasi Kalimosodo", foto: IMG_PRODUK[0], kategori: "Abstrak", harga: 210000, stok: 3, sanggarId: "sg-03", sanggarNama: "Sanggar Batik Kalimosodo" },
  { id: "pr-05", nama: "Batik Tulis Sekar Jagad", foto: IMG_PRODUK[1], kategori: "Flora", harga: 165000, stok: 9, sanggarId: "sg-03", sanggarNama: "Sanggar Batik Kalimosodo" },
  { id: "pr-06", nama: "Batik Cap Lereng Ombak", foto: IMG_PRODUK[2], kategori: "Geometris", harga: 88000, stok: 20, sanggarId: "sg-04", sanggarNama: "Sanggar Batik Lestari" },
  { id: "pr-07", nama: "Batik Tulis Merak Ngibing", foto: IMG_PRODUK[0], kategori: "Fauna", harga: 240000, stok: 2, sanggarId: "sg-05", sanggarNama: "Sanggar Batik Kencana" },
  { id: "pr-08", nama: "Batik Cap Kawung Modern", foto: IMG_PRODUK[1], kategori: "Geometris", harga: 99000, stok: 18, sanggarId: "sg-06", sanggarNama: "Sanggar Batik Cahaya Tegal" },
  { id: "pr-09", nama: "Batik Tulis Sekar Arum", foto: IMG_PRODUK[2], kategori: "Flora", harga: 189000, stok: 6, sanggarId: "sg-07", sanggarNama: "Sanggar Batik Sekar Arum" },
  { id: "pr-10", nama: "Batik Tulis Garuda Emas", foto: IMG_PRODUK[0], kategori: "Fauna", harga: 320000, stok: 1, sanggarId: "sg-07", sanggarNama: "Sanggar Batik Sekar Arum" },
  { id: "pr-11", nama: "Batik Cap Ombak Segara", foto: IMG_PRODUK[1], kategori: "Abstrak", harga: 110000, stok: 11, sanggarId: "sg-08", sanggarNama: "Sanggar Batik Margasari" },
  { id: "pr-12", nama: "Batik Tulis Melati Senja", foto: IMG_PRODUK[2], kategori: "Flora", harga: 152000, stok: 4, sanggarId: "sg-02", sanggarNama: "Sanggar Batik Mangrove" },
];

export const adminList: SuperAdminAdmin[] = [
  { id: "ad-01", nama: "Reza Arab", email: "bradley.m@gmail.com", telepon: "242-576-7666", role: "Manager", sanggarNama: "Sanggar Batik Harimau", avatar: avatar("reza"), online: true },
  { id: "ad-02", nama: "Diba Ramadhani", email: "stroman.hanna@yahoo.com", telepon: "467-624-8505", role: "Designer", sanggarNama: "Sanggar Batik Mangrove", avatar: avatar("diba"), online: true },
  { id: "ad-03", nama: "Marvin Lambert", email: "micaela.okuneva@zemlak.biz", telepon: "716-937-5782", role: "Developer", sanggarNama: "Sanggar Batik Kalimosodo", avatar: avatar("marvin"), online: false },
  { id: "ad-04", nama: "Teresa Lloyd", email: "carlee_erdman@gmail.com", telepon: "496-144-8261", role: "Designer", sanggarNama: "Sanggar Batik Lestari", avatar: avatar("teresa"), online: true },
  { id: "ad-05", nama: "Fred Haynes", email: "jarod.miller@hotmail.com", telepon: "305-305-1123", role: "Manager", sanggarNama: "Sanggar Batik Kencana", avatar: avatar("fred"), online: true },
  { id: "ad-06", nama: "Rose Peters", email: "oma.russel@hotmail.com", telepon: "828-963-3958", role: "Designer", sanggarNama: "Sanggar Batik Cahaya Tegal", avatar: avatar("rose"), online: false },
  { id: "ad-07", nama: "Handoko Wibowo", email: "handoko.w@gmail.com", telepon: "812-345-6790", role: "Developer", sanggarNama: "Sanggar Batik Sekar Arum", avatar: avatar("handoko"), online: true },
  { id: "ad-08", nama: "Sinta Ayu", email: "sinta.ayu@gmail.com", telepon: "813-221-9087", role: "Manager", sanggarNama: "Sanggar Batik Margasari", avatar: avatar("sinta"), online: true },
];

export const customerList: SuperAdminCustomer[] = [
  { id: "cs-01", nama: "Isaac Newton", email: "ernest.mason@gmail.com", telepon: "822-3245-7584", avatar: avatar("isaac"), online: true, totalTransaksi: 4 },
  { id: "cs-02", nama: "Amelia Putri", email: "amelia.putri@gmail.com", telepon: "813-772-4410", avatar: avatar("amelia"), online: false, totalTransaksi: 2 },
  { id: "cs-03", nama: "Budi Santoso", email: "budi.santoso@yahoo.com", telepon: "812-990-1123", avatar: avatar("budi"), online: true, totalTransaksi: 7 },
  { id: "cs-04", nama: "Clara Wijaya", email: "clara.wijaya@gmail.com", telepon: "857-102-8834", avatar: avatar("clara"), online: true, totalTransaksi: 1 },
  { id: "cs-05", nama: "Dimas Prakoso", email: "dimas.prakoso@hotmail.com", telepon: "878-556-2290", avatar: avatar("dimas"), online: false, totalTransaksi: 3 },
  { id: "cs-06", nama: "Erika Salsabila", email: "erika.salsabila@gmail.com", telepon: "852-334-1187", avatar: avatar("erika"), online: true, totalTransaksi: 5 },
  { id: "cs-07", nama: "Fajar Nugroho", email: "fajar.nugroho@gmail.com", telepon: "813-667-0021", avatar: avatar("fajar"), online: true, totalTransaksi: 2 },
];

export const reviewList: SuperAdminReview[] = [
  { id: "rv-01", nama: "Isaac Newton", avatar: avatar("isaac"), jenis: "Produk", target: "Batik Tulis Harimau", rating: 5, komentar: "Kualitas kainnya halus dan warnanya awet, puas banget belanja di sini.", tanggal: "2026-06-28" },
  { id: "rv-02", nama: "Amelia Putri", avatar: avatar("amelia"), jenis: "Sanggar", target: "Sanggar Batik Mangrove", rating: 4, komentar: "Pelayanan ramah, pengiriman agak lama tapi worth it.", tanggal: "2026-06-25" },
  { id: "rv-03", nama: "Budi Santoso", avatar: avatar("budi"), jenis: "Produk", target: "Batik Cap Sido Mukti", rating: 3, komentar: "Motifnya bagus, tapi ukurannya sedikit lebih kecil dari ekspektasi.", tanggal: "2026-06-22" },
  { id: "rv-04", nama: "Clara Wijaya", avatar: avatar("clara"), jenis: "Sanggar", target: "Sanggar Batik Kalimosodo", rating: 5, komentar: "Tempatnya nyaman, banyak pilihan motif eksklusif.", tanggal: "2026-06-20" },
  { id: "rv-05", nama: "Dimas Prakoso", avatar: avatar("dimas"), jenis: "Produk", target: "Batik Tulis Merak Ngibing", rating: 2, komentar: "Warna agak pudar setelah dicuci sekali.", tanggal: "2026-06-18" },
  { id: "rv-06", nama: "Erika Salsabila", avatar: avatar("erika"), jenis: "Produk", target: "Batik Tulis Sekar Arum", rating: 5, komentar: "Cantik banget, bahannya adem dipakai sehari-hari.", tanggal: "2026-06-15" },
  { id: "rv-07", nama: "Fajar Nugroho", avatar: avatar("fajar"), jenis: "Sanggar", target: "Sanggar Batik Margasari", rating: 4, komentar: "Owner-nya informatif, kasih rekomendasi motif sesuai acara.", tanggal: "2026-06-10" },
  { id: "rv-08", nama: "Isaac Newton", avatar: avatar("isaac"), jenis: "Sanggar", target: "Sanggar Batik Harimau", rating: 5, komentar: "Langganan dari dulu, konsisten kualitasnya.", tanggal: "2026-06-05" },
];