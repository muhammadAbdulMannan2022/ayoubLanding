import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0E14] py-16 lg:py-24 text-gray-400 border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mb-20 items-start">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-1">
              <img
                src="/logo.png"
                alt="ALPHA FLOORING"
                className="w-auto h-10"
              />
            </div>
            <p className="text-sm leading-relaxed max-w-xs font-medium">
              Premium LVP flooring and stair specialists serving St Cloud,
              Florida with honest pricing and professional installation.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 lg:justify-self-center">
            <div className="max-w-xs">
              <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-6">
                Contact
              </h4>
              <div className="space-y-4">
                <a
                  href="tel:+13218054605"
                  className="flex items-center gap-3 hover:text-white transition-colors group"
                >
                  <Phone className="w-4 h-4 text-[#C9A961] group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">+1 (321) 805-4605</span>
                </a>
                <a
                  href="mailto:alphflooring@gmail.com"
                  className="flex items-center gap-3 hover:text-white transition-colors group"
                >
                  <Mail className="w-4 h-4 text-[#C9A961] group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">
                    alphflooring@gmail.com
                  </span>
                </a>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#C9A961]" />
                  <span className="text-sm font-medium">St Cloud, Florida</span>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6 lg:justify-self-end">
            <div className="max-w-xs">
              <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-6">
                Services
              </h4>
              <ul className="space-y-4">
                <li className="text-sm font-medium hover:text-white cursor-pointer transition-colors">
                  LVP Floor Installation
                </li>
                <li className="text-sm font-medium hover:text-white cursor-pointer transition-colors">
                  LVP Stair Installation
                </li>
                <li className="text-sm font-medium hover:text-white cursor-pointer transition-colors">
                  Old Flooring Removal
                </li>
                <li className="text-sm font-medium hover:text-white cursor-pointer transition-colors">
                  Custom Finishes
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
            © {currentYear} Alpha Flooring. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
