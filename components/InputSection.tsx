import React, { useState, KeyboardEvent } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';

interface InputSectionProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
  onFocusChange?: (focused: boolean) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ onSearch, isLoading, onFocusChange }) => {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim() && !isLoading) {
      onSearch(value.trim());
    }
  };

  const handleClick = () => {
    if (value.trim() && !isLoading) {
      onSearch(value.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center relative z-20">
      <div className="mb-10 space-y-4">
        <h1 className="text-6xl md:text-7xl font-serif font-bold text-white tracking-tight drop-shadow-2xl">
          StarDustAI.
        </h1>
        <p className="text-slate-300 text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          Explore knowledge. Synthesize insights. Generate research instantly.
        </p>
      </div>
      
      <div className="relative group max-w-2xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-sky-400/20 to-primary-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-focus-within:opacity-100"></div>
        
        <div className="relative flex items-center">
            <div className="absolute left-6 text-slate-400 group-focus-within:text-white transition-colors duration-300">
            {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
                <Search className="h-6 w-6" />
            )}
            </div>
            
            <input
            type="text"
            className="w-full pl-16 pr-16 py-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl text-xl text-white placeholder:text-slate-500 focus:outline-none focus:bg-white/10 focus:border-primary-500/30 focus:ring-1 focus:ring-primary-500/20 transition-all shadow-2xl"
            placeholder="Start with a topic, idea, or question"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => onFocusChange && onFocusChange(true)}
            onBlur={() => onFocusChange && onFocusChange(false)}
            disabled={isLoading}
            autoFocus
            />
            
            <button 
                onClick={handleClick}
                disabled={isLoading || !value.trim()}
                className="absolute right-3 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all disabled:opacity-0 disabled:scale-90"
            >
                <ArrowRight className="h-5 w-5" />
            </button>
        </div>
      </div>
      
      <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
        <span className="opacity-60">Try asking about:</span>
        {["Quantum Computing", "CRISPR Technology", "The Future of AI", "Sustainable Energy"].map((tag) => (
            <button 
                key={tag}
                onClick={() => onSearch(tag)}
                className="px-3 py-1 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all backdrop-blur-sm cursor-pointer"
            >
                {tag}
            </button>
        ))}
      </div>
    </div>
  );
};

export default InputSection;