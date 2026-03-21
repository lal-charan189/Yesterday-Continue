import { ExternalLink, Star, Trophy, Tag, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

// Defined locally to match what API returns based on OpenAPI spec
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
  platform: "amazon" | "flipkart" | string;
  isBestDeal: boolean;
}

export function ProductCard({ product, index }: { product: ProductResult, index: number }) {
  const isAmazon = product.platform.toLowerCase() === 'amazon';
  const formatPrice = (price: number | null) => {
    if (price === null) return "Price unavailable";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`relative group flex flex-col bg-card backdrop-blur-sm rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 ${
        product.isBestDeal 
          ? "border-bestdeal/40 hover:border-bestdeal shadow-lg shadow-bestdeal/5 hover:shadow-bestdeal/20" 
          : "border-card-border hover:border-white/20 hover:shadow-xl hover:shadow-primary/5"
      }`}
    >
      {/* Best Deal Badge */}
      {product.isBestDeal && (
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-bestdeal/50 via-bestdeal to-bestdeal/50" />
      )}
      
      {/* Image Container */}
      <div className="relative h-56 w-full p-6 bg-white/5 flex items-center justify-center overflow-hidden">
        {product.isBestDeal && (
          <div className="absolute top-3 left-3 z-10 bg-bestdeal/20 border border-bestdeal/50 text-bestdeal backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-bestdeal/20">
            <Trophy className="w-3.5 h-3.5" />
            BEST DEAL
          </div>
        )}
        
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-1.5"
             style={{ 
               backgroundColor: isAmazon ? 'rgba(255, 153, 0, 0.15)' : 'rgba(40, 116, 240, 0.15)',
               color: isAmazon ? '#FF9900' : '#4DA3FF'
             }}>
          {product.platform}
        </div>

        {product.image ? (
          <img 
            src={product.image} 
            alt={product.title}
            className="max-h-full max-w-full object-contain mix-blend-screen drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1NTUiIHN0cm9rZS13aWR0aD0iMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB4PSIzIiB5PSIzIiByeD0iMiIgcnk9IjIiLz48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSIvPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDE2IDEwIDUgMjEiLz48L3N2Zz4=';
            }}
          />
        ) : (
          <div className="text-muted/50 flex flex-col items-center gap-2">
            <AlertCircle className="w-10 h-10" />
            <span className="text-xs font-medium">No image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 border-t border-white/5">
        <h3 className="font-sans text-sm md:text-base font-semibold text-white/90 line-clamp-2 mb-3 group-hover:text-white transition-colors" title={product.title}>
          {product.title}
        </h3>
        
        <div className="mt-auto space-y-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-end gap-2">
              <span className={`font-display font-bold text-2xl ${product.price === null ? 'text-muted text-lg' : 'text-white'}`}>
                {formatPrice(product.price)}
              </span>
              {product.discount && (
                <span className="flex items-center gap-1 text-accent text-xs font-bold bg-accent/10 px-2 py-0.5 rounded-sm mb-1 border border-accent/20">
                  <Tag className="w-3 h-3" />
                  {product.discount}
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > (product.price || 0) && (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-white/80">{product.rating || "N/A"}</span>
              {product.ratingCount && (
                <span className="text-xs text-muted">({product.ratingCount})</span>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => window.open(product.url, '_blank')}
            className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 ${
              isAmazon 
                ? "bg-[#FF9900]/10 text-[#FF9900] hover:bg-[#FF9900] hover:text-black border border-[#FF9900]/30"
                : "bg-[#2874F0]/10 text-[#4DA3FF] hover:bg-[#2874F0] hover:text-white border border-[#2874F0]/30"
            }`}
          >
            View on {product.platform.charAt(0).toUpperCase() + product.platform.slice(1)}
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-card/50 rounded-2xl overflow-hidden border border-white/5 animate-pulse flex flex-col h-[420px]">
      <div className="h-56 w-full bg-white/5" />
      <div className="p-5 flex flex-col flex-1 gap-4">
        <div className="space-y-2">
          <div className="h-4 w-full bg-white/5 rounded-md" />
          <div className="h-4 w-4/5 bg-white/5 rounded-md" />
        </div>
        <div className="mt-auto space-y-4">
          <div className="h-8 w-1/2 bg-white/5 rounded-md" />
          <div className="h-6 w-1/3 bg-white/5 rounded-md" />
          <div className="h-10 w-full bg-white/5 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
