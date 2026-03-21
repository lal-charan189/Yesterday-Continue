import { Router, type IRouter, type Request, type Response } from "express";
import axios from "axios";

const router: IRouter = Router();

function parsePrice(priceStr: string | null | undefined): number | null {
  if (!priceStr) return null;
  const cleaned = priceStr.replace(/[₹,\s]/g, "").replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function parseRating(ratingStr: string | null | undefined): number | null {
  if (!ratingStr) return null;
  const num = parseFloat(String(ratingStr));
  return isNaN(num) ? null : num;
}

const accessoryWords = ['case', 'cover', 'protector', 'glass', 'cable', 'adapter', 'strap', 'pouch', 'stand', 'skin', 'sleeve', 'holder', 'mount', 'charger', 'plug', 'dock'];

function universalFilter(products: ProductResult[], userQuery: string): ProductResult[] {
  const query = userQuery.toLowerCase();
  const queryIsAccessory = accessoryWords.some(word => query.includes(word));

  return products.filter(item => {
    const title = item.title.toLowerCase();
    const price = item.price;
    const titleIsAccessory = accessoryWords.some(word => title.includes(word));

    if (titleIsAccessory && !queryIsAccessory) return false;
    if (price !== null && price < 1000 && !queryIsAccessory) return false;

    return true;
  });
}

interface ProductResult {
  id: string;
  title: string;
  price: number | null;
  originalPrice: number | null;
  discount: string | null;
  rating: number | null;
  ratingCount: string | null;
  image: string | null;
  url: string;
  platform: "amazon" | "flipkart";
  isBestDeal: boolean;
}

async function searchAmazon(query: string): Promise<ProductResult[]> {
  const rapidKey = process.env["RAPID_KEY"];
  if (!rapidKey) {
    throw new Error("RAPID_KEY is not set");
  }

  try {
    const response = await axios.get(
      "https://real-time-amazon-data.p.rapidapi.com/search",
      {
        params: {
          query,
          page: "1",
          country: "IN",
          sort_by: "RELEVANCE",
          product_condition: "ALL",
        },
        headers: {
          "X-RapidAPI-Key": rapidKey,
          "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com",
        },
        timeout: 15000,
      }
    );

    const products = response.data?.data?.products ?? [];

    return products
      .filter((p: Record<string, unknown>) => p.product_title)
      .slice(0, 15)
      .map((p: Record<string, unknown>, i: number) => {
        const priceStr = (p.product_minimum_offer_price as string) || (p.product_price as string);
        const originalStr = p.product_original_price as string;
        const price = parsePrice(priceStr as string);
        const originalPrice = parsePrice(originalStr as string);

        let discount: string | null = null;
        if (price && originalPrice && originalPrice > price) {
          const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
          discount = `${pct}% off`;
        }

        const asin = (p.asin as string) || `amz-${i}`;
        const productUrl = (p.product_url as string) || `https://www.amazon.in/dp/${asin}`;

        return {
          id: `amazon-${asin}`,
          title: p.product_title as string,
          price,
          originalPrice: originalPrice && originalPrice > (price ?? 0) ? originalPrice : null,
          discount,
          rating: parseRating(p.product_star_rating as string),
          ratingCount: p.product_num_ratings ? String(p.product_num_ratings) : null,
          image: (p.product_photo as string) || null,
          url: productUrl,
          platform: "amazon" as const,
          isBestDeal: false,
        };
      });
  } catch (err) {
    const error = err as { response?: { status?: number; data?: unknown } };
    if (error.response) {
      throw new Error(`Amazon API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw err;
  }
}

async function searchFlipkart(query: string): Promise<ProductResult[]> {
  const scrapingdogKey = process.env["SCRAPINGDOG_KEY"];
  if (!scrapingdogKey) {
    throw new Error("SCRAPINGDOG_KEY is not set");
  }

  const flipkartUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(
      "https://api.scrapingdog.com/flipkart/search",
      {
        params: {
          api_key: scrapingdogKey,
          url: flipkartUrl,
        },
        timeout: 20000,
      }
    );

    const results = response.data?.search_results ?? response.data?.products ?? [];

    return results
      .filter((p: Record<string, unknown>) => p.title || p.name)
      .slice(0, 15)
      .map((p: Record<string, unknown>, i: number) => {
        const title = (p.title || p.name) as string;
        const priceStr = (p.price || p.discounted_price) as string;
        const originalStr = (p.original_price || p.mrp) as string;
        const price = parsePrice(priceStr);
        const originalPrice = parsePrice(originalStr);

        let discount = (p.discount || p.discount_percentage) as string | null;
        if (!discount && price && originalPrice && originalPrice > price) {
          const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
          discount = `${pct}% off`;
        }

        const rawUrl = (p.url || p.link || p.product_url) as string;
        const productUrl = rawUrl
          ? rawUrl.startsWith("http")
            ? rawUrl
            : `https://www.flipkart.com${rawUrl}`
          : `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;

        return {
          id: `flipkart-${i}-${Date.now()}`,
          title,
          price,
          originalPrice: originalPrice && originalPrice > (price ?? 0) ? originalPrice : null,
          discount: discount || null,
          rating: parseRating((p.rating || p.ratings) as string),
          ratingCount: (p.rating_count || p.ratings_count || p.num_ratings) as string | null,
          image: (p.image || p.thumbnail || p.img) as string | null,
          url: productUrl,
          platform: "flipkart" as const,
          isBestDeal: false,
        };
      });
  } catch (err) {
    const error = err as { response?: { status?: number; data?: unknown } };
    if (error.response) {
      throw new Error(`Flipkart API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw err;
  }
}

router.get("/search", async (req: Request, res: Response) => {
  const query = req.query["q"] as string;
  const platformsParam = req.query["platforms"] as string;

  if (!query || query.trim().length === 0) {
    res.status(400).json({ error: "bad_request", message: "Query parameter 'q' is required" });
    return;
  }

  const requestedPlatforms = platformsParam
    ? platformsParam.split(",").map((p) => p.trim().toLowerCase())
    : ["amazon", "flipkart"];

  const startTime = Date.now();

  const searchTasks: Promise<ProductResult[]>[] = [];
  const activePlatforms: string[] = [];

  if (requestedPlatforms.includes("amazon")) {
    searchTasks.push(
      searchAmazon(query).catch((err) => {
        req.log.error({ err }, "Amazon search failed");
        return [];
      })
    );
    activePlatforms.push("amazon");
  }

  if (requestedPlatforms.includes("flipkart")) {
    searchTasks.push(
      searchFlipkart(query).catch((err) => {
        req.log.error({ err }, "Flipkart search failed");
        return [];
      })
    );
    activePlatforms.push("flipkart");
  }

  const resultSets = await Promise.all(searchTasks);
  const rawResults: ProductResult[] = resultSets.flat();
  const allResults: ProductResult[] = universalFilter(rawResults, query);

  allResults.sort((a, b) => {
    if (a.price === null && b.price === null) return 0;
    if (a.price === null) return 1;
    if (b.price === null) return -1;
    return a.price - b.price;
  });

  const cheapestWithPrice = allResults.find((r) => r.price !== null);
  if (cheapestWithPrice) {
    cheapestWithPrice.isBestDeal = true;
  }

  const searchDurationMs = Date.now() - startTime;

  res.json({
    query,
    results: allResults,
    totalResults: allResults.length,
    platforms: activePlatforms,
    searchDurationMs,
  });
});

export default router;
