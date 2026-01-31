import React, { useState } from "react";
import { X, Check, CheckCircle2, DollarSign, CloudRain, ShieldCheck, Zap, Heart, Sparkles, PawPrint, Landmark } from "lucide-react";

const FlooringComparisonModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    { label: "Price Range", key: "price" },
    { label: "Waterproof", key: "waterproof" },
    { label: "Durability", key: "durability" },
    { label: "Maintenance", key: "maintenance" },
    { label: "Lifespan", key: "lifespan" },
    { label: "Best For", key: "bestFor" }
  ];

  const materials = [
    {
      id: "lvp",
      name: "LVP",
      icon: "💎",
      price: "$4.99 - $6.99/sqft",
      priceRange: "$4.99 - $6.99",
      waterproof: true,
      durability: "Excellent",
      maintenance: "Very Easy",
      lifespan: "20-25 years",
      bestFor: "Any room, especially kitchens & bathrooms"
    },
    {
      id: "hardwood",
      name: "Hardwood",
      icon: "🌳",
      price: "$7.99 - $12.99/sqft",
      priceRange: "$7.99 - $12.99",
      waterproof: false,
      durability: "Excellent",
      maintenance: "Moderate",
      lifespan: "50+ years",
      bestFor: "Living rooms, bedrooms, dining rooms"
    },
    {
      id: "tile",
      name: "Tile",
      icon: "🏺",
      price: "$5.99 - $9.99/sqft",
      priceRange: "$5.99 - $9.99",
      waterproof: true,
      durability: "Exceptional",
      maintenance: "Easy",
      lifespan: "75+ years",
      bestFor: "Bathrooms, kitchens, entryways"
    },
    {
      id: "laminate",
      name: "Laminate",
      icon: "📋",
      price: "$3.99 - $5.99/sqft",
      priceRange: "$3.99 - $5.99",
      waterproof: false,
      durability: "Good",
      maintenance: "Easy",
      lifespan: "15-20 years",
      bestFor: "Bedrooms, living rooms (low moisture)"
    }
  ];

  const quickGuides = [
    { label: "Best Value", sub: "LVP or Laminate", icon: <DollarSign className="w-5 h-5 text-orange-500" />, bg: "bg-orange-50" },
    { label: "Wet Areas", sub: "LVP or Tile", icon: <CloudRain className="w-5 h-5 text-blue-500" />, bg: "bg-blue-50" },
    { label: "Luxury Look", sub: "Hardwood", icon: <Sparkles className="w-5 h-5 text-yellow-500" />, bg: "bg-yellow-50" },
    { label: "Pets & Kids", sub: "LVP", icon: <PawPrint className="w-5 h-5 text-purple-500" />, bg: "bg-purple-50" }
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-black">Compare Flooring Options</h2>
            <p className="text-gray-400 text-sm font-medium">See the differences at a glance</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="grid grid-cols-[180px_repeat(4,1fr)] mb-8">
              <div className="text-sm font-black text-gray-400 uppercase tracking-widest pt-8">Features</div>
              {materials.map(m => (
                <div key={m.id} className="text-center p-6 bg-gray-50/50 rounded-3xl mx-2 border border-gray-100">
                  <div className="text-3xl mb-3">{m.icon}</div>
                  <div className="font-black text-black">{m.name}</div>
                  <div className="text-[10px] font-bold text-gray-400">{m.price}</div>
                </div>
              ))}
            </div>

            {/* Feature Rows */}
            {features.map((feature, fIdx) => (
              <div key={feature.key} className={`grid grid-cols-[180px_repeat(4,1fr)] items-center py-6 ${fIdx !== features.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className="flex items-center gap-2">
                  {feature.key === "price" && <DollarSign className="w-4 h-4 text-gray-300" />}
                  {feature.key === "waterproof" && <CloudRain className="w-4 h-4 text-gray-300" />}
                  {feature.key === "durability" && <ShieldCheck className="w-4 h-4 text-gray-300" />}
                  {feature.key === "maintenance" && <Zap className="w-4 h-4 text-gray-300" />}
                  {feature.key === "lifespan" && <Heart className="w-4 h-4 text-gray-300" />}
                  {feature.key === "bestFor" && <Landmark className="w-4 h-4 text-gray-300" />}
                  <span className="text-sm font-bold text-gray-600">{feature.label}</span>
                </div>
                {materials.map(m => (
                  <div key={m.id} className="text-center px-4 font-medium text-sm text-gray-700">
                    {typeof m[feature.key] === "boolean" ? (
                      m[feature.key] ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )
                    ) : (
                      m[feature.key]
                    )}
                  </div>
                ))}
              </div>
            ))}

            <div className="mt-12 text-center py-6 bg-yellow-50/30 rounded-2xl border border-yellow-100/50">
               <p className="text-gray-500 text-sm font-medium inline-flex items-center gap-2">
                 👈 Click on any flooring type above to see detailed information
               </p>
               <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-1">Or scroll down to see all options</p>
            </div>

            {/* Quick Guides */}
            <div className="mt-16 space-y-8">
              <h3 className="text-center text-sm font-black text-black uppercase tracking-widest">Still not sure? Here's a quick guide:</h3>
              <div className="grid grid-cols-4 gap-4">
                {quickGuides.map(guide => (
                  <div key={guide.label} className="bg-white border border-gray-100 p-6 rounded-3xl text-center hover:shadow-lg transition-all cursor-pointer group">
                    <div className={`w-12 h-12 rounded-2xl ${guide.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      {guide.icon}
                    </div>
                    <div className="font-black text-black mb-1">{guide.label}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{guide.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlooringComparisonModal;
