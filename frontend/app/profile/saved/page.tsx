import Navbar from "../../../components/Navbar";
import { Heart } from "lucide-react";
import Link from "next/link";

const saved = [
  { title: "Complete Drawing Kit", price: "KES 2,500", location: "Multimedia University", imageSrc: "https://images.unsplash.com/photo-1509653066348-18e479cddecf?q=80&w=600&auto=format&fit=crop" },
  { title: "JBL Clip 3 Bluetooth Speaker", price: "KES 2,900", location: "Strathmore University", imageSrc: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&auto=format&fit=crop" },
];

export default function SavedItemsPage() {
  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Saved Items</h1>
          <p className="text-[14px] text-gray-500 font-medium mt-1">Items you've hearted across the platform</p>
        </div>

        {saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart className="w-10 h-10 text-gray-200 mb-4" />
            <h3 className="font-bold text-gray-900 mb-1">Nothing saved yet</h3>
            <p className="text-gray-400 text-[14px] font-medium">Heart items from the feed to keep track of them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {saved.map((item, i) => (
              <Link key={i} href="/item/1" className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-[#f8f9fa] overflow-hidden">
                  <img src={item.imageSrc} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-[14px] leading-snug mb-1">{item.title}</h3>
                  <p className="font-bold text-gray-900">{item.price}</p>
                  <p className="text-[12px] text-gray-400 font-medium mt-1">{item.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
