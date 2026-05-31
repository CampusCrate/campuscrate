import Navbar from "../../components/Navbar";
import { Settings, School, LayoutGrid, ShieldAlert, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      <Navbar />
      
      <div className="max-w-[85rem] mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 px-4 md:px-6 py-8 md:py-12">
        {/* Sidebar */}
        <div className="w-full lg:w-[260px] shrink-0">
          <div className="mb-4 md:mb-6 px-2 md:px-4">
            <h2 className="text-[11px] md:text-[12px] font-bold text-gray-400 uppercase tracking-widest">Admin Dashboard</h2>
          </div>
          <nav className="flex flex-row overflow-x-auto lg:flex-col lg:overflow-visible space-x-2 lg:space-x-0 lg:space-y-1.5 pb-2 lg:pb-0 scrollbar-hide">
            <Link href="/admin" className="flex items-center gap-2 md:gap-3 px-4 py-3 bg-blue-50/80 text-blue-950 rounded-xl font-bold transition-colors shadow-sm border border-blue-100/50 whitespace-nowrap">
              <School className="w-4 h-4 md:w-5 md:h-5 text-blue-700" />
              Universities
            </Link>
            <Link href="/admin" className="flex items-center gap-2 md:gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:shadow-sm rounded-xl font-semibold transition-all border border-transparent hover:border-gray-200 whitespace-nowrap">
              <Settings className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              Global Settings
            </Link>
            <Link href="/admin" className="flex items-center gap-2 md:gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:shadow-sm rounded-xl font-semibold transition-all border border-transparent hover:border-gray-200 whitespace-nowrap">
              <LayoutGrid className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              Categories
            </Link>
            <Link href="/admin" className="flex items-center gap-2 md:gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:shadow-sm rounded-xl font-semibold transition-all border border-transparent hover:border-gray-200 whitespace-nowrap">
              <ShieldAlert className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              Trust & Safety
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
            <button className="bg-blue-950 hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-[13px] md:text-[14px] font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow-[0_4px_20px_-4px_rgba(30,58,138,0.3)] w-full sm:w-auto shrink-0">
              <Plus className="w-4 h-4" /> Add University
            </button>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-x-auto">
            <div className="min-w-[600px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-[11px] md:text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">Name</th>
                    <th className="px-6 py-4 text-[11px] md:text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">Identifier</th>
                    <th className="px-6 py-4 text-[11px] md:text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">Verified Students</th>
                    <th className="px-6 py-4 text-[11px] md:text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { name: "Multimedia University", id: "mmu", count: "3,402" },
                    { name: "Nairobi University", id: "uon", count: "8,921" },
                    { name: "Strathmore University", id: "strath", count: "2,104" },
                  ].map((uni) => (
                    <tr key={uni.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 w-1/3">
                        <span className="font-bold text-gray-900 text-[14px] md:text-[15px]">{uni.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] md:text-[12px] font-bold tracking-wider text-gray-500 bg-gray-100/80 border border-gray-200 px-2.5 py-1 rounded-md uppercase">{uni.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] md:text-[14px] font-bold text-gray-600">{uni.count}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
