import React from "react";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export const Navbar = () => {
  return (
    <>
      {" "}
      <div className="bg-[#C9A961] text-black py-2.5 px-4 text-center font-black text-[11px] sm:text-[13px] tracking-[0.15em] uppercase shadow-md relative z-60">
        🔥 Thicker is Better! Get 8.5mm planks for the price of 5mm 🔥
      </div>{" "}
      <nav className="bg-[#1A1A1A]/90 backdrop-blur-md border-b border-white/5 py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-12 max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-1">
              <span className="text-[#C9A961] font-extrabold text-2xl tracking-tighter">
                ALPHA
              </span>
              <span className="text-white font-bold text-2xl tracking-tighter">
                FLOORING
              </span>
            </div>

            <Link
              to="#"
              className="hidden lg:flex items-center gap-2 text-sm text-gray-400 hover:text-[#C9A961] transition-colors group"
            >
              Need help measuring? Book a free visit!
              <ArrowRight className="w-4 h-4 text-[#C9A961] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex items-center gap-6 sm:gap-10">
            <Link
              to="tel:+13218054605"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4 text-[#C9A961]" />
              <span className="hidden sm:inline font-medium">
                +1 (321) 805-4605
              </span>
            </Link>
            <Link
              to="mailto:alphflooring@gmail.com"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4 text-[#C9A961]" />
              <span className="hidden sm:inline font-medium">
                alphflooring@gmail.com
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};
