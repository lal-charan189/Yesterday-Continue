export interface HealthStatus {
  status: string;
}

export type ProductResultPlatform =
  (typeof ProductResultPlatform)[keyof typeof ProductResultPlatform];

export const ProductResultPlatform = {
  amazon: "amazon",
  flipkart: "flipkart",
} as const;

export interface ProductResult {
  id: string;
  title: string;
  price: number | null;
  originalPrice: number | null;
  discount: string | null;
  rating: number | null;
  ratingCount: string | null;
  image: string | null;
  url: string;
  platform: ProductResultPlatform;
  isBestDeal: boolean;
}

export interface SearchResponse {
  query: string;
  results: ProductResult[];
  totalResults: number;
  platforms: string[];
  searchDurationMs: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export type SearchProductsParams = {
  q: string;
  platforms?: string;
};
