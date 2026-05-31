"use client";

import { useState, useRef, useEffect } from "react";
import ListingCard from "./ListingCard";
import { SlidersHorizontal, ChevronDown, Check, MapPin, PackageSearch } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useUniversities, type University } from "../hooks/useUniversities";

function CampusDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: uniData = [] } = useUniversities();

  const universities = [
    { label: "All Campuses", value: "" },
    ...uniData.map((u: University) => ({ label: u.name, value: u.slug })),
  ];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const selected = universities.find(u => u.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`pb-2 text-sm font-semibold transition-colors flex items-center gap-1.5 relative whitespace-nowrap ${value !== "" ? "text-gray-900" : "text-gray-400 hover:text-gray-900"}`}
      >
        <MapPin className="w-3.5 h-3.5" />
        {selected?.label || "Campus"}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
        {value !== "" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 rounded-t-full"></span>}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] py-1.5 z-30 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-150">
          {universities.map(u => (
            <button key={u.value} type="button" onClick={() => { onChange(u.value); setOpen(false); }} className="w-full flex items-center justify-between px-4 py-2.5 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              {u.label}
              {value === u.value && <Check className="w-4 h-4 text-blue-700" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Feed() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [campus, setCampus] = useState("");

  const { data: listings = [], isLoading, isError } = useQuery({
    queryKey: ['listings', campus, activeFilter],
    queryFn: async () => {
      const searchParam = campus ? `?search=${campus}` : '';
      const res = await fetch(`http://127.0.0.1:8000/api/v1/listings/${searchParam}`);
      if (!res.ok) throw new Error("Network error");
      return res.json();
    }
  });

  const simpleFilters = ["All", "Newest", "Verified Only"];

  return (
    <section className="px-4 md:px-6 max-w-7xl mx-auto py-8 mb-20 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2 border-b border-gray-100 pb-0">
        <h2 className="text-[1.15rem] font-bold text-gray-900 tracking-tight pb-2 shrink-0">Fresh on the feed</h2>
        
        <div className="flex items-center gap-5 md:gap-6 overflow-x-auto w-full sm:w-auto scrollbar-hide pb-0">
          {simpleFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap pb-2 text-[13.5px] font-semibold transition-colors relative ${
                activeFilter === filter ? "text-gray-900" : "text-gray-400 hover:text-gray-900"
              }`}
            >
              {filter}
              {activeFilter === filter && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 rounded-t-full"></span>}
            </button>
          ))}

          <div className="pb-2">
            <CampusDropdown value={campus} onChange={setCampus} />
          </div>

          <button className="flex items-center gap-1.5 whitespace-nowrap pb-2 text-[13.5px] font-semibold text-gray-400 hover:text-gray-900 transition-colors shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse flex flex-col h-full w-full">
              <div className="aspect-[4/3] w-full bg-gray-100 rounded-2xl mb-4"></div>
              <div className="h-3 bg-gray-100 rounded-full w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-1"></div>
              <div className="h-5 bg-gray-100 rounded-full w-1/2 mt-2"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <div className="bg-red-50 text-red-600 p-4 rounded-full mb-4">
            <PackageSearch className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Error Loading Feed</h3>
          <p className="text-[14px] text-gray-500 font-medium">Could not connect to the campus servers. Ensure backend is running.</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <div className="bg-[#f8f9fa] border border-gray-100 p-4 rounded-full mb-4">
            <PackageSearch className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
          <p className="text-[14px] text-gray-500 font-medium">Be the first to sell something in this category or campus!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12 animate-in fade-in duration-500">
          {listings.map((l: any, i: number) => (
            <ListingCard 
              key={l.id || i}
              id={l.id}
              category={l.category?.name || "Other"}
              title={l.title} 
              price={l.price} 
              condition={l.condition}
              location={l.seller?.university?.name || "Off-Campus"}
              imageSrc={l.images?.[0]?.image_url}
            />
          ))}
        </div>
      )}
    </section>
  );
}
