"use client";

import { Bookmark, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useSavedListings } from "../hooks/useSavedListings";

export interface ListingCardProps {
  id: string;
  imageSrc?: string;
  category: string;
  title: string;
  price: string;
  condition: string;
  location: string;
}

export default function ListingCard(props: ListingCardProps) {
  const { id, imageSrc, category, title, price, condition, location } = props;
  const { toggleSaved, isSaved } = useSavedListings();
  
  const saved = isSaved(id);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to item
    e.stopPropagation();
    toggleSaved(props);
  };

  return (
    <Link href={`/item/${id}`} className="group cursor-pointer flex flex-col h-full w-full">
      <div className="relative aspect-[4/3] w-full bg-[#f8f9fa] rounded-2xl mb-4 overflow-hidden shrink-0">
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
        )}
        
        {/* Bookmark icon */}
        <button 
          onClick={handleSave}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            saved 
            ? "text-blue-600 bg-white/100 shadow-sm opacity-100" 
            : "text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 hover:bg-white/90"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="px-1 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{category}</p>
          <span className="text-[11px] text-gray-300">•</span>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{condition}</span>
        </div>
        
        <h3 className="font-semibold text-gray-900 text-[15px] leading-snug mb-1 line-clamp-2">{title}</h3>
        <span className="font-bold text-[17px] text-gray-900 block">KES {parseFloat(price).toLocaleString()}</span>
        
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 mt-auto pt-3">
          <BadgeCheck className="w-[14px] h-[14px] text-blue-600 shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      </div>
    </Link>
  );
}
