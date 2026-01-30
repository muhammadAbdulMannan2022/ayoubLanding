import React, { useState } from "react";
import {
  Home,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  Ruler,
  MousePointer2,
} from "lucide-react";

export const ProjectConfigurator = () => {
  const [selectedType, setSelectedType] = useState("both");

  const options = [
    {
      id: "stairs",
      label: "Stairs Only",
      icon: <LadderIcon className="w-8 h-8" />,
    },
    {
      id: "floor",
      label: "Floor Only",
      icon: <HomeIcon className="w-8 h-8" />,
    },
    {
      id: "both",
      label: "Floor & Stairs",
      icon: <Sparkles className="w-8 h-8" />,
    },
  ];

  return (
    <section
      id="configurator"
      className="bg-[#f9fafb] py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Background Accents */}
      <div className="absolute top-[20%] right-0 w-100 h-100 bg-[#C9A961]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left Side: Configuration Flow */}
          <div className="flex-1 space-y-16">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A961]/30 text-[10px] font-bold text-[#C9A961] uppercase tracking-widest bg-[#C9A961]/5">
                Instant Online Quote
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-black tracking-tight">
                Project <span className="text-[#C9A961]">Configurator.</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-xl font-medium">
                Design your premium flooring project in seconds. Our real-time
                engine handles the math for you.
              </p>
            </header>

            {/* Step 1: Project Type */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C9A961] text-black flex items-center justify-center font-black shadow-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold text-black uppercase tracking-wide">
                  Project Type
                </h3>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                {options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedType(option.id)}
                    className={`relative p-8 rounded-3xl border-2 transition-all duration-500 flex flex-col items-start gap-6 group overflow-hidden ${
                      selectedType === option.id
                        ? "border-[#C9A961] bg-white shadow-[0_20px_40px_-15px_rgba(201,169,97,0.2)]"
                        : "border-gray-200 bg-white hover:bg-gray-50 hover:border-[#C9A961]/30"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl transition-colors duration-500 ${selectedType === option.id ? "bg-[#C9A961] text-black" : "bg-gray-100 text-[#C9A961]"}`}
                    >
                      {option.icon}
                    </div>
                    <div className="space-y-1 text-left">
                      <p
                        className={`font-black uppercase tracking-widest text-xs ${selectedType === option.id ? "text-[#C9A961]" : "text-gray-400"}`}
                      >
                        Selection
                      </p>
                      <h4 className="text-lg font-bold text-black">
                        {option.label}
                      </h4>
                    </div>
                    {selectedType === option.id && (
                      <CheckCircle2 className="absolute top-6 right-6 w-6 h-6 text-[#C9A961]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Summary Widgets */}
          <div className="w-full lg:w-100 space-y-6 lg:sticky lg:top-32">
            {/* Live Estimate Card */}
            <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                <div className="w-12 h-12 rounded-full bg-[#C9A961]/10 flex items-center justify-center animate-pulse">
                  <MousePointer2 className="w-5 h-5 text-[#C9A961]" />
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-[#C9A961] rounded-full"></div>
                  <span className="text-[10px] font-black text-[#C9A961] uppercase tracking-[0.2em]">
                    Estimated Investment
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                    Starting from
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-black tracking-tighter">
                      $2,450
                    </span>
                    <span className="text-[#C9A961] font-bold text-xl uppercase">
                      *
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">
                      Selected Service
                    </span>
                    <span className="text-black font-bold">
                      {selectedType === "both"
                        ? "Floor & Stairs"
                        : selectedType === "floor"
                          ? "Floor Only"
                          : "Stairs Only"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">
                      LVP Thickness
                    </span>
                    <span className="text-[#C9A961] font-black underline underline-offset-4 decoration-current/30">
                      8.5mm Upgrade
                    </span>
                  </div>
                </div>

                <button className="w-full py-5 bg-[#1A1A1A] hover:bg-black text-white font-black rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]">
                  Lock In This Price
                </button>
              </div>
            </div>

            {/* Schedule Help Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-6 group border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#C9A961]/10 rounded-2xl">
                  <Calendar className="w-6 h-6 text-[#C9A961]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-black leading-tight">
                    Need a professional <br /> on-site?
                  </h4>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">
                    We'll visit for free, measure everything, and bring samples.
                  </p>
                </div>
              </div>
              <button className="w-full py-4 bg-gray-50 border border-gray-100 text-black font-black rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                Book Free Visit
              </button>
            </div>

            {/* Local Badge */}
            <div className="flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl bg-gray-50/50">
              <MapPin className="w-4 h-4 text-[#C9A961]" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Licensed in Florida • CRC1331777
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// SVG Components for consistent iconography
const LadderIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 3v18" />
    <path d="M5 3v18" />
    <path d="M5 7h14" />
    <path d="M5 12h14" />
    <path d="M5 17h14" />
  </svg>
);

const HomeIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
