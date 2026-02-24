import React, { useMemo } from "react";
import { X, CheckCircle2, Sparkles, ArrowRight, RotateCcw } from "lucide-react";

/**
 * FlooringMatchModal - Displays the recommended flooring based on quiz results
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Function to close the modal
 * @param {Object} props.quizResults - The answers from the FlooringQuizModal
 * @param {Function} props.onSelect - Function called when user selects the recommendation
 * @param {Function} props.onRetake - Function called to restart the quiz
 */
const FlooringMatchModal = ({ isOpen, onClose, quizResults, onSelect, onRetake }) => {
  const recommendations = useMemo(() => ({
    lvp: {
      id: "lvp",
      name: "Luxury Vinyl Plank (LVP)",
      subtitle: "The Smart All-Around Choice",
      icon: "🎨",
      features: [
        "100% waterproof - perfect for any room",
        "Extremely durable and scratch-resistant",
        "Easy to maintain and clean",
        "Realistic wood look at a great value",
        "Pet and kid-friendly"
      ],
      bestFor: "Active homes, kitchens, bathrooms, and anyone wanting low-maintenance beauty.",
      grade: "8.5mm", // Default suggested grade
    },
    hardwood: {
      id: "hardwood",
      name: "Hardwood Flooring",
      subtitle: "Timeless Elegance & Prestige",
      icon: "🌳",
      features: [
        "Adds significant resale value to your home",
        "Unique natural wood grain patterns",
        "Can be refinished for generations of use",
        "Warm and comfortable underfoot",
        "Classic high-end aesthetic"
      ],
      bestFor: "Living rooms, bedrooms, and homeowners seeking a long-term investment in luxury.",
      grade: "engineered",
    },
    tile: {
      id: "tile",
      name: "Tile Flooring",
      subtitle: "Ultimate Durability & Moisture Resistance",
      icon: "🏺",
      features: [
        "Completely impervious to water and steam",
        "Hardest flooring surface available",
        "Perfect for underfloor heating",
        "Wide variety of stone and ceramic looks",
        "Extremely long lifespan"
      ],
      bestFor: "Bathrooms, laundry rooms, and areas prone to heavy moisture or temperature changes.",
      grade: "porcelain",
    },
    laminate: {
      id: "laminate",
      name: "Laminate Flooring",
      subtitle: "Durable Style on a Budget",
      icon: "📐",
      features: [
        "Superior scratch and dent resistance",
        "Advanced HD texture technology",
        "Cost-effective premium wood appearance",
        "Quick and efficient installation",
        "Fade-resistant even in direct sunlight"
      ],
      bestFor: "Large open spaces, rental properties, and budget-conscious premium renovations.",
      grade: "premium",
    }
  }), []);

  const match = useMemo(() => {
    if (!quizResults) return recommendations.lvp;

    const { budget, durability, moisture, style } = quizResults;

    // Logic for recommendation
    if (moisture === "essential") {
      return budget === "premium" ? recommendations.tile : recommendations.lvp;
    }
    
    if (budget === "premium" && style === "wood") {
      return recommendations.hardwood;
    }

    if (budget === "budget") {
      return recommendations.laminate;
    }

    if (durability === "high" || moisture === "high") {
      return recommendations.lvp;
    }

    if (style === "traditional") {
        return recommendations.tile;
    }

    return recommendations.lvp; // Default reliable choice
  }, [quizResults, recommendations]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[#C9A961]/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#C9A961]" />
             </div>
             <h2 className="text-xl font-black text-black">Your Perfect Match!</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
           {/* Recommendation Display */}
           <div className="p-8 rounded-[2rem] border-2 border-[#C9A961]/30 bg-[#C9A961]/5 flex flex-col items-center text-center space-y-6">
              <div className="text-6xl mb-2">{match.icon}</div>
              <div className="space-y-2">
                 <h3 className="text-3xl font-black text-black leading-tight tracking-tight">{match.name}</h3>
                 <p className="text-[#C9A961] font-bold text-lg">{match.subtitle}</p>
              </div>

              <div className="w-full space-y-3 text-left">
                 {match.features.map((feature, idx) => (
                   <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A961] shrink-0 mt-0.5" />
                      <span className="text-gray-600 font-medium text-sm">{feature}</span>
                   </div>
                 ))}
              </div>

              <div className="w-full pt-4 border-t border-[#C9A961]/20 text-left">
                 <p className="text-sm font-medium text-gray-500">
                    <span className="font-black text-black">Best for:</span> {match.bestFor}
                 </p>
              </div>
           </div>

           {/* Actions */}
           <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onSelect(match)}
                className="flex-1 px-8 py-5 bg-[#C9A961] text-white font-black rounded-2xl hover:bg-[#B69752] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#C9A961]/20 group"
              >
                Select {match.name} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onRetake}
                className="px-8 py-5 bg-white border-2 border-gray-100 text-gray-700 font-black rounded-2xl hover:border-gray-200 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-5 h-5" /> Retake Quiz
              </button>
           </div>

           <p className="text-center text-xs text-gray-400 font-medium">
             Still not sure? Our team can help you decide during your free consultation!
           </p>
        </div>
      </div>
    </div>
  );
};

export default FlooringMatchModal;
