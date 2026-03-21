import { SearchInput } from "@/components/search-input";
import { Layout } from "@/components/layout";
import { ShoppingBag, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const trendingSearches = ["iPhone 15 Pro", "Sony Headphones", "Smart Watch", "Nike Sneakers", "Gaming Laptop"];

  return (
    <Layout>
      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 max-w-7xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center w-full max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-semibold mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/50 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white/70"></span>
              </span>
              Real-time cross-platform search
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white tracking-tight mb-6">
              Find the <span className="text-white/70">best price</span>,<br/>in seconds.
            </h1>
            
            <p className="text-lg md:text-xl text-white/40 mb-12 max-w-2xl mx-auto">
              Search once, compare instantly across Amazon and Flipkart. Never overpay for your favorite products again.
            </p>

            <div className="mb-10 w-full">
              <SearchInput autoFocus />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-sm">
              <span className="text-white/30 font-medium mr-2">Trending:</span>
              {trendingSearches.map((term, i) => (
                <a 
                  key={i}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/8 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/15 transition-all duration-200 cursor-pointer"
                >
                  {term}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="relative z-10 bg-[#0d0d0d] border-t border-white/5 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Lightning Fast", desc: "Compare prices in milliseconds using real-time API integrations." },
                { icon: ShoppingBag, title: "All Major Stores", desc: "Amazon and Flipkart integration out of the box." },
                { icon: ShieldCheck, title: "Unbiased Results", desc: "We sort by price, not by sponsored placements." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/6 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/8 text-white/60 flex items-center justify-center mb-4 border border-white/10">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/40 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
