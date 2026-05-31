"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, User, Menu, X, ChevronDown, BadgeCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";

const profileLinks: [string, string][] = [
  ["My Listings", "/profile/listings"],
  ["Saved Items", "/profile/saved"],
  ["Settings", "/profile/settings"],
];

function ProfileModal({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-black/10 backdrop-blur-[2px]" onClick={onClose}>
      <div ref={ref} className="w-72 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#f8f9fa] flex items-center justify-center text-gray-700 font-bold text-lg">W</div>
            <div>
              <h3 className="font-bold text-gray-900 text-[15px] flex items-center gap-1.5">wanjiku.s <BadgeCheck className="w-4 h-4 text-blue-600" /></h3>
              <p className="text-[13px] text-gray-500 font-medium">Verified Student</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[12px] font-bold text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> ID Verified
          </div>
        </div>
        <div className="py-2">
          {profileLinks.map(([label, href]) => (
            <Link key={label} href={href} onClick={onClose} className="block w-full text-left px-5 py-3 text-[14px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              {label}
            </Link>
          ))}
        </div>
        <div className="border-t border-gray-100 p-2">
          <button className="w-full text-left px-5 py-3 text-[14px] font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors">Sign Out</button>
        </div>
      </div>
    </div>
  );
}

function NotificationsModal({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const notifications = [
    { title: "kelvin.m wants to buy your Lab Coat", time: "2 min ago", unread: true },
    { title: "Your listing 'FX-991ES' got 5 views", time: "1 hr ago", unread: true },
    { title: "New listings in Engineering Gear", time: "3 hrs ago", unread: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-black/10 backdrop-blur-[2px]" onClick={onClose}>
      <div ref={ref} className="w-80 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-[15px]">Notifications</h3>
          <button className="text-[12px] font-bold text-blue-800 hover:text-blue-900">Mark all read</button>
        </div>
        <div className="divide-y divide-gray-50">
          {notifications.map((n, i) => (
            <div key={i} className={`px-5 py-4 flex items-start gap-3 ${n.unread ? "bg-blue-50/40" : "bg-white"}`}>
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.unread ? "bg-blue-600" : "bg-gray-200"}`}></div>
              <div>
                <p className={`text-[13.5px] leading-snug ${n.unread ? "font-semibold text-gray-900" : "font-medium text-gray-600"}`}>{n.title}</p>
                <p className="text-[12px] text-gray-400 font-medium mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 px-5 py-3">
          <button className="text-[13px] font-bold text-gray-600 hover:text-gray-900 w-full text-center">View all notifications</button>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <nav className="border-b border-gray-100 bg-white px-4 md:px-6 py-4 shrink-0 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 bg-gray-900 rounded-[0.4rem] flex items-center justify-center text-white font-bold group-hover:bg-black transition-colors">
              <div className="w-3.5 h-3.5 bg-white shadow-sm" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, 20% 20%, 20% 80%, 80% 80%, 80% 20%, 0 20%)" }}></div>
            </div>
            <span className="font-bold text-[1.1rem] md:text-xl text-gray-900 tracking-tight">CampusCrate</span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-4 md:gap-6">
            <button onClick={() => { setShowNotifications(v => !v); setShowProfile(false); }} className="relative text-gray-400 hover:text-gray-900 transition-colors p-1">
              <Bell className="w-[22px] h-[22px]" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-600 rounded-full"></span>
            </button>
            <button onClick={() => { setShowProfile(v => !v); setShowNotifications(false); }} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-900 transition-colors p-1">
              <User className="w-[22px] h-[22px]" />
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <Link href="/sell" className="ml-1 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full text-[14px] font-bold flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap">
              + Sell
            </Link>
          </div>

          {/* Mobile: Sell + Hamburger */}
          <div className="flex sm:hidden items-center gap-3">
            <Link href="/sell" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-[13px] font-bold transition-colors shadow-sm whitespace-nowrap">
              + Sell
            </Link>
            <button onClick={() => setMobileOpen(v => !v)} className="p-1 text-gray-700 hover:text-gray-900 transition-colors">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-gray-100 mt-4 pt-4 pb-2 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
            <button onClick={() => { setShowNotifications(true); setMobileOpen(false); }} className="w-full flex items-center gap-3 px-2 py-3 text-gray-700 font-semibold hover:bg-gray-50 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-gray-400" /> Notifications
              <span className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></span>
            </button>
            <button onClick={() => { setShowProfile(true); setMobileOpen(false); }} className="w-full flex items-center gap-3 px-2 py-3 text-gray-700 font-semibold hover:bg-gray-50 rounded-xl transition-colors">
              <User className="w-5 h-5 text-gray-400" /> Profile
            </button>
          </div>
        )}
      </nav>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
    </>
  );
}
