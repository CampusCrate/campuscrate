"use client";

import Navbar from "../../../components/Navbar";
import { Bookmark } from "lucide-react";
import ListingCard from "../../../components/ListingCard";
import { useSavedListings } from "../../../hooks/useSavedListings";

export default function SavedItemsPage() {
  const { savedItems } = useSavedListings();

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Saved Items</h1>
          <p className="text-[14px] text-gray-500 font-medium mt-1">Items you've bookmarked across the platform</p>
        </div>

        {savedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Bookmark className="w-10 h-10 text-gray-200 mb-4" />
            <h3 className="font-bold text-gray-900 mb-1">Nothing saved yet</h3>
            <p className="text-gray-400 text-[14px] font-medium">Bookmark items from the feed to keep track of them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
            {savedItems.map((item) => (
              <ListingCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
