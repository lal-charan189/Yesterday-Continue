import { Layout } from "@/components/layout";
import { SearchInput } from "@/components/search-input";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import { useSearch } from "wouter";
import { useSearchProducts } from "@/api";
import type { ProductResult } from "@/api/api.schemas";
import { usePreferences } from "@/hooks/use-preferences";
import { SlidersHorizontal, AlertTriangle, PackageSearch } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchResults() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const q = params.get("q") || "";
  
  const { preferences } = usePreferences();
  const platformsStr = preferences.platforms.join(',');

  const { data, isLoading, error } = useSearchProducts(
    { q, platforms: platformsStr },
    { 
      query: { 
        queryKey: ['/api/search', { q, platforms: platformsStr }],
        enabled: !!q && preferences.platforms.length > 0,
        staleTime: 5 * 60 * 1000 // 5 mins
      } 
    }
  );

  const renderContent = () => {
    if (!q) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <PackageSearch className="w-16 h-16 text-muted mb-4 opacity-50" />
          <h2 className="text-2xl font-display font-bold text-white mb-2">Ready to hunt?</h2>
          <p className="text-muted">Enter a product name above to start comparing prices.</p>
        </div>
      );
    }

    if (preferences.platforms.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">No platforms selected</h2>
          <p className="text-muted">Please select at least one platform in settings to search.</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-3xl mx-auto max-w-2xl mt-10">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-display font-bold text-white mb-2">Search Failed</h2>
          <p className="text-muted mb-6">We couldn't fetch the results. The API might be down or rate-limited.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (data?.results.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <PackageSearch className="w-16 h-16 text-muted mb-4 opacity-50" />
          <h2 className="text-2xl font-display font-bold text-white mb-2">No results found</h2>
          <p className="text-muted">We couldn't find any matches for "{q}" on the selected platforms.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.results.map((product: ProductResult, i: number) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Sticky Search Header */}
        <div className="sticky top-24 z-40 bg-background/80 backdrop-blur-xl pb-6 mb-6 border-b border-white/5">
          <div className="flex flex-col gap-6">
            <SearchInput initialValue={q} />
            
            {data && !isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center justify-between gap-4 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{data.totalResults} results</span>
                  <span className="text-muted">for "{q}"</span>
                </div>
                
                <div className="flex items-center gap-4 text-muted/80">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                    {data.searchDurationMs}ms
                  </span>
                  <div className="h-4 w-px bg-white/10"></div>
                  <div className="flex gap-2">
                    {data.platforms.map((p: string) => (
                      <span key={p} className="capitalize text-white/60 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div className="min-h-[50vh]">
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
}
