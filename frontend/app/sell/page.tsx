"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import { UploadCloud, ShieldCheck, MapPin, ChevronRight, ChevronLeft, Camera, Info, Tag } from "lucide-react";
import Link from "next/link";
import CustomSelect from "../../components/CustomSelect";

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [meetupType, setMeetupType] = useState("on-campus");
  const totalSteps = 3;

  const handleNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const categoryOptions = [
    { label: "Science & Tech", value: "science" },
    { label: "Engineering", value: "engineering" },
    { label: "Textbooks", value: "textbooks" },
    { label: "Electronics", value: "electronics" },
    { label: "Apparel", value: "apparel" },
    { label: "Other", value: "other" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      <Navbar />
      <main className="max-w-[42rem] mx-auto px-6 py-10">
        
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest">Step {step} of {totalSteps}</span>
            <span className="text-[13px] font-bold text-gray-900 uppercase tracking-widest">
              {step === 1 ? "Basics" : step === 2 ? "Pricing & Details" : "Photos & Location"}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gray-900 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
          </div>
        </div>

        {/* Wizard Form */}
        <div className="bg-white border border-gray-200/80 rounded-[1.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative min-h-[500px] flex flex-col">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-[15px] duration-500 flex-1">
              <div className="mb-8 flex items-center gap-3.5">
                <div className="p-3 bg-[#f8f9fa] rounded-[0.85rem]"><Tag className="w-5 h-5 text-gray-500" /></div>
                <div>
                  <h2 className="text-[1.35rem] font-bold text-gray-900 tracking-tight mb-0.5">Let's start with the basics</h2>
                  <p className="text-[14.5px] text-gray-500 font-medium">What exactly are you selling to your fellow students?</p>
                </div>
              </div>

              <div className="space-y-7">
                <div>
                  <label className="block text-[14px] font-bold text-gray-800 mb-2">Title</label>
                  <input type="text" placeholder="e.g. TI-30 Calculator, Almost New" className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500 transition-all text-gray-900 placeholder:text-gray-400 font-medium text-[15px]" />
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-gray-800 mb-2">Category</label>
                  <CustomSelect 
                    options={categoryOptions}
                    value={category}
                    onChange={setCategory}
                    placeholder="Select a category..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-[15px] duration-500 flex-1">
              <div className="mb-8 flex items-center gap-3.5">
                <div className="p-3 bg-[#f8f9fa] rounded-[0.85rem]"><Info className="w-5 h-5 text-gray-500" /></div>
                <div>
                  <h2 className="text-[1.35rem] font-bold text-gray-900 tracking-tight mb-0.5">Pricing and Details</h2>
                  <p className="text-[14.5px] text-gray-500 font-medium">Give buyers the information they need.</p>
                </div>
              </div>

              <div className="space-y-7">
                <div>
                  <label className="block text-[14px] font-bold text-gray-800 mb-2">Price (KES)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">KES</span>
                    <input type="number" placeholder="1,500" className="w-full border border-gray-200 rounded-xl pl-14 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500 transition-all text-gray-900 placeholder:text-gray-400 font-medium text-[15px]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-gray-800 mb-2">Description</label>
                  <textarea rows={6} placeholder="Any details the buyer should know? E.g. Missing original box, barely used, comes with charger..." className="w-full border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500 transition-all text-gray-900 resize-none placeholder:text-gray-400 font-medium text-[15px]"></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-[15px] duration-500 flex-1">
              <div className="mb-8 flex items-center gap-3.5">
                <div className="p-3 bg-[#f8f9fa] rounded-[0.85rem]"><Camera className="w-5 h-5 text-gray-500" /></div>
                <div>
                  <h2 className="text-[1.35rem] font-bold text-gray-900 tracking-tight mb-0.5">Photos & Meetup</h2>
                  <p className="text-[14.5px] text-gray-500 font-medium">Show it off and set a convenient campus meetup.</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-[14px] font-bold text-gray-800 mb-2">Item Photos</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-[#f8f9fa] transition-colors cursor-pointer group bg-[#f8f9fa]/50">
                    <div className="w-12 h-12 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-900 transition-transform">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-gray-900 mb-1">Click or drag images here</p>
                    <p className="text-[14px] text-gray-400 font-medium">Upload up to 4 photos. Well-lit photos sell faster!</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-gray-800 mb-3">Meetup Type</label>
                  <div className="flex bg-[#f8f9fa] border border-gray-200/80 rounded-[0.8rem] p-1.5 mb-5">
                    <button type="button" onClick={() => setMeetupType('on-campus')} className={`flex-1 py-2 text-[14px] font-bold rounded-lg transition-all ${meetupType === 'on-campus' ? 'bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>On-Campus</button>
                    <button type="button" onClick={() => setMeetupType('off-campus')} className={`flex-1 py-2 text-[14px] font-bold rounded-lg transition-all ${meetupType === 'off-campus' ? 'bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Off-Campus</button>
                  </div>

                  <label className="block text-[14px] font-bold text-gray-800 mb-2">Detailed Meetup Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <input type="text" placeholder={meetupType === 'on-campus' ? "e.g. Main library entrance, Block C lobby..." : "e.g. Ongata Rongai, near the mall..."} className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500 transition-all text-gray-900 placeholder:text-gray-400 font-medium text-[15px]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-8 mt-auto border-t border-gray-100 flex items-center justify-between">
            {step > 1 ? (
              <button type="button" onClick={handlePrev} className="px-6 py-3.5 rounded-xl font-bold flex items-center gap-1.5 text-gray-500 hover:bg-[#f8f9fa] hover:text-gray-900 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div></div> /* Spacer */
            )}

            {step < totalSteps ? (
              <button type="button" onClick={handleNext} className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-[0.85rem] font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <Link href="/" className="bg-gray-900 hover:bg-black text-white px-10 py-3.5 rounded-[0.85rem] font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]">
                Submit Listing
              </Link>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}
