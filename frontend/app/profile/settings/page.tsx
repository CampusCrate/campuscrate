"use client";

import Navbar from "../../../components/Navbar";
import { BadgeCheck, ShieldCheck, Bell, Lock, Trash2, ChevronRight } from "lucide-react";

const sections = [
  {
    heading: "Account",
    items: [
      { icon: <BadgeCheck className="w-5 h-5 text-blue-600" />, label: "Student ID Verification", sub: "Status: Verified", badge: "Active" },
      { icon: <Lock className="w-5 h-5 text-gray-500" />, label: "Change Password", sub: "Last changed 3 months ago" },
    ]
  },
  {
    heading: "Notifications",
    items: [
      { icon: <Bell className="w-5 h-5 text-gray-500" />, label: "Push Notifications", sub: "Manage what alerts you receive", toggle: true },
    ]
  },
  {
    heading: "Privacy & Safety",
    items: [
      { icon: <ShieldCheck className="w-5 h-5 text-gray-500" />, label: "Trust & Safety", sub: "Review our community guidelines" },
    ]
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 md:px-6 py-10">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-100">
          <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center text-gray-700 font-bold text-2xl shrink-0">W</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-1.5">wanjiku.s <BadgeCheck className="w-5 h-5 text-blue-600" /></h1>
            <p className="text-[14px] text-gray-500 font-medium">wanjiku@mmu.ac.ke</p>
            <button className="text-[13px] font-bold text-blue-800 hover:text-blue-900 mt-1 transition-colors">Edit profile photo</button>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((s, si) => (
            <div key={si}>
              <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">{s.heading}</h2>
              <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
                {s.items.map((item, ii) => (
                  <div key={ii} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <div className="shrink-0">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-[15px]">{item.label}</p>
                      {item.sub && <p className="text-[13px] text-gray-500 font-medium">{item.sub}</p>}
                    </div>
                    {item.badge && (
                      <span className="text-[12px] font-bold bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-full">{item.badge}</span>
                    )}
                    {item.toggle && (
                      <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer shrink-0">
                        <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></span>
                      </div>
                    )}
                    {!item.badge && !item.toggle && (
                      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Danger Zone */}
          <div>
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Danger Zone</h2>
            <div className="border border-red-100 rounded-2xl overflow-hidden bg-red-50/30">
              <button className="flex items-center gap-4 px-5 py-4 w-full text-left hover:bg-red-50 transition-colors">
                <Trash2 className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <p className="font-semibold text-red-600 text-[15px]">Delete Account</p>
                  <p className="text-[13px] text-red-400 font-medium">This action is permanent and cannot be undone</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
