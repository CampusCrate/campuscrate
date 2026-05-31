"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import CustomSelect from "./CustomSelect";

export default function Hero() {
  const [university, setUniversity] = useState("mmu");
  
  const uniOptions = [
    { label: "Multimedia University", value: "mmu" },
    { label: "Nairobi University", value: "uon" },
    { label: "Strathmore University", value: "strath" }
  ];

  return (
    <section className="py-12 md:py-20 px-6 max-w-7xl mx-auto">
      <div className="max-w-3xl">
        <h1 className="text-3xl md:text-[2.5rem] lg:text-[2.5rem] font-bold text-gray-900 tracking-tight leading-[1.15] mb-4 md:mb-5">
          Buy & sell on campus, <br className="hidden lg:block"/>
          <span className="text-blue-900">peer-to-peer.</span>
        </h1>
        
        <p className="text-[1rem] md:text-[1.1rem] text-gray-500 mb-8 max-w-2xl leading-relaxed">
          From lab coats to laptops — find what you need from fellow students, just a hostel away.
        </p>

        <div className="bg-white p-2 md:p-1.5 rounded-3xl md:rounded-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-200 flex flex-col md:flex-row md:items-center mb-8 max-w-[42rem] relative hover:shadow-[0_4px_20px_-3px_rgba(0,0,0,0.1)] transition-shadow">
          <div className="flex items-center flex-1 px-2 md:px-0 mb-2 md:mb-0">
            <Search className="text-gray-400 w-5 h-5 md:ml-4 shrink-0" />
            <input 
              type="text" 
              placeholder="Find lab coats, textbooks..." 
              className="flex-1 py-3 px-3 text-[14px] md:text-[15px] focus:outline-none bg-transparent placeholder:text-gray-400 font-medium text-gray-800"
            />
          </div>
          <div className="flex items-center border-t md:border-t-0 md:border-l border-gray-100 md:border-gray-200 pt-2 md:pt-0 ml-1 md:ml-2 px-1 md:px-3 shrink-0">
            <CustomSelect 
              variant="ghost"
              options={uniOptions}
              value={university}
              onChange={setUniversity}
              icon={<MapPin className="w-[18px] h-[18px]" />}
            />
          </div>
          <button className="bg-blue-950 hover:bg-blue-900 text-white px-8 py-3.5 md:py-3 mt-2 md:mt-0 rounded-2xl md:rounded-full font-semibold transition-colors shrink-0 shadow-sm md:ml-2 w-full md:w-auto">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
