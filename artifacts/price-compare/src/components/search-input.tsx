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
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto group">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
      <div className="relative flex items-center bg-[#0a0a0f] rounded-2xl border border-white/10 shadow-2xl overflow-hidden focus-within:border-primary/50 transition-colors duration-300">
        <div className="pl-6 text-muted">
          <Search className="w-6 h-6" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for laptops, phones, shoes..."
          autoFocus={autoFocus}
          className="w-full py-5 px-4 bg-transparent text-white placeholder:text-muted/70 focus:outline-none text-lg font-medium"
        />
        <button 
          type="submit"
          disabled={!query.trim()}
          className="mx-2 p-3 rounded-xl bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
}
