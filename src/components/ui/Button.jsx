import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({ children, onClick, variant = "primary", className = "", loading = false, disabled = false }) => {
  const styles = {
    primary: "bg-[#006D5B] text-white hover:bg-[#005a4b] shadow-md hover:shadow-lg hover:shadow-[#006D5B]/30",
    outline: "border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
    white: "bg-white text-[#006D5B] hover:bg-gray-50 shadow-md hover:shadow-xl",
    ghost: "text-gray-400 hover:text-[#006D5B] font-bold hover:bg-gray-50"
  };
  return (
    <button onClick={onClick} disabled={loading || disabled} className={`px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 ${styles[variant]} ${className}`}>
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>
  );
};
