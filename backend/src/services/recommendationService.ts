import prisma from '../config/prisma';

export async function getTopsisResults(sessionId: string) {
  // Query view v_topsis_hasil which already contains ranking and nilai_preferensi
  const rows = await prisma.$queryRawUnsafe(
    'SELECT sessionId, ranking, productId, productName, price, image, nilai_preferensi FROM v_topsis_hasil WHERE sessionId = ? ORDER BY ranking',
    sessionId,
  );
  return rows as any[];
}

export async function getSawResults(sessionId: string) {
  const rows = await prisma.$queryRawUnsafe(
    'SELECT sessionId, ranking, productId, productName, nilai_preferensi FROM v_saw_hasil WHERE sessionId = ? ORDER BY ranking',
    sessionId,
  );
  return rows as any[];
}

export async function saveRecommendationHistory(
  sessionMeta: { weightHistoryId: number; regionId?: number | null; categoryId?: number | null; latitude: number; longitude: number; minPrice?: number; maxPrice?: number },
  results: Array<{ productId: number; preferenceValue: number; ranking: number }>,
) {
  // Use raw SQL because recommendation tables/views are not defined in Prisma schema
  // Insert into recommendation_histories then insert results using LAST_INSERT_ID()
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
      const values: string[] = results.map((r) => `(${historyId}, ${Number(r.productId)}, ${Number(r.preferenceValue)}, ${Number(r.ranking)})`);
      const insertResultsSql = `INSERT INTO recommendation_results (recommendationId, productId, preferenceValue, ranking) VALUES ${values.join(',')}`;
      await tx.$executeRawUnsafe(insertResultsSql);
    }

    return { id: historyId };
  });
}

export default { getTopsisResults, getSawResults, saveRecommendationHistory };
