"use client";

import { useState } from "react";
import ListingCard from "./ListingCard";
import { PackageSearch } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CampusSelect from "./CampusSelect";

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
    <section className="px-4 md:px-6 max-w-7xl mx-auto py-8 mb-20 w-full">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4 border-b border-gray-100 pb-0">
        <div className="flex flex-col gap-4 w-full lg:w-auto">
          <h2 className="text-[1.25rem] font-bold text-gray-900 tracking-tight">Fresh on the feed</h2>
          
          <div className="flex items-center gap-5 pb-0 -mb-[1px] flex-wrap">
            {simpleFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap pb-3 text-[13.5px] font-semibold transition-colors relative ${
                  activeFilter === filter ? "text-gray-900" : "text-gray-400 hover:text-gray-900"
                }`}
              >
                {filter}
                {activeFilter === filter && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 rounded-t-full"></span>}
              </button>
            ))}
          </div>
        </div>
        
        {/* Right side filters */}
        <div className="flex items-center pb-3 w-full lg:w-[220px] shrink-0 z-10 relative">
          <CampusSelect value={campus} onChange={setCampus} variant="outline" />
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
