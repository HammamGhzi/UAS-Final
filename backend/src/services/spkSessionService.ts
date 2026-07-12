import prisma from '../config/prisma';

// Buat sesi SPK baru
export const createSpkSession = async (data: {
  sessionId: string;
  userId?: number | null;
  regionId?: number | null;
  categoryId?: number | null;
  minPrice?: number;
  maxPrice?: number;
  userLat: number;
  userLon: number;
  weightHistoryId: number;
}) => {
  return prisma.spkSession.create({ data });
};

// Ambil sesi SPK berdasarkan session id
export const getSpkSession = async (sessionId: string) => {
  return prisma.spkSession.findUnique({ where: { sessionId } });
};

// Ambil semua sesi SPK untuk Super Admin (dengan bobot & relasi region/kategori)
export const getAllSpkSessions = async () => {
  const rows = await prisma.$queryRawUnsafe(`
    SELECT
      s.sessionId,
      s.userId,
      s.userLat,
      s.userLon,
      s.minPrice,
      s.maxPrice,
      s.createdAt,
      r.name  AS regionName,
      bc.categoryName,
      wh.priceWeight,
      wh.distanceWeight,
      wh.qualityWeight,
      wh.popularityWeight,
      wh.designWeight,
      u.email AS userEmail,
      (
        SELECT COUNT(*) FROM v_topsis_hasil vh WHERE vh.sessionId = s.sessionId
      ) AS totalProducts
    FROM spk_sessions s
    LEFT JOIN regions r ON r.id = s.regionId
    LEFT JOIN batik_categories bc ON bc.id = s.categoryId
    LEFT JOIN weight_histories wh ON wh.id = s.weightHistoryId
    LEFT JOIN users u ON u.id = s.userId
    ORDER BY s.createdAt DESC
  `) as any[];

  return rows.map((r) => ({
    ...r,
    minPrice: Number(r.minPrice),
    maxPrice: Number(r.maxPrice),
    priceWeight: Number(r.priceWeight),
    distanceWeight: Number(r.distanceWeight),
    qualityWeight: Number(r.qualityWeight),
    popularityWeight: Number(r.popularityWeight),
    designWeight: Number(r.designWeight),
    userLat: Number(r.userLat),
    userLon: Number(r.userLon),
    totalProducts: Number(r.totalProducts),
  }));
};

