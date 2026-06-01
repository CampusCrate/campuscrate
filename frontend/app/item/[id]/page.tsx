"use client";

import Navbar from "../../../components/Navbar";
import { BadgeCheck, MapPin, ArrowLeft, Copy, Check, Phone, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ItemDetail() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/listings/${id}/`);
        if (!res.ok) throw new Error("Item not found");
        const json = await res.json();
        setData(json);
      } catch (err) {
        toast.error("Could not load listing details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id]);

  const handleCopy = () => {
    if (!data?.seller?.phone_number) return;
    navigator.clipboard.writeText(data.seller.phone_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold mb-4">Item not found</h1>
        <Link href="/" className="text-blue-600 font-bold hover:underline">Back to feed</Link>
      </div>
    );
  }

  const sellerPhone = data.seller?.phone_number;
  const sellerInitial = data.seller?.username?.charAt(0).toUpperCase() || "U";
  const mainImage = data.images && data.images[activeImage] ? data.images[activeImage].image_url : "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1200";

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900 pb-20 overflow-x-hidden">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] md:text-[13px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 mb-6 md:mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to feed
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          {/* Images */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-[4/3] bg-[#f8f9fa] rounded-2xl md:rounded-[2rem] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mainImage} className="w-full h-full object-cover" alt={data.title} />
            </div>
            {data.images && data.images.length > 1 && (
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {data.images.map((img: any, idx: number) => (
                  <button key={idx} onClick={() => setActiveImage(idx)} className={`w-20 h-20 md:w-24 md:h-24 shrink-0 bg-[#f8f9fa] rounded-xl md:rounded-2xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border-2 ${activeImage === idx ? 'border-gray-900' : 'border-transparent'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.image_url} className="w-full h-full object-cover" alt="Thumbnail" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Details */}
          <div className="flex flex-col pt-0 md:pt-2">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <p className="text-[10px] md:text-[11px] font-bold tracking-widest text-gray-400 uppercase">{data.category?.name || "Other"}</p>
              <span className="text-[10px] md:text-[11px] text-gray-300">•</span>
              <p className="text-[10px] md:text-[11px] font-bold tracking-widest text-gray-400 uppercase">{data.condition || "GOOD"}</p>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-[1.2] mb-4 md:mb-6 tracking-tight break-words">
              {data.title}
            </h1>
            
            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">KES {parseFloat(data.price).toLocaleString()}</div>

            {/* Seller info */}
            <div className="flex flex-col gap-4 py-6 md:py-8 border-y border-gray-100 mb-6 md:mb-8">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-[#f8f9fa] rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">
                  {sellerInitial}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-[15px] md:text-[16px] flex items-center gap-1.5 truncate">
                    {data.seller?.username} {data.seller?.is_verified_student && <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" />}
                  </h3>
                  <div className="text-[13px] md:text-[14px] text-gray-500 font-medium truncate">{data.seller?.university?.name || "Student"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[13px] md:text-[14px] text-gray-500 font-medium bg-[#f8f9fa] w-full md:w-fit px-3 py-1.5 rounded-[0.4rem] truncate">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" /> Meetup: {data.meetup_location}
              </div>
            </div>

            {/* Contact Action */}
            <div className="mb-8 md:mb-10">
              {sellerPhone ? (
              <div className="w-full bg-[#f8f9fa] border border-gray-200 p-4 md:p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 md:p-2.5 rounded-lg border border-gray-100 shadow-sm">
                    <Phone className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-[12px] md:text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Phone Number</p>
                    <p className="text-[16px] md:text-[18px] font-bold text-gray-900">{sellerPhone}</p>
                  </div>
                </div>
                <button 
                  onClick={handleCopy}
                  className="w-full md:w-auto bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-[13px] md:text-[14px] py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? <span className="text-green-600">Copied!</span> : "Copy Number"}
                </button>
              </div>
              ) : (
                <div className="w-full bg-red-50 border border-red-100 text-red-600 p-4 md:p-5 rounded-xl text-sm font-medium">
                  The seller has not configured a contact number for this item.
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-[12px] md:text-[13px] font-bold text-gray-900 mb-3 tracking-widest uppercase">Description</h3>
              <div className="text-[14px] md:text-[15.5px] text-gray-600 leading-[1.7] space-y-4 font-medium max-w-[40rem] break-words whitespace-pre-wrap">
                {data.description}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
