import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/services/api";

// Bentuk data persis seperti yang dibalikin dashboardController.ts -> getDashboardSummary
export interface DashboardSummary {
  totals: {
    users: number;
    products: number;
    sanggars: number;
    reviews: number;
  };
  newThisWeek: {
    users: number;
    products: number;
    sanggars: number;
  };
  avgRating: number;
  topRatedProducts: {
    id: number;
    name: string;
    sanggarName: string;
    image: string | null;
    avgRating: number;
    reviewCount: number;
  }[];
  recentReviews: {
    id: number;
    reviewerName: string;
    productName: string;
    sanggarName: string;
    rating: number;
    comment: string | null;
    createdAt: string;
  }[];
}

export const DASHBOARD_SUMMARY_QUERY_KEY = ["dashboard-summary"] as const;

export const useDashboardSummary = () =>
  useQuery({
    queryKey: DASHBOARD_SUMMARY_QUERY_KEY,
    queryFn: async () => {
      const res = await dashboardApi.getSummary();
      return res.data.data as DashboardSummary;
    },
  });