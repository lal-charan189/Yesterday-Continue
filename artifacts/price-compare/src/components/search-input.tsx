import { useState, FormEvent } from "react";
import { useLocation } from "wouter";
import { Search, ArrowRight } from "lucide-react";

export function SearchInput({ initialValue = "", autoFocus = false }: { initialValue?: string, autoFocus?: boolean }) {
  const [query, setQuery] = useState(initialValue);
  const [, setLocation] = useLocation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto">
      <div className="relative flex items-center bg-[#111111] rounded-2xl border border-white/10 shadow-2xl overflow-hidden focus-within:border-white/25 transition-colors duration-300">
        <div className="pl-6 text-white/30">
          <Search className="w-6 h-6" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for laptops, phones, shoes..."
          autoFocus={autoFocus}
          className="w-full py-5 px-4 bg-transparent text-white placeholder:text-white/25 focus:outline-none text-lg font-medium"
        />
        <button 
          type="submit"
          disabled={!query.trim()}
          className="mx-2 p-3 rounded-xl bg-white text-black disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/90 transition-all duration-200"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
}
