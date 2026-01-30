import React from "react";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  return (
    <section className="bg-[#1A1F2B] py-24 lg:py-32 text-center relative overflow-hidden">
      {/* Background Subtle Pattern/Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#C9A961]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 max-w-4xl relative z-10 space-y-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
          Ready to Transform Your Home?
        </h2>
        <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          Customize your flooring project and get your online estimate today — fast, 
          simple, and obligation-free.
        </p>
        <div className="pt-4">
          <button className="bg-white hover:bg-gray-100 text-[#1A1F2B] font-black px-10 py-6 rounded-2xl text-lg flex items-center justify-center gap-3 mx-auto transition-all shadow-xl hover:-translate-y-1 active:scale-95 group">
            Get My Online Quote
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
