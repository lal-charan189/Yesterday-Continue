import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Settings, Crosshair, X, Check } from "lucide-react";
import { usePreferences } from "@/hooks/use-preferences";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { preferences, togglePlatform } = usePreferences();
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#080808]/90 backdrop-blur-xl border-b border-white/6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/12 flex items-center justify-center transition-all duration-300 group-hover:bg-white/14">
              <Crosshair className="w-5 h-5 text-white/70" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">
              Price<span className="text-white/40">Hunt</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {!isHome && (
              <Link href="/" className="hidden md:flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors">
                <Search className="w-4 h-4" />
                New Search
              </Link>
            )}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/8 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-200"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#080808] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-white/25 text-sm flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 mb-2">
            <Crosshair className="w-4 h-4" />
            <span className="font-display font-semibold tracking-wider">PRICEHUNT</span>
          </div>
          <p>© {new Date().getFullYear()} PriceHunt. Powered by ScrapingDog & RapidAPI.</p>
        </div>
      </footer>

      {/* Settings Modal Overlay */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101] p-4"
            >
              <div className="bg-[#111111] rounded-2xl p-6 relative border border-white/10 shadow-2xl">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/8 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <h2 className="font-display text-2xl font-bold mb-6 text-white">Search Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Platforms to Search</h3>
                    <div className="space-y-3">
                      {['amazon', 'flipkart'].map(platform => {
                        const isSelected = preferences.platforms.includes(platform);
                        return (
                          <button
                            key={platform}
                            onClick={() => togglePlatform(platform)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                              isSelected 
                                ? 'bg-white/8 border-white/20 text-white' 
                                : 'bg-white/3 border-white/6 text-white/40 hover:border-white/12'
                            }`}
                          >
                            <span className="capitalize font-medium">{platform}</span>
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                              isSelected ? 'bg-white border-white' : 'border-white/20'
                            }`}>
                              {isSelected && <Check className="w-4 h-4 text-black" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
