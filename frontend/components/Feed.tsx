"use client";

import { useState, useRef, useEffect } from "react";
import ListingCard from "./ListingCard";
import { SlidersHorizontal, ChevronDown, Check, MapPin } from "lucide-react";

const universities = [
  { label: "All Campuses", value: "" },
  { label: "Multimedia University", value: "mmu" },
  { label: "Nairobi University", value: "uon" },
  { label: "Strathmore University", value: "strath" },
];

function CampusDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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

  const listings = [
    { category: "SCIENCE & TECH", title: "MMU Branded Lab Coat — Size M", price: "KES 1,200", condition: "Like New", location: "Multimedia University", imageSrc: "https://images.unsplash.com/photo-1574538298285-188e7a02c910?q=80&w=600&auto=format&fit=crop" },
    { category: "ENGINEERING", title: "Casio FX-991ES Plus Calculator", price: "KES 1,800", condition: "Good", location: "Multimedia University", imageSrc: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=600&auto=format&fit=crop" },
    { category: "ENGINEERING", title: "Complete Drawing Kit", price: "KES 2,500", condition: "New", location: "Multimedia University", imageSrc: "https://images.unsplash.com/photo-1509653066348-18e479cddecf?q=80&w=600&auto=format&fit=crop" },
    { category: "TEXTBOOKS", title: "Electrical Eng. Texts (Set of 6)", price: "KES 3,200", condition: "Good", location: "Nairobi University", imageSrc: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=600&auto=format&fit=crop" },
    { category: "ELECTRONICS", title: "JBL Clip 3 Bluetooth Speaker", price: "KES 2,900", condition: "Like New", location: "Strathmore University", imageSrc: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&auto=format&fit=crop" },
    { category: "APPAREL", title: "Winter Puffer Jacket — Size L", price: "KES 1,000", condition: "Good", location: "Multimedia University", imageSrc: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop" },
    { category: "HOSTEL", title: "Mini Desk Fan (USB)", price: "KES 750", condition: "Fair", location: "Nairobi University", imageSrc: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=600&auto=format&fit=crop" },
    { category: "TEXTBOOKS", title: "Organic Chemistry, 9th Ed.", price: "KES 850", condition: "Good", location: "Strathmore University", imageSrc: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop" },
  ];

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

          {/* Campus filter with inline dropdown */}
          <div className="pb-2">
            <CampusDropdown value={campus} onChange={setCampus} />
          </div>

          <button className="flex items-center gap-1.5 whitespace-nowrap pb-2 text-[13.5px] font-semibold text-gray-400 hover:text-gray-900 transition-colors shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
        {listings.map((l, i) => <ListingCard key={i} {...l} />)}
      </div>
    </section>
  );
}
