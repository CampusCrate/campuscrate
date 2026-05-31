import { FlaskConical, PenTool, SquareStack, BookOpen, Laptop, Shirt } from "lucide-react";

export default function Categories() {
  const categories = [
    { name: "Science & Tech", icon: <FlaskConical className="w-4 h-4" />, count: "124" },
    { name: "Engineering", icon: <PenTool className="w-4 h-4" />, count: "87" },
    { name: "Textbooks", icon: <BookOpen className="w-4 h-4" />, count: "156" },
    { name: "Electronics", icon: <Laptop className="w-4 h-4" />, count: "92" },
    { name: "Apparel", icon: <Shirt className="w-4 h-4" />, count: "64" },
    { name: "Other", icon: <SquareStack className="w-4 h-4" />, count: "203" },
  ];

  return (
    <section className="px-6 max-w-7xl mx-auto py-8 border-t border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[1.1rem] font-bold text-gray-900 tracking-tight">Browse by category</h2>
        <a href="#" className="text-[13px] font-semibold text-blue-900 hover:text-blue-800 transition-colors">View all</a>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {categories.map((cat, idx) => (
          <a key={idx} href="#" className="border border-gray-200/80 rounded-xl px-3 py-3 hover:border-gray-300 hover:bg-gray-50 transition-all group bg-white flex flex-col items-start gap-2">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-900 group-hover:bg-blue-100 transition-colors shrink-0">
              {cat.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-[12px] leading-snug">{cat.name}</h3>
              <p className="text-[11px] text-gray-400 font-medium">{cat.count} listings</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
