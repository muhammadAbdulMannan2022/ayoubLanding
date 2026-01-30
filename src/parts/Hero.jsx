import React from "react";
import { Star, ShieldCheck, Heart, MapPin, ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative w-full pt-10 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-125 bg-linear-to-b from-[#C9A961]/40 to-transparent opacity-30 pointer-events-none"></div>
      <div className="absolute top-[10%] -left-[10%] w-125 h-125 bg-[#C9A961]/30 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[10%] -right-[10%] w-150 h-150 bg-[#C9A961]/30 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Decorative Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#C9A961] animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 5 + "s",
              opacity: Math.random() * 0.5 + 0.2,
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-start">
          {/* Left Content Side */}
          <div className="flex flex-col space-y-8 lg:space-y-10">
            {/* Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#C9A961]/30 text-[11px] font-bold text-[#C9A961] uppercase tracking-[0.2em] bg-[#C9A961]/5 w-fit animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[#C9A961] shadow-[0_0_10px_#C9A961]"></span>
              Florida's Premier Flooring Specialists
            </div>

            {/* Main Headlines */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-[90px] font-black text-white leading-[0.9] tracking-tighter">
                Thicker is <br />
                <span className="text-white/90">better.</span>
              </h1>
              <p className="text-2xl md:text-3xl  font-bold text-[#C9A961] max-w-2xl leading-tight">
                Why choose a 5mm plank when you can get 8.5mm for the same
                price?
              </p>
              <p className="text-lg md:text-xl text-gray-400 font-medium max-w-lg leading-relaxed">
                Expert flooring & stair installation with real-time pricing and
                premium materials.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-x-10 gap-y-6 pt-2">
              <TrustBadge
                icon={<Star className="w-5 h-5 fill-black text-black" />}
                title="5.0 Rating"
                subtitle="500+ Projects"
              />
              <TrustBadge
                icon={<ShieldCheck className="w-5 h-5 text-black" />}
                title="Licensed"
                subtitle="& Insured"
              />
              <TrustBadge
                icon={<Heart className="w-5 h-5 fill-black text-black" />}
                title="Lifetime"
                subtitle="Warranty"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group relative px-10 py-5 bg-[#C9A961] hover:bg-[#b89850] text-black font-black rounded-2xl flex items-center justify-center gap-3 text-lg transition-all duration-300 shadow-[0_10px_30px_rgba(201,169,97,0.3)] hover:shadow-[0_15px_40px_rgba(201,169,97,0.4)] hover:-translate-y-1">
                Get Instant Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-5 bg-transparent border-2 border-white/10 hover:border-white/30 text-white font-bold rounded-2xl transition-all duration-300 text-lg hover:bg-white/5">
                Schedule Free Visit
              </button>
            </div>

            {/* Location Tag */}
            <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold pt-2">
              <MapPin className="w-4 h-4 text-[#C9A961]" />
              Proudly serving St Cloud, Florida & surrounding areas
            </div>
          </div>

          {/* Right Visual Side */}
          <div className="relative mt-12 lg:mt-0">
            {/* The Main Showcase Image Container */}
            <div className="relative z-20 group">
              {/* Outer Golden Glow */}
              <div className="absolute -inset-4 bg-[#C9A961]/20 blur-3xl rounded-[3rem] opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_-12px_rgba(201,169,97,0.5)] aspect-4/4">
                <img
                  src="/heroimg.png"
                  alt="Premium Flooring Installation"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Image Overlay: Black/50 to Transparent */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Floating Content inside Main Image */}
                <div className="absolute top-8 right-8 px-5 py-2 bg-white text-black text-[10px] font-black rounded-full uppercase tracking-widest shadow-xl">
                  Featured Project
                </div>

                <div className="absolute bottom-10 left-10 right-10 z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#C9A961] text-[#C9A961]"
                        />
                      ))}
                    </div>
                    <span className="text-white text-sm font-bold tracking-wide">
                      Perfect Installation
                    </span>
                  </div>
                  <h3 className="text-4xl font-black text-white leading-tight">
                    Thicker is Better
                  </h3>
                  <p className="text-gray-300 font-medium text-lg">
                    Premium 8.5mm LVP • Same price as 5mm
                  </p>
                </div>
              </div>

              {/* Floating Badges */}

              {/* Happy Clients Badge */}
              <div className="absolute -left-6 sm:-left-10 top-[20%] sm:top-1/4 bg-white px-5 sm:px-8 py-3 sm:py-6 rounded-3xl sm:rounded-4xl shadow-[0_25px_60px_rgba(201,169,97,0.3)] z-40 text-center border border-white/20 transform -rotate-3 hover:rotate-0 transition-all duration-500">
                <div className="text-2xl sm:text-4xl font-black text-[#C9A961] tracking-tighter leading-none mb-1">
                  500+
                </div>
                <div className="text-[8px] sm:text-[10px] text-[#1A1A1A] font-black uppercase tracking-widest leading-none">
                  Happy Clients
                </div>
              </div>

              {/* Review Card */}
              <div className="absolute -bottom-10 sm:-bottom-6 -right-6 sm:-right-10 bg-white p-4 sm:p-8 rounded-4xl sm:rounded-[2.5rem] shadow-[0_30px_70px_rgba(201,169,97,0.3)] z-40 max-w-45 sm:max-w-70 border border-white/20 transform rotate-2 hover:rotate-0 transition-all duration-500">
                <div className="flex gap-0.5 mb-2 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-2.5 h-2.5 sm:w-4 sm:h-4 fill-[#C9A961] text-[#C9A961]"
                    />
                  ))}
                </div>
                <p className="text-[#1A1A1A] text-[10px] sm:text-sm font-bold leading-relaxed mb-2 sm:mb-4 italic">
                  "Outstanding work! Transformed our home beautifully."
                </p>
                <div className="text-[9px] sm:text-[11px] font-black text-black/50 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-3 sm:w-4 h-px bg-black/20"></span>
                  Sarah M.
                </div>
              </div>
            </div>

            {/* Bottom Secondary Images */}
            <div className="flex gap-3 sm:gap-4 mt-16 sm:mt-8 lg:-mt-12 relative z-30 lg:translate-y-24">
              <div className="flex-1 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 aspect-video relative group shadow-[0_15px_30px_-5px_rgba(201,169,97,0.3)]">
                <img
                  src="/heroimg.png"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                  alt="Process"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-5 text-left">
                  <p className="text-[9px] sm:text-[11px] font-black text-white uppercase tracking-wider">
                    Luxury Installation
                  </p>
                  <p className="text-[8px] sm:text-[9px] text-gray-400 font-bold">
                    Premium LVP Finish
                  </p>
                </div>
              </div>
              <div className="flex-1 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 aspect-video relative group shadow-[0_15px_30px_-5px_rgba(201,169,97,0.3)]">
                <img
                  src="/heroimg.png"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                  alt="Process"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-5 text-left">
                  <p className="text-[9px] sm:text-[11px] font-black text-white uppercase tracking-wider">
                    8.5mm Planks
                  </p>
                  <p className="text-[8px] sm:text-[9px] text-gray-400 font-bold">
                    Thicker is Better
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TrustBadge = ({ icon, title, subtitle }) => {
  return (
    <div className="flex items-center gap-4 group cursor-default">
      <div className="w-12 h-12 rounded-full bg-[#C9A961] flex items-center justify-center shadow-[0_5px_15px_rgba(201,169,97,0.2)] group-hover:shadow-[0_8px_25px_rgba(201,169,97,0.4)] transition-all duration-300 transform group-hover:-translate-y-1">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-white font-black text-[14px] uppercase tracking-wide">
          {title}
        </span>
        <span className="text-gray-500 text-[11px] font-bold uppercase tracking-tight">
          {subtitle}
        </span>
      </div>
    </div>
  );
};
