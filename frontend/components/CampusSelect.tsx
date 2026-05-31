"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, MapPin, Search, Loader2 } from "lucide-react";
import { useUniversities } from "../hooks/useUniversities";

interface CampusSelectProps {
  value: string;
  onChange: (val: string) => void;
  variant?: "default" | "ghost" | "underline";
}

export default function CampusSelect({ value, onChange, variant = "default" }: CampusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data: universitiesData = [], isLoading } = useUniversities();

  const options = useMemo(() => {
    return [
      { label: "All Campuses", value: "" },
      ...universitiesData.map(u => ({ label: u.name, value: u.slug }))
    ];
  }, [universitiesData]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter(o => o.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [options, searchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search when closed
  useEffect(() => {
    if (!isOpen) setSearchQuery("");
  }, [isOpen]);

  const selectedOption = options.find((o) => o.value === value);

  let btnClass = "";
  if (variant === "ghost") {
    btnClass = "w-full flex items-center justify-between gap-2 py-1 text-gray-600 hover:text-gray-900 font-medium text-[15px] focus:outline-none bg-transparent";
  } else if (variant === "underline") {
    btnClass = `w-full pb-2 text-sm font-semibold transition-colors flex items-center gap-1.5 relative whitespace-nowrap ${value !== "" ? "text-gray-900" : "text-gray-400 hover:text-gray-900"}`;
  } else if (variant === "outline") {
    btnClass = "w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[#f8f9fa] hover:bg-gray-100 text-gray-700 rounded-xl text-[13.5px] font-bold transition-all border border-gray-200 focus:ring-2 focus:ring-gray-200 focus:outline-none";
  } else {
    btnClass = "w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-gray-900 font-medium text-[15px]";
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={btnClass}>
        <div className="flex items-center gap-2 truncate">
          <MapPin className={variant === "underline" || variant === "outline" ? "w-4 h-4 text-gray-500" : "w-4 h-4 text-gray-400"} />
          <span className={selectedOption ? (variant === "ghost" ? "text-gray-700 font-semibold" : "text-gray-900") : (variant === "outline" ? "text-gray-500" : "text-gray-400 truncate")}>
            {isLoading ? "Loading..." : (selectedOption ? selectedOption.label : "Select campus")}
          </span>
        </div>
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-300 shrink-0" />
        ) : (
          <ChevronDown className={`${variant === "underline" ? "w-3.5 h-3.5" : "w-4 h-4"} text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
        )}
        {variant === "underline" && value !== "" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 rounded-t-full"></span>}
      </button>

      {isOpen && (
        <div className="absolute z-50 min-w-full sm:min-w-[240px] mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] pt-2 pb-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 left-0">
          
          <div className="px-3 mb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search campuses..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-8 pr-3 py-2 text-[13.5px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400"
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-56 overflow-y-auto mt-1 scrollbar-hide border-t border-gray-50 pt-1">
            {filteredOptions.length === 0 ? (
              <p className="px-4 py-3 text-[13px] text-gray-400 text-center font-medium">No campuses found.</p>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 focus:bg-gray-50 transition-colors font-medium text-[14px]"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                >
                  <span className={value === opt.value ? "text-blue-900 font-bold" : "text-gray-700"}>
                    {opt.label}
                  </span>
                  {value === opt.value && <Check className="w-4 h-4 text-blue-800 ml-3" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
