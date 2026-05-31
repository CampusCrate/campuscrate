"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import { UploadCloud, ShieldCheck, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const { data: sessionData, isPending } = useSession();
  const user = sessionData?.user;
  const router = useRouter();

  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idFront || !idBack) return;
    
    setLoading(true);
    
    // In a real application, you would upload to AWS S3/Cloudinary then post the URL to your Django backend
    // Since this is just a quick frontend scaffold simulation for the backend:
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (isPending) return null;

  // If unauthenticated, they shouldn't see this page ideally, or it drops them to login
  if (!user) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      <Navbar />
      <main className="max-w-[38rem] mx-auto px-6 py-12">
        
        {user.is_verified_student ? (
          <div className="bg-white border border-green-200/80 rounded-[1.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
             <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
             </div>
             <h2 className="text-[1.35rem] font-bold text-gray-900 tracking-tight mb-2">You are verified!</h2>
             <p className="text-[14.5px] text-gray-500 font-medium mb-6">Your university student ID has been approved. You now have the verified badge on your profile.</p>
             <Link href="/" className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-[0.85rem] font-bold flex items-center justify-center shadow-sm transition-all hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]">
                Back to Home
             </Link>
          </div>
        ) : success ? (
          <div className="bg-white border border-blue-200/80 rounded-[1.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-blue-600" />
             </div>
             <h2 className="text-[1.35rem] font-bold text-gray-900 tracking-tight mb-2">Documents Submitted</h2>
             <p className="text-[14.5px] text-gray-500 font-medium mb-6">Your student ID is under review. Our team will verify your documents within 24 hours.</p>
             <Link href="/" className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-[0.85rem] font-bold flex items-center justify-center shadow-sm transition-all hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]">
                Return to Home
             </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200/80 rounded-[1.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
            <div className="mb-8 flex items-center gap-3.5">
              <div className="p-3 bg-blue-50 rounded-[0.85rem]"><ShieldCheck className="w-5 h-5 text-blue-600" /></div>
              <div>
                <h2 className="text-[1.35rem] font-bold text-gray-900 tracking-tight mb-0.5">Verify your status</h2>
                <p className="text-[14.5px] text-gray-500 font-medium">Upload your valid university ID to get verified.</p>
              </div>
            </div>

            <div className="space-y-6">
              
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3 text-orange-800">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-[13.5px] font-medium leading-relaxed">Ensure all text on the ID is clearly visible. The name on the ID must match your profile name.</p>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-gray-800 mb-2">Front of ID</label>
                <label className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-[#f8f9fa] transition-colors cursor-pointer group bg-[#f8f9fa]/50">
                  <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-900 transition-transform">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <p className="font-bold text-gray-900 mb-1">{idFront ? idFront.name : "Upload front side"}</p>
                  <p className="text-[13px] text-gray-400 font-medium">JPEG, PNG up to 5MB</p>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setIdFront(e.target.files?.[0] || null)} />
                </label>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-gray-800 mb-2">Back of ID</label>
                <label className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-[#f8f9fa] transition-colors cursor-pointer group bg-[#f8f9fa]/50">
                  <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-900 transition-transform">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <p className="font-bold text-gray-900 mb-1">{idBack ? idBack.name : "Upload back side"}</p>
                  <p className="text-[13px] text-gray-400 font-medium">JPEG, PNG up to 5MB</p>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setIdBack(e.target.files?.[0] || null)} />
                </label>
              </div>

            </div>

            <div className="pt-8 mt-8 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={!idFront || !idBack || loading}
                className="w-full bg-gray-900 disabled:bg-gray-400 hover:bg-black text-white px-8 py-3.5 rounded-[0.85rem] font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]">
                {loading ? "Submitting..." : "Submit for Verification"} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
          </form>
        )}
      </main>
    </div>
  );
}
