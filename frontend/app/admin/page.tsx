"use client";

import Navbar from "../../components/Navbar";
import { Settings, School, LayoutGrid, ShieldAlert, MoreHorizontal, Plus, Loader2, AlertCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthProvider";
import { useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:8000/api/v1";

interface University {
  id: string;
  name: string;
  slug: string;
}

async function fetchUniversities(): Promise<University[]> {
  const res = await fetch(`${API_URL}/universities/`);
  if (!res.ok) throw new Error("Failed to fetch universities");
  return res.json();
}

async function createUniversity(data: { name: string; slug: string }): Promise<University> {
  const res = await fetch(`${API_URL}/universities/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create university");
  return res.json();
}

export default function AdminDashboard() {
  const { user, isPending: isAuthPending } = useAuth();
  const router = useRouter();
  
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [formError, setFormError] = useState("");

  const { data: universities = [], isLoading, isError } = useQuery({
    queryKey: ["universities"],
    queryFn: fetchUniversities,
  });

  useEffect(() => {
    if (!isAuthPending) {
      if (!user || !user.is_superuser) {
        router.push("/admin/login");
      }
    }
  }, [user, isAuthPending, router]);


  const mutation = useMutation({
    mutationFn: createUniversity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universities"] });
      setShowModal(false);
      setName("");
      setSlug("");
      setFormError("");
    },
    onError: (err: Error) => setFormError(err.message),
  });

  function handleNameChange(value: string) {
    setName(value);
    // Auto-generate slug from name
    setSlug(value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setFormError("Both name and identifier are required.");
      return;
    }
    mutation.mutate({ name: name.trim(), slug: slug.trim() });
  }

  if (isAuthPending || !user || !user.is_superuser) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      <Navbar />
      
      {/* Add University Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Add University</h2>
            <p className="text-[13px] text-gray-500 mb-5">This will be available system-wide for student selection.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">University Name</label>
                <input
                  type="text"
                  placeholder="e.g. Multimedia University"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Slug / Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. multimedia-university"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-mono text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
                />
              </div>
              {formError && (
                <p className="text-[13px] text-red-500 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {formError}
                </p>
              )}
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setFormError(""); }}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-[14px] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-1 bg-blue-950 hover:bg-blue-900 text-white font-bold py-2.5 rounded-xl text-[14px] flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                >
                  {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {mutation.isPending ? "Saving..." : "Add University"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-[85rem] mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 px-4 md:px-6 py-8 md:py-12">
        {/* Sidebar */}
        <div className="w-full lg:w-[260px] shrink-0">
          <div className="mb-4 md:mb-6 px-2 md:px-4">
            <h2 className="text-[11px] md:text-[12px] font-bold text-gray-400 uppercase tracking-widest">Admin Dashboard</h2>
          </div>
          <nav className="flex flex-row overflow-x-auto lg:flex-col lg:overflow-visible space-x-2 lg:space-x-0 lg:space-y-1.5 pb-2 lg:pb-0 scrollbar-hide">
            <Link href="/admin" className="flex items-center gap-2 md:gap-3 px-4 py-3 bg-blue-50/80 text-blue-950 rounded-xl font-bold transition-colors shadow-sm border border-blue-100/50 whitespace-nowrap">
              <School className="w-4 h-4 md:w-5 md:h-5 text-blue-700" />Universities
            </Link>
            <Link href="/admin" className="flex items-center gap-2 md:gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:shadow-sm rounded-xl font-semibold transition-all border border-transparent hover:border-gray-200 whitespace-nowrap">
              <Settings className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />Global Settings
            </Link>
            <Link href="/admin" className="flex items-center gap-2 md:gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:shadow-sm rounded-xl font-semibold transition-all border border-transparent hover:border-gray-200 whitespace-nowrap">
              <LayoutGrid className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />Categories
            </Link>
            <Link href="/admin" className="flex items-center gap-2 md:gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:shadow-sm rounded-xl font-semibold transition-all border border-transparent hover:border-gray-200 whitespace-nowrap">
              <ShieldAlert className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />Trust &amp; Safety
            </Link>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-tight">Universities</h1>
              <p className="text-[14px] md:text-[15px] text-gray-500 font-medium mt-1">Manage the preset list of universities available on Campus Crate.</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-950 hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-[13px] md:text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow-[0_4px_20px_-4px_rgba(30,58,138,0.3)] w-full sm:w-auto shrink-0"
            >
              <Plus className="w-4 h-4" /> Add University
            </button>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-x-auto">
            <div className="min-w-[600px]">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-[14px] font-medium">Loading universities...</span>
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  <p className="text-[14px] font-medium text-gray-500">Could not load universities. Check your backend connection.</p>
                </div>
              ) : universities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
                  <School className="w-8 h-8 text-gray-200" />
                  <p className="text-[15px] font-bold text-gray-900">No universities yet</p>
                  <p className="text-[13px] text-gray-500">Click "Add University" to get started.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-4 text-[11px] md:text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">Name</th>
                      <th className="px-6 py-4 text-[11px] md:text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">Slug</th>
                      <th className="px-6 py-4 text-[11px] md:text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {universities.map((uni) => (
                      <tr key={uni.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 w-1/2">
                          <span className="font-bold text-gray-900 text-[14px] md:text-[15px]">{uni.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] md:text-[12px] font-bold tracking-wider text-gray-500 bg-gray-100/80 border border-gray-200 px-2.5 py-1 rounded-md uppercase">{uni.slug}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
