import { useQuery } from '@tanstack/react-query';
import { spkSessionApi } from '../../services/api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SpkSessionItem {
  sessionId: string;
  userId: number | null;
  userEmail: string | null;
  userLat: number;
  userLon: number;
  minPrice: number;
  maxPrice: number;
  regionName: string | null;
  categoryName: string | null;
  priceWeight: number;
  distanceWeight: number;
  qualityWeight: number;
  popularityWeight: number;
  designWeight: number;
  totalProducts: number;
  createdAt: string;
}

export interface TopsisBaseRow {
  productId: number;
  productName: string;
  c1_harga: number;
  c2_jarak: number;
  c3_kualitas: number;
  c4_popularitas: number;
  c5_desain: number;
}

export interface TopsisPembagi {
  p_c1: number;
  p_c2: number;
  p_c3: number;
  p_c4: number;
  p_c5: number;
}

export interface TopsisNormRow {
  productId: number;
  n_c1: number;
  n_c2: number;
  n_c3: number;
  n_c4: number;
  n_c5: number;
}

export interface TopsisIdeal {
  a_plus_c1: number; a_min_c1: number;
  a_plus_c2: number; a_min_c2: number;
  a_plus_c3: number; a_min_c3: number;
  a_plus_c4: number; a_min_c4: number;
  a_plus_c5: number; a_min_c5: number;
}

export interface TopsisJarakRow {
  productId: number;
  d_plus: number;
  d_min: number;
}

export interface TopsisHasilRow {
  productId: number;
  productName: string;
  price: number;
  sanggarName: string;
  nilai_preferensi: number;
  ranking: number;
}

export interface SpkSessionDetail {
  meta: SpkSessionItem & { weightHistoryId: number };
  steps: {
    topsisBase: TopsisBaseRow[];
    topsisPembagi: TopsisPembagi | null;
    topsisNormTerbobot: TopsisNormRow[];
    topsisIdeal: TopsisIdeal | null;
    topsisJarak: TopsisJarakRow[];
    topsisHasil: TopsisHasilRow[];
  };
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Daftar semua sesi SPK — dipakai di tabel halaman SPK Sessions Super Admin */
export const useSpkSessions = () => {
  return useQuery<SpkSessionItem[]>({
    queryKey: ['spk-sessions'],
    queryFn: async () => {
      const res = await spkSessionApi.getAll();
      return res.data.data;
    },
  });
};

/** Detail satu sesi + full step TOPSIS — dipakai di modal detail */
export const useSpkSessionDetail = (sessionId: string | null) => {
  return useQuery<SpkSessionDetail>({
    queryKey: ['spk-session-detail', sessionId],
    queryFn: async () => {
      const res = await spkSessionApi.getDetail(sessionId!);
      return res.data.data;
    },
    enabled: !!sessionId,
  });
};
