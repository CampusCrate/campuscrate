"use client";

import Navbar from "../../../components/Navbar";
import { Tag, ChevronRight, BadgeCheck, ExternalLink } from "lucide-react";
import Link from "next/link";

const listings = [
  { id: "1", title: "MMU Branded Lab Coat — Size M", category: "Science & Tech", price: "KES 1,200", condition: "Like New", status: "Active", views: 34, imageSrc: "https://images.unsplash.com/photo-1574538298285-188e7a02c910?q=80&w=600&auto=format&fit=crop" },
  { id: "2", title: "Casio FX-991ES Plus Calculator", category: "Engineering", price: "KES 1,800", condition: "Good", status: "Active", views: 21, imageSrc: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=600&auto=format&fit=crop" },
  { id: "3", title: "Organic Chemistry, 9th Edition", category: "Textbooks", price: "KES 850", condition: "Good", status: "Sold", views: 62, imageSrc: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop" },
  { id: "4", title: "Winter Puffer Jacket — Size L", category: "Apparel", price: "KES 1,000", condition: "Good", status: "Paused", views: 15, imageSrc: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop" },
  { id: "5", title: "USB Desk Fan", category: "Hostel", price: "KES 750", condition: "Fair", status: "Active", views: 8, imageSrc: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=600&auto=format&fit=crop" },
];

const statusColor: Record<string, string> = {
  Active: "bg-green-50 text-green-700 border-green-100",
  Sold: "bg-gray-100 text-gray-500 border-gray-200",
  Paused: "bg-amber-50 text-amber-700 border-amber-100",
};

export default function MyListingsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-20">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Listings</h1>
            <p className="text-[13px] text-gray-400 font-medium mt-0.5">{listings.length} items posted</p>
          </div>
          <Link href="/sell" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full text-[13px] md:text-[14px] font-bold flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap">
            + New Listing
          </Link>
        </div>

        {/* Thin Card List */}
        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-gray-100 rounded-2xl">
            <Tag className="w-10 h-10 text-gray-200 mb-4" />
            <h3 className="font-bold text-gray-900 mb-1">No listings yet</h3>
            <p className="text-gray-400 text-[14px] font-medium">Post your first item and reach verified students on campus.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {listings.map((l) => (
              <div key={l.id} className="bg-white border border-gray-100 rounded-[1.1rem] px-4 py-3.5 flex items-center gap-4 hover:border-gray-200 hover:shadow-sm transition-all">
                {/* Thumbnail */}
                <div className="w-12 h-12 bg-[#f8f9fa] rounded-xl overflow-hidden shrink-0">
                  <img src={l.imageSrc} alt={l.title} className="w-full h-full object-cover" />
                </div>

                {/* Core info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-[14px] md:text-[15px] truncate leading-snug">{l.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest truncate">{l.category}</p>
                    <span className="text-gray-200 text-[10px]">•</span>
                    <p className="text-[11px] font-bold text-gray-400 truncate">{l.condition}</p>
                    <span className="text-gray-200 text-[10px] hidden sm:block">•</span>
                    <p className="text-[11px] font-medium text-gray-400 hidden sm:block">{l.views} views</p>
                  </div>
                </div>

                {/* Price */}
                <div className="hidden sm:block shrink-0 text-right">
                  <span className="font-bold text-gray-900 text-[15px]">{l.price}</span>
                </div>

                {/* Status */}
                <div className="shrink-0">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusColor[l.status]}`}>{l.status}</span>
                </div>

                {/* View full detail */}
                <Link href={`/item/${l.id}`} className="shrink-0 p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
