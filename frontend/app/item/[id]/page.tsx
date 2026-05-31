import Navbar from "../../../components/Navbar";
import { BadgeCheck, MapPin, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ItemDetail() {
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
              <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Product" />
            </div>
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {[1, 2, 3].map((_, idx) => (
                <div key={idx} className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-[#f8f9fa] rounded-xl md:rounded-2xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                   <img src={`https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=200&auto=format&fit=crop&sig=${idx}`} className="w-full h-full object-cover" alt="Thumbnail" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Details */}
          <div className="flex flex-col pt-0 md:pt-2">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <p className="text-[10px] md:text-[11px] font-bold tracking-widest text-gray-400 uppercase">Engineering Gear</p>
              <span className="text-[10px] md:text-[11px] text-gray-300">•</span>
              <p className="text-[10px] md:text-[11px] font-bold tracking-widest text-gray-400 uppercase">Like New</p>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-[1.2] mb-4 md:mb-6 tracking-tight break-words">
              Casio FX-991ES Plus Scientific Calculator
            </h1>
            
            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">KES 1,800</div>

            {/* Ultra minimal seller info */}
            <div className="flex flex-col gap-4 py-6 md:py-8 border-y border-gray-100 mb-6 md:mb-8">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-[#f8f9fa] rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">
                  K
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-[15px] md:text-[16px] flex items-center gap-1.5 truncate">
                    kelvin.m <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  </h3>
                  <div className="text-[13px] md:text-[14px] text-gray-500 font-medium truncate">Multimedia University</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[13px] md:text-[14px] text-gray-500 font-medium bg-[#f8f9fa] w-full md:w-fit px-3 py-1.5 rounded-[0.4rem] truncate">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" /> Meetup: Off-Campus, Ongata
              </div>
            </div>

            <button className="w-full bg-gray-900 hover:bg-black text-white font-bold text-[1rem] md:text-[1.1rem] py-3.5 md:py-4 rounded-xl flex items-center justify-center gap-2 transition-all mb-8 md:mb-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]">
              <MessageCircle className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" />
              Message Seller
            </button>

            {/* Minimal Description */}
            <div>
              <h3 className="text-[12px] md:text-[13px] font-bold text-gray-900 mb-3 tracking-widest uppercase">Description</h3>
              <div className="text-[14px] md:text-[15.5px] text-gray-600 leading-[1.7] space-y-4 font-medium max-w-[40rem] break-words">
                <p>Selling my Casio scientific calculator used for one semester in Engineering math. Fully functional, all buttons are snappy and screen is perfect. No scratches. Comes with the hard slide-on case.</p>
                <p>Just upgraded to a graphing calculator so I no longer need this one.</p>
                <p>Available to meet up anywhere around Main Campus on weekdays after 2 PM.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
