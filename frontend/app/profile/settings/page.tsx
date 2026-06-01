"use client";

import Navbar from "../../../components/Navbar";
import { BadgeCheck, Phone, Save, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "../../../lib/AuthProvider";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SettingsPage() {
  const { user, isPending, updateUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.phone_number) {
      setPhoneNumber(user.phone_number);
    }
  }, [user]);

  const handleSaveContact = async () => {
    if (!phoneNumber) {
      toast.error("Phone number cannot be empty.");
      return;
    }
    setIsSaving(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/v1/auth/me/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ phone_number: phoneNumber })
      });
      if (!res.ok) throw new Error("Failed to update profile");
      
      updateUser({ phone_number: phoneNumber });
      toast.success("Contact info updated successfully.");
    } catch (e) {
      toast.error("An error occurred while saving your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-20">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 md:px-6 py-10">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-100">
          <div className="w-16 h-16 bg-[#e9ecef] rounded-full flex items-center justify-center text-gray-700 font-bold text-2xl shrink-0 uppercase">
            {user?.username?.charAt(0) || "U"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-1.5">
              {user?.username || "Guest"} {user?.is_verified_student && <BadgeCheck className="w-5 h-5 text-blue-600" />}
            </h1>
            <p className="text-[14px] text-gray-500 font-medium">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Profile Details Block */}
          <div>
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Contact Details</h2>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <label className="block text-[13px] font-bold text-gray-800 mb-2">Primary Phone Number</label>
              <p className="text-[12px] text-gray-400 mb-4 font-medium">This number will be shown directly on your item listings so buyers can reach you. Provide a valid WhatsApp or calling line.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                  <input 
                    type="text" 
                    value={phoneNumber} 
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +254 712 345 678" 
                    className="w-full border border-gray-200 rounded-xl pl-10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-500 transition-all text-gray-900 font-medium text-[14px]" 
                  />
                </div>
                <button 
                  onClick={handleSaveContact} 
                  disabled={isSaving}
                  className="bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div>
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Danger Zone</h2>
            <div className="border border-red-100 rounded-2xl overflow-hidden bg-red-50/30 shadow-sm">
              <button 
                onClick={() => toast.error("Account deletion is restricted in this demo.")}
                className="flex items-center gap-4 px-5 py-4 w-full text-left hover:bg-red-50 transition-colors"
               >
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
