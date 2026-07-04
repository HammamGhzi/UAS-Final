import type { ProductRecord } from "@/pages/adminSanggar/ProductStore";

// Bentuk data mengikuti model `Review` di backend:
// id, productId, reviewerName, quality, popularity, design, comment, createdAt.
// (userId sengaja belum dipakai karena belum konek backend/auth user.)
export type ReviewRecord = {
  id: number;
  productId: number;
  reviewerName: string;
  quality: number;
  popularity: number;
  design: number;
  comment: string;
  createdAt: string;
};

const STORAGE_KEY = "adminSanggarReviews";

export const getStoredReviews = (): ReviewRecord[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? (parsed as ReviewRecord[]) : [];
  } catch {
    return [];
  }
};

const persistReviews = (reviews: ReviewRecord[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
};

export const getAverageRating = (review: ReviewRecord) =>
  (review.quality + review.popularity + review.design) / 3;

export const getProductAverageRating = (
  productId: number,
  reviews: ReviewRecord[]
) => {
  const productReviews = reviews.filter((review) => review.productId === productId);
  if (productReviews.length === 0) return 0;

  const total = productReviews.reduce((sum, review) => sum + getAverageRating(review), 0);
  return total / productReviews.length;
};

const sampleReviewers = [
  "Siti Aminah",
  "Budi Santoso",
  "Dewi Lestari",
  "Rian Pratama",
  "Nur Halimah",
  "Agus Wijaya",
];

const sampleComments = [
  "Motifnya rapi dan warnanya awet, puas banget.",
  "Kualitas kain bagus, tapi pengiriman agak lama.",
  "Desainnya unik, cocok buat acara formal.",
  "Sesuai foto, jahitannya juga halus.",
  "Harga sepadan sama kualitasnya.",
  "Bahan adem dipakai, motif batiknya khas.",
];

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Dipakai lewat tombol "Muat Contoh Data" di halaman Riwayat Rating,
// supaya tampilan bisa dites walau belum konek ke backend.
// Hanya menambah 2-3 review acak untuk produk yang belum punya review sama sekali.
export const seedSampleReviews = (products: ProductRecord[]): ReviewRecord[] => {
  const existing = getStoredReviews();
  const productsWithoutReview = products.filter(
    (product) => !existing.some((review) => review.productId === product.id)
  );

  const newReviews: ReviewRecord[] = [];

  productsWithoutReview.forEach((product) => {
    const reviewCount = randomBetween(2, 3);
    for (let i = 0; i < reviewCount; i += 1) {
      newReviews.push({
        id: Date.now() + Math.floor(Math.random() * 100000) + i,
        productId: product.id,
        reviewerName: sampleReviewers[randomBetween(0, sampleReviewers.length - 1)],
        quality: randomBetween(3, 5),
        popularity: randomBetween(3, 5),
        design: randomBetween(3, 5),
        comment: sampleComments[randomBetween(0, sampleComments.length - 1)],
        createdAt: new Date(
          Date.now() - randomBetween(1, 30) * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    }
  });

  const combined = [...newReviews, ...existing];
  persistReviews(combined);
  return combined;
};

export const clearAllReviews = () => {
  persistReviews([]);
};