// Ambil detail TOPSIS lengkap satu sesi — semua step dari base sampai hasil
export const getSpkSessionDetail = async (sessionId: string) => {
  // Step 1 — Metadata sesi
  const sessionRows = await prisma.$queryRawUnsafe(`
    SELECT
      s.sessionId,
      s.userId,
      s.userLat,
      s.userLon,
      s.minPrice,
      s.maxPrice,
      s.createdAt,
      r.name        AS regionName,
      bc.categoryName,
      wh.id         AS weightHistoryId,
      wh.priceWeight,
      wh.distanceWeight,
      wh.qualityWeight,
      wh.popularityWeight,
      wh.designWeight,
      u.email       AS userEmail
    FROM spk_sessions s
    LEFT JOIN regions r ON r.id = s.regionId
    LEFT JOIN batik_categories bc ON bc.id = s.categoryId
    LEFT JOIN weight_histories wh ON wh.id = s.weightHistoryId
    LEFT JOIN users u ON u.id = s.userId
    WHERE s.sessionId = ?
  `, sessionId) as any[];

  if (!sessionRows.length) return null;

  const meta = {
    ...sessionRows[0],
    minPrice: Number(sessionRows[0].minPrice),
    maxPrice: Number(sessionRows[0].maxPrice),
    priceWeight: Number(sessionRows[0].priceWeight),
    distanceWeight: Number(sessionRows[0].distanceWeight),
    qualityWeight: Number(sessionRows[0].qualityWeight),
    popularityWeight: Number(sessionRows[0].popularityWeight),
    designWeight: Number(sessionRows[0].designWeight),
    userLat: Number(sessionRows[0].userLat),
    userLon: Number(sessionRows[0].userLon),
  };

  // Step 2 — v_topsis_base: data mentah (harga, jarak, kualitas, popularitas, desain)
  const baseRows = await prisma.$queryRawUnsafe(`
    SELECT
      productId,
      productName,
      c1_harga,
      c2_jarak,
      c3_kualitas,
      c4_popularitas,
      c5_desain
    FROM v_topsis_base
    WHERE sessionId = ?
    ORDER BY productId
  `, sessionId) as any[];

  const topsisBase = baseRows.map((r) => ({
    productId: Number(r.productId),
    productName: r.productName,
    c1_harga: Number(r.c1_harga),
    c2_jarak: Number(r.c2_jarak),
    c3_kualitas: Number(r.c3_kualitas),
    c4_popularitas: Number(r.c4_popularitas),
    c5_desain: Number(r.c5_desain),
  }));

  // Step 3 — v_topsis_pembagi: √(Σx²) per kriteria
  const pembaginRows = await prisma.$queryRawUnsafe(`
    SELECT p_c1, p_c2, p_c3, p_c4, p_c5
    FROM v_topsis_pembagi
    WHERE sessionId = ?
  `, sessionId) as any[];

  const topsisPembagi = pembaginRows.length ? {
    p_c1: Number(pembaginRows[0].p_c1),
    p_c2: Number(pembaginRows[0].p_c2),
    p_c3: Number(pembaginRows[0].p_c3),
    p_c4: Number(pembaginRows[0].p_c4),
    p_c5: Number(pembaginRows[0].p_c5),
  } : null;

  // Step 4 — v_topsis_norm_terbobot: nilai normalisasi × bobot
  const normRows = await prisma.$queryRawUnsafe(`
    SELECT
      productId,
      n_c1,
      n_c2,
      n_c3,
      n_c4,
      n_c5
    FROM v_topsis_norm_terbobot
    WHERE sessionId = ?
    ORDER BY productId
  `, sessionId) as any[];

  const topsisNormTerbobot = normRows.map((r) => ({
    productId: Number(r.productId),
    n_c1: Number(r.n_c1),
    n_c2: Number(r.n_c2),
    n_c3: Number(r.n_c3),
    n_c4: Number(r.n_c4),
    n_c5: Number(r.n_c5),
  }));

  // Step 5 — v_topsis_ideal: A+ dan A- per kriteria
  const idealRows = await prisma.$queryRawUnsafe(`
    SELECT
      a_plus_c1, a_min_c1,
      a_plus_c2, a_min_c2,
      a_plus_c3, a_min_c3,
      a_plus_c4, a_min_c4,
      a_plus_c5, a_min_c5
    FROM v_topsis_ideal
    WHERE sessionId = ?
  `, sessionId) as any[];

  const topsisIdeal = idealRows.length ? {
    a_plus_c1: Number(idealRows[0].a_plus_c1),
    a_min_c1: Number(idealRows[0].a_min_c1),
    a_plus_c2: Number(idealRows[0].a_plus_c2),
    a_min_c2: Number(idealRows[0].a_min_c2),
    a_plus_c3: Number(idealRows[0].a_plus_c3),
    a_min_c3: Number(idealRows[0].a_min_c3),
    a_plus_c4: Number(idealRows[0].a_plus_c4),
    a_min_c4: Number(idealRows[0].a_min_c4),
    a_plus_c5: Number(idealRows[0].a_plus_c5),
    a_min_c5: Number(idealRows[0].a_min_c5),
  } : null;

  // Step 6 — v_topsis_jarak: D+ dan D- per produk
  const jarakRows = await prisma.$queryRawUnsafe(`
    SELECT productId, d_plus, d_min
    FROM v_topsis_jarak
    WHERE sessionId = ?
    ORDER BY productId
  `, sessionId) as any[];

  const topsisJarak = jarakRows.map((r) => ({
    productId: Number(r.productId),
    d_plus: Number(r.d_plus),
    d_min: Number(r.d_min),
  }));

  // Step 7 — v_topsis_hasil: skor preferensi final + ranking
  const hasilRows = await prisma.$queryRawUnsafe(`
    SELECT
      h.productId,
      h.productName,
      h.price,
      h.nilai_preferensi,
      RANK() OVER (PARTITION BY h.sessionId ORDER BY h.nilai_preferensi DESC) AS ranking,
      sg.name AS sanggarName
    FROM v_topsis_hasil h
    JOIN products p ON p.id = h.productId
    JOIN sanggars sg ON sg.id = p.sanggarId
    WHERE h.sessionId = ?
    ORDER BY ranking
  `, sessionId) as any[];

  const topsisHasil = hasilRows.map((r) => ({
    productId: Number(r.productId),
    productName: r.productName,
    price: Number(r.price),
    sanggarName: r.sanggarName,
    nilai_preferensi: Number(r.nilai_preferensi),
    ranking: Number(r.ranking),
  }));

  return {
    meta,
    steps: {
      topsisBase,
      topsisPembagi,
      topsisNormTerbobot,
      topsisIdeal,
      topsisJarak,
      topsisHasil,
    },
  };
};

export default { createSpkSession, getSpkSession, getAllSpkSessions, getSpkSessionDetail };
