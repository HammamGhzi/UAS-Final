export interface Sanggar {
  id: string;
  nama: string;
  alamat: string;
  wilayah: string;
  noHp: string;
  foto: string;
  deskripsi: string;
  latitude: number;
  longitude: number;
  rating: number;
  jumlahReview: number;
}

export interface Produk {
  id: string;
  nama: string;
  harga: number;
  kategori: string;
  motif: string;
  jenisKain: string;
  teknik: string;
  foto: string[];
  sanggarId: string;
  sanggar?: Sanggar;
  rating: number;
  jumlahReview: number;
}

export interface Review {
  id: string;
  produkId?: string;
  sanggarId?: string;
  nama: string;
  kualitas: number;
  popularitas: number;
  desain: number;
  komentar: string;
  tanggal: string;
}

export interface Wilayah {
  id: string;
  nama: string;
}

export interface Kategori {
  id: string;
  nama: string;
}

export interface Motif {
  id: string;
  nama: string;
}

export interface RekomendasiResult {
  rank: number;
  score: number;
  product: string;
  sanggar: string;
  jarak: number;
  harga: number;
}