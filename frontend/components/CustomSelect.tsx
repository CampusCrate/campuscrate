"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  variant?: "default" | "ghost";
}

export default function CustomSelect({ options, value, onChange, placeholder = "Select...", icon, variant = "default" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);
  const isGhost = variant === "ghost";

  const btnClass = isGhost 
    ? "w-full flex items-center justify-between gap-2 py-1 text-gray-600 hover:text-gray-900 font-medium text-[15px] focus:outline-none bg-transparent"
    : "w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-gray-900 font-medium text-[15px]";

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={btnClass}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className={isGhost ? "text-gray-400" : "text-gray-400"}>{icon}</span>}
          <span className={selectedOption ? (isGhost ? "text-gray-700 font-semibold" : "text-gray-900") : "text-gray-400 truncate"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 min-w-full whitespace-nowrap mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 left-0">
          <div className="max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 focus:bg-gray-50 transition-colors font-medium text-[14px]"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                <span className={value === opt.value ? "text-blue-900 font-bold" : "text-gray-700"}>{opt.label}</span>
                {value === opt.value && <Check className="w-4 h-4 text-blue-800 ml-3" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
