import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { success, error } from '../utils/response';

// Kriteria yang valid dipilih user di dropdown SPK
const CRITERIA_KEYS = ['harga', 'jarak', 'kualitas', 'popularitas', 'desain'] as const;
type CriteriaKey = (typeof CRITERIA_KEYS)[number];

// Map key kriteria -> nama kolom bobot di tabel weight_histories
const CRITERIA_TO_COLUMN: Record<CriteriaKey, string> = {
  harga: 'priceWeight',
  jarak: 'distanceWeight',
  kualitas: 'qualityWeight',
  popularitas: 'popularityWeight',
  desain: 'designWeight',
};

const BOBOT_DIPILIH = 5;
const BOBOT_TIDAK_DIPILIH = 1;

// Buat baris bobot baru berdasarkan kriteria yang dipilih user di 2 dropdown SPK
// (dropdown "Urutkan Berdasarkan" di halaman Katalog).
// Kriteria yang dipilih dapat bobot 5, kriteria yang tidak dipilih dapat bobot 1.
// Body: { kriteriaUtama: 'jarak', kriteriaKedua?: 'harga' | null }
export const createWeightHistory = async (req: Request, res: Response) => {
  try {
    const { kriteriaUtama, kriteriaKedua } = req.body as {
      kriteriaUtama?: string;
      kriteriaKedua?: string | null;
    };

    if (!kriteriaUtama || !CRITERIA_KEYS.includes(kriteriaUtama as CriteriaKey)) {
      return error(res, 'kriteriaUtama wajib diisi dan harus salah satu dari: ' + CRITERIA_KEYS.join(', '), 400);
    }

    if (kriteriaKedua && !CRITERIA_KEYS.includes(kriteriaKedua as CriteriaKey)) {
      return error(res, 'kriteriaKedua tidak valid', 400);
    }

    if (kriteriaKedua && kriteriaKedua === kriteriaUtama) {
      return error(res, 'kriteriaKedua tidak boleh sama dengan kriteriaUtama', 400);
    }

    // Bangun bobot: default 1 untuk semua, lalu set 5 untuk yang dipilih
    const bobot: Record<string, number> = {
      priceWeight: BOBOT_TIDAK_DIPILIH,
      distanceWeight: BOBOT_TIDAK_DIPILIH,
      qualityWeight: BOBOT_TIDAK_DIPILIH,
      popularityWeight: BOBOT_TIDAK_DIPILIH,
      designWeight: BOBOT_TIDAK_DIPILIH,
    };

    bobot[CRITERIA_TO_COLUMN[kriteriaUtama as CriteriaKey]] = BOBOT_DIPILIH;
    if (kriteriaKedua) {
      bobot[CRITERIA_TO_COLUMN[kriteriaKedua as CriteriaKey]] = BOBOT_DIPILIH;
    }

    const weightHistory = await prisma.weightHistory.create({
      data: {
        priceWeight: bobot.priceWeight,
        distanceWeight: bobot.distanceWeight,
        qualityWeight: bobot.qualityWeight,
        popularityWeight: bobot.popularityWeight,
        designWeight: bobot.designWeight,
      },
    });

    return success(res, weightHistory, 'Bobot berhasil dibuat', 201);
  } catch (err) {
    return error(res, (err as Error).message || 'Gagal membuat bobot SPK');
  }
};

export default { createWeightHistory };