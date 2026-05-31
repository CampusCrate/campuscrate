"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, ChevronDown, Check, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useUniversities } from "../../hooks/useUniversities";

function UniversitySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: universitiesData = [], isLoading } = useUniversities();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = universitiesData.find(u => u.slug === value);

  return (
    <div className="relative" ref={ref}>
      <button 
        type="button" 
        onClick={() => setOpen(!open)}
        className="w-full bg-[#f8f9fa] border border-transparent hover:border-gray-200 rounded-xl px-4 py-3.5 text-[15px] font-medium text-left flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white"
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {isLoading ? "Loading campuses..." : selected ? selected.name : "Select campus..."}
        </span>
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-gray-300" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {open && !isLoading && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {universitiesData.length === 0 ? (
            <p className="px-3 py-3 text-[13px] text-gray-400 font-medium text-center">No universities available yet.</p>
          ) : (
            universitiesData.map(u => (
              <button key={u.id} type="button" onClick={() => { onChange(u.slug); setOpen(false); }} className="w-full flex items-center justify-between px-3 py-2.5 text-[14px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {u.name}</span>
                {value === u.slug && <Check className="w-4 h-4 text-gray-900" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function SignupPage() {
  const [university, setUniversity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const pwMatch = password && confirmPassword && password === confirmPassword;

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-[26rem]">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to feed
        </Link>
        
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex flex-col gap-2 mb-8 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create an account</h1>
            <p className="text-[14px] text-gray-400 font-medium tracking-tight">Join your campus marketplace today.</p>
          </div>

          <button type="button" className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-[14px] py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all mb-6 relative overflow-hidden group">
            <svg className="w-5 h-5 absolute left-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.31-1 2.41-2.12 3.14v2.6h3.43c2.01-1.85 3.17-4.58 3.17-7.75Z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.43-2.6c-.98.66-2.23 1.05-3.85 1.05-2.96 0-5.46-2-6.36-4.69H2.07v2.68C3.89 20.4 7.64 23 12 23Z" fill="#34A853"/>
              <path d="M5.64 14.1c-.24-.7-.37-1.46-.37-2.1s.13-1.4.37-2.1V7.22H2.07C1.38 8.6 1 10.23 1 12s.38 3.4.11 4.78l3.53-2.68Z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.64 1 3.89 3.6 2.07 7.22l3.57 2.68c.9-2.69 3.4-4.52 6.36-4.52Z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-gray-100 flex-1"></div>
            <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Or email</span>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>
          
          <form className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">University</label>
              <UniversitySelect value={university} onChange={setUniversity} />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-[#f8f9fa] border border-transparent hover:border-gray-200 rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-transparent hover:border-gray-200 rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
              />
              
              {/* Password Criteria Checklist */}
              {password.length > 0 && (
                <div className="mt-3 bg-[#f8f9fa] p-3 rounded-xl border border-gray-100 space-y-1.5 animate-in fade-in zoom-in-95 duration-200">
                  <div className={`flex items-center gap-2 text-[12px] font-medium transition-colors ${hasMinLength ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasMinLength ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />} At least 8 characters
                  </div>
                  <div className={`flex items-center gap-2 text-[12px] font-medium transition-colors ${hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasNumber ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />} Contains a number
                  </div>
                  <div className={`flex items-center gap-2 text-[12px] font-medium transition-colors ${hasSpecial ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasSpecial ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />} Contains a special character
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Confirm Password</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-[#f8f9fa] border ${confirmPassword.length > 0 && !pwMatch ? 'border-red-300 focus:ring-red-500 hover:border-red-400' : 'border-transparent hover:border-gray-200 focus:ring-gray-900'} rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-900 focus:outline-none focus:ring-2 focus:bg-white transition-all`}
              />
              {confirmPassword.length > 0 && !pwMatch && (
                <p className="text-[12px] font-bold text-red-500 mt-2">Passwords do not match.</p>
              )}
            </div>
            
            <button 
              type="button"
              className="w-full bg-gray-900 hover:bg-black text-white font-bold text-[15px] py-4 rounded-xl transition-all shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!(hasMinLength && hasNumber && hasSpecial && pwMatch)}
            >
              Sign up
            </button>
          </form>
          
          <p className="mt-8 text-center text-[13px] text-gray-400 font-medium">
            Already have an account? <Link href="/login" className="text-gray-900 font-bold hover:underline transition-all">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
