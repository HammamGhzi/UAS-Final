import prisma from '../config/prisma';

// Ambil hasil rekomendasi metode TOPSIS.
// Catatan: view v_topsis_hasil TIDAK punya kolom ranking siap pakai,
// jadi rankingnya dihitung di sini pakai window function RANK()
// berdasarkan nilai_preferensi (makin besar nilainya, makin bagus rankingnya).
export const getTopsisResults = async (sessionId: string) => {
  const rows = await prisma.$queryRawUnsafe(
    `SELECT
       sessionId,
       productId,
       productName,
       price,
       image,
       nilai_preferensi,
       RANK() OVER (PARTITION BY sessionId ORDER BY nilai_preferensi DESC) AS ranking
     FROM v_topsis_hasil
     WHERE sessionId = ?
     ORDER BY ranking`,
    sessionId,
  );

  return (rows as any[]).map((r) => ({
    ...r,
    productId: Number(r.productId),
    price: Number(r.price),
    nilai_preferensi: Number(r.nilai_preferensi),
    ranking: Number(r.ranking),
  }));
};

// Ambil hasil TOPSIS + info sanggar (nama sanggar & jarak km) untuk ditampilkan
// di halaman Katalog setelah SPK dijalankan. Join manual ke v_topsis_base
// (untuk jarak) dan products/sanggars (untuk nama sanggar), tanpa mengubah
// view SQL yang sudah ada.
export const getTopsisResultsWithSanggar = async (sessionId: string) => {
  const rows = await prisma.$queryRawUnsafe(
    `SELECT
       h.sessionId,
       h.productId,
       h.productName,
       h.price,
       h.image,
       h.nilai_preferensi,
       RANK() OVER (PARTITION BY h.sessionId ORDER BY h.nilai_preferensi DESC) AS ranking,
       b.c2_jarak AS jarak,
       sg.name AS sanggarName,
       sg.id AS sanggarId
     FROM v_topsis_hasil h
     JOIN v_topsis_base b ON b.sessionId = h.sessionId AND b.productId = h.productId
     JOIN products p ON p.id = h.productId
     JOIN sanggars sg ON sg.id = p.sanggarId
     WHERE h.sessionId = ?
     ORDER BY ranking`,
    sessionId,
  );

  return (rows as any[]).map((r) => ({
    ...r,
    productId: Number(r.productId),
    price: Number(r.price),
    nilai_preferensi: Number(r.nilai_preferensi),
    ranking: Number(r.ranking),
    jarak: Number(r.jarak),
    sanggarId: Number(r.sanggarId),
  }));
};

// Ambil hasil rekomendasi metode SAW
export const getSawResults = async (sessionId: string) => {
  const rows = await prisma.$queryRawUnsafe(
    'SELECT sessionId, ranking, productId, productName, nilai_preferensi FROM v_saw_hasil WHERE sessionId = ? ORDER BY ranking',
    sessionId,
  );

  return (rows as any[]).map((r) => ({
    ...r,
    productId: Number(r.productId),
    nilai_preferensi: Number(r.nilai_preferensi),
    ranking: Number(r.ranking),
  }));
};

// Simpan riwayat rekomendasi ke database
export const saveRecommendationHistory = async (
  sessionMeta: {
    weightHistoryId: number;
    regionId?: number | null;
    categoryId?: number | null;
    latitude: number;
    longitude: number;
    minPrice?: number;
    maxPrice?: number;
  },
  results: Array<{ productId: number; preferenceValue: number; ranking: number }>,
) => {
  const insertHistorySql = `INSERT INTO recommendation_histories (weightHistoryId, regionId, categoryId, latitude, longitude, minPrice, maxPrice, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;

  const params = [
    sessionMeta.weightHistoryId,
    sessionMeta.regionId ?? null,
    sessionMeta.categoryId ?? null,
    sessionMeta.latitude,
    sessionMeta.longitude,
    sessionMeta.minPrice ?? null,
    sessionMeta.maxPrice ?? null,
  ];

  return prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(insertHistorySql, ...params);
    const rows: any = await tx.$queryRawUnsafe('SELECT LAST_INSERT_ID() as id');
    const historyId = rows && rows[0] && (rows[0].id || rows[0].ID || rows[0].last_insert_id);

    if (results.length && historyId) {
      const values: string[] = results.map(
        (r) => `(${historyId}, ${Number(r.productId)}, ${Number(r.preferenceValue)}, ${Number(r.ranking)})`,
      );
      const insertResultsSql = `INSERT INTO recommendation_results (recommendationId, productId, preferenceValue, ranking) VALUES ${values.join(',')}`;
      await tx.$executeRawUnsafe(insertResultsSql);
    }

    return { id: historyId };
  });
};

export default { getTopsisResults, getTopsisResultsWithSanggar, getSawResults, saveRecommendationHistory };