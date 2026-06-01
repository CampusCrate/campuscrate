"use client";

import Navbar from "../../../components/Navbar";
import { Tag, ChevronRight, BadgeCheck, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/AuthProvider";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const statusColor: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700 border-green-100",
  SOLD: "bg-gray-100 text-gray-500 border-gray-200",
  PAUSED: "bg-amber-50 text-amber-700 border-amber-100",
};

export default function MyListingsPage() {
  const { user, isPending } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchListings = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_URL}/api/v1/listings/?seller=${user.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setListings(data.results || data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, isPending]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/v1/listings/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
      toast.success("Status updated!");
    } catch (e) {
      toast.error("Could not update status");
    }
  };

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

        {loading || isPending ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-gray-100 rounded-2xl">
            <Tag className="w-10 h-10 text-gray-200 mb-4" />
            <h3 className="font-bold text-gray-900 mb-1">No listings yet</h3>
            <p className="text-gray-400 text-[14px] font-medium">Post your first item and reach verified students on campus.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {listings.map((l) => {
              const mainImage = l.images && l.images.length > 0 ? l.images[0].image_url : "https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=600&auto=format&fit=crop";
              const catName = l.category?.name || "Unknown";
              const isDropdownOpen = openDropdownId === l.id;
              
              return (
              <div key={l.id} className="bg-white border border-gray-100 rounded-[1.1rem] px-4 py-3.5 flex items-center gap-4 hover:border-gray-200 hover:shadow-sm transition-all relative">
                {/* Thumbnail */}
                <div className="w-12 h-12 bg-[#f8f9fa] rounded-xl overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mainImage} alt={l.title} className="w-full h-full object-cover" />
                </div>

                {/* Core info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-[14px] md:text-[15px] truncate leading-snug">{l.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest truncate">{catName}</p>
                    <span className="text-gray-200 text-[10px]">•</span>
                    <p className="text-[11px] font-bold text-gray-400 truncate">{l.condition || "GOOD"}</p>
                    <span className="text-gray-200 text-[10px] hidden sm:block">•</span>
                    <p className="text-[11px] font-medium text-gray-400 hidden sm:block">{l.views_count || 0} views</p>
                  </div>
                </div>

                {/* Price */}
                <div className="hidden sm:block shrink-0 text-right mr-2">
                  <span className="font-bold text-gray-900 text-[15px]">KES {parseFloat(l.price || "0").toLocaleString()}</span>
                </div>

                {/* Status Control */}
                <div className="shrink-0 relative">
                  <button 
                    onClick={() => setOpenDropdownId(isDropdownOpen ? null : l.id)}
                    className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border cursor-pointer outline-none transition-colors ${statusColor[l.status] || statusColor.ACTIVE}`}
                  >
                    {l.status === 'ACTIVE' ? 'Active' : l.status === 'PAUSED' ? 'Paused' : 'Sold'}
                    <svg className={`w-3 h-3 current-color transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-20 py-1.5 animate-in fade-in zoom-in-95 duration-200">
                      {["ACTIVE", "PAUSED", "SOLD"].map(st => (
                        <button 
                          key={st}
                          onClick={() => {
                            handleStatusChange(l.id, st);
                            setOpenDropdownId(null);
                          }}
                          className={`w-full text-left px-4 py-2 text-[12px] font-bold transition-colors flex items-center justify-between ${l.status === st ? 'text-gray-900 bg-gray-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                          {st === "ACTIVE" ? "Active" : st === "PAUSED" ? "Paused" : "Sold"}
                          {l.status === st && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* View full detail */}
                <Link href={`/item/${l.id}`} className="shrink-0 p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors ml-1">
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )})}
          </div>
        )}
      </main>
    </div>
  );
}
