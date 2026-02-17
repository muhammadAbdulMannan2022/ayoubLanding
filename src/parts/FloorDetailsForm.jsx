import React, { useState } from "react";
import { CheckCircle2, Sparkles, LayoutGrid, Info, BarChart3, Clock, ArrowRight, Zap, Phone, Calendar } from "lucide-react";
import FlooringQuizModal from "./FlooringQuizModal";
import FlooringComparisonModal from "./FlooringComparisonModal";

const FloorDetailsForm = ({ data, onChange, onComplete, onSkip }) => {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const rooms = [1, 2, 3, 4, "5+"];
  
  const removalOptions = [
    { id: "none", label: "No removal needed (new construction)" },
    { id: "carpet", label: "Remove old carpet" },
    { id: "vinyl", label: "Remove old vinyl/LVP" },
    { id: "tile", label: "Remove tile flooring" },
    { id: "hardwood", label: "Remove hardwood flooring" }
  ];

  const trimOptions = [
    { id: "1/4round", label: "1/4 Round" },
    { id: "baseboard", label: "Baseboard" }
  ];

  const materials = [
    { id: "lvp", label: "Luxury Vinyl Plank (LVP)", desc: "Waterproof, durable, and low maintenance with realistic wood looks", icon: "🎨" },
    { id: "hardwood", label: "Hardwood Flooring", desc: "Timeless elegance with natural wood beauty", icon: "🌳" },
    { id: "tile", label: "Tile Flooring", desc: "Durable, water-resistant options", icon: "🏺" },
    { id: "laminate", label: "Laminate Flooring", desc: "Affordable wood-look flooring", icon: "📐" }
  ];

  const materialGrades = {
    lvp: [
      { id: "8.5mm", label: "8.5mm Thickness", price: "$6.99", tag: "BEST VALUE", desc: "Thickest option with superior sound dampening and ultimate durability.", spec: "8.5mm core" },
      { id: "5mm", label: "5mm Thickness", price: "$5.99", desc: "Quality Foundation. Perfect for most residential applications.", spec: "5mm core" },
      { id: "6mm", label: "6mm Thickness", price: "$6.99", desc: "Enhanced Performance. Superior stability and comfort. Ideal for active households.", spec: "6mm core" },
      { id: "7mm", label: "7mm Thickness", price: "$7.99", desc: "Premium Choice. Great for high traffic areas.", spec: "7mm core" }
    ],
    hardwood: [
      { id: "engineered", label: "Engineered Hardwood", desc: "Versatile & Stable. Stable in varying humidity. Perfect for any room.", spec: "3/8\" thick" }
    ],
    tile: [
      { id: "ceramic", label: "Ceramic Tile", desc: "Budget-Friendly. Water-resistant and easy to clean.", spec: "Standard ceramic" },
      { id: "porcelain", label: "Porcelain Tile", desc: "Superior Durability. Excellent for high traffic areas.", spec: "Dense porcelain" },
      { id: "luxury", label: "Luxury Porcelain", desc: "Designer Appeal. Premium tiles with sophisticated patterns.", spec: "Large format" },
      { id: "not_sure", label: "I'm Not Sure", desc: "Expert Guidance. We'll provide personalized recommendations.", spec: "We'll help you choose" }
    ],
    laminate: [
      { id: "value", label: "Value Laminate", desc: "Budget-Conscious. Ideal for low traffic areas.", spec: "7mm thick" },
      { id: "premium", label: "Premium Laminate", desc: "Best Value. Enhanced durability for high traffic areas.", spec: "10mm thick" },
      { id: "waterproof", label: "Waterproof Laminate", desc: "Maximum Protection. Perfect for kitchens and bathrooms.", spec: "12mm thick • Waterproof" },
      { id: "not_sure", label: "I'm Not Sure", desc: "Expert Guidance. We'll provide personalized recommendations.", spec: "We'll help you choose" }
    ]
  };

  const finishPalettes = {
    lvp: [
      { id: "light_oak", label: "Light Oak", color: "bg-[#E8D5B5]" },
      { id: "natural_oak", label: "Natural Oak", color: "bg-[#C4A484]" },
      { id: "warm_brown", label: "Warm Brown", color: "bg-[#8B5E3C]" },
      { id: "dark_walnut", label: "Dark Walnut", color: "bg-[#4B3621]" },
      { id: "gray_tones", label: "Gray Tones", color: "bg-[#808080]" },
      { id: "custom", label: "Other / Custom", color: "bg-gradient-to-br from-gray-100 to-gray-300" }
    ],
    hardwood: [
      { id: "light_oak", label: "Light Oak", color: "bg-[#E8D5B5]" },
      { id: "natural_oak", label: "Natural Oak", color: "bg-[#C4A484]" },
      { id: "warm_brown", label: "Warm Brown", color: "bg-[#8B5E3C]" },
      { id: "dark_walnut", label: "Dark Walnut", color: "bg-[#4B3621]" },
      { id: "gray_tones", label: "Gray Tones", color: "bg-[#808080]" },
      { id: "custom", label: "Other / Custom", color: "bg-gradient-to-br from-gray-100 to-gray-300" }
    ],
    laminate: [
      { id: "light_oak", label: "Light Oak", color: "bg-[#E8D5B5]" },
      { id: "natural_oak", label: "Natural Oak", color: "bg-[#C4A484]" },
      { id: "warm_brown", label: "Warm Brown", color: "bg-[#8B5E3C]" },
      { id: "dark_walnut", label: "Dark Walnut", color: "bg-[#4B3621]" },
      { id: "gray_tones", label: "Gray Tones", color: "bg-[#808080]" },
      { id: "custom", label: "Other / Custom", color: "bg-gradient-to-br from-gray-100 to-gray-300" }
    ],
    tile: [
      { id: "carrara", label: "Carrara White", color: "bg-[#F5F5F5] ring-1 ring-inset ring-black/5" },
      { id: "modern_gray", label: "Modern Gray", color: "bg-[#BDBDBD]" },
      { id: "classic_beige", label: "Classic Beige", color: "bg-[#D2B48C]" },
      { id: "slate", label: "Slate Black", color: "bg-[#2F4F4F]" },
      { id: "sandstone", label: "Sandstone", color: "bg-[#F4A460]" },
      { id: "custom", label: "Other / Custom", color: "bg-gradient-to-br from-gray-100 to-gray-300" }
    ]
  };

  const timelineOptions = [
    "As soon as possible",
    "Within 1-2 weeks",
    "Within 1 month",
    "Just planning / exploring"
  ];

  return (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Step 2: Rooms */}
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-[#C9A961] uppercase tracking-[0.2em]">Step 2</span>
          </div>
          <h3 className="text-3xl font-black text-black">How many rooms need flooring?</h3>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {rooms.map((num) => (
            <button
              key={num}
              onClick={() => {
                const count = num === "5+" ? 5 : num;
                const newRoomSizes = [...(data.roomSizes || [])];
                if (newRoomSizes.length < count) {
                  for (let i = newRoomSizes.length; i < count; i++) newRoomSizes.push("");
                } else {
                  newRoomSizes.splice(count);
                }
                onChange({ ...data, roomCount: num, roomSizes: newRoomSizes });
              }}
              className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                data.roomCount === num
                  ? "border-[#C9A961] bg-[#C9A961]/5 shadow-lg shadow-[#C9A961]/10"
                  : "border-gray-50 hover:border-gray-100 hover:bg-gray-50/50"
              }`}
            >
              <span className={`text-2xl font-black ${data.roomCount === num ? "text-black" : "text-gray-300"}`}>{num}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${data.roomCount === num ? "text-[#C9A961]" : "text-gray-400"}`}>
                {num === 1 ? "Room" : "Rooms"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Size */}
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-[#C9A961] uppercase tracking-[0.2em]">Step 3</span>
          </div>
          <h3 className="text-3xl font-black text-black">Enter the size of each room</h3>
          <p className="text-gray-400 text-sm font-medium">Provide square footage for each room. Approximate measurements work great!</p>
        </div>

        <div className="space-y-6">
           {(data.roomSizes || [""]).map((size, index) => (
             <div key={index} className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Room {index + 1} size (SQFT) *</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="e.g., 250"
                    className="w-full px-6 py-5 rounded-2xl border border-gray-200 focus:border-[#C9A961] outline-none transition-all font-bold text-xl pr-20"
                    value={size}
                    onChange={(e) => {
                      const newSizes = [...data.roomSizes];
                      newSizes[index] = e.target.value;
                      const totalSqft = newSizes.reduce((sum, s) => sum + (Number(s) || 0), 0);
                      onChange({ ...data, roomSizes: newSizes, sqft: totalSqft.toString() });
                    }}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#C9A961] font-black text-sm uppercase tracking-widest">SQFT</div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Step 4: Removal */}
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-[#C9A961] uppercase tracking-[0.2em]">Step 4</span>
          </div>
          <h3 className="text-3xl font-black text-black">Do you need old flooring removed?</h3>
        </div>

        <div className="grid gap-3">
          {removalOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onChange({ ...data, removal: opt.id })}
              className={`p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all group ${
                data.removal === opt.id
                  ? "border-[#C9A961] bg-[#C9A961]/5"
                  : "border-gray-50 hover:border-gray-100 hover:bg-gray-50/50"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                data.removal === opt.id ? "border-[#C9A961]" : "border-gray-200"
              }`}>
                {data.removal === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A961]"></div>}
              </div>
              <span className={`font-bold transition-colors ${data.removal === opt.id ? "text-black" : "text-gray-400 group-hover:text-gray-600"}`}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 5: Trim */}
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-[#C9A961] uppercase tracking-[0.2em]">Step 5</span>
          </div>
          <h3 className="text-3xl font-black text-black">Choose your trim option</h3>
          <p className="text-gray-400 text-sm font-medium">Select your preferred trim style to complete the look.</p>
        </div>

        <div className="grid gap-3">
          {trimOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onChange({ ...data, trim: opt.id })}
              className={`p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all group ${
                data.trim === opt.id
                  ? "border-[#C9A961] bg-[#C9A961]/5"
                  : "border-gray-50 hover:border-gray-100 hover:bg-gray-50/50"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                data.trim === opt.id ? "border-[#C9A961]" : "border-gray-200"
              }`}>
                {data.trim === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A961]"></div>}
              </div>
              <span className={`font-bold transition-colors ${data.trim === opt.id ? "text-black" : "text-gray-400 group-hover:text-gray-600"}`}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 6: Material */}
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-[#C9A961] uppercase tracking-[0.2em]">Step 6</span>
          </div>
          <h3 className="text-3xl font-black text-black">Choose your flooring material</h3>
          <p className="text-gray-400 text-sm font-medium">Select the type of flooring that best suits your needs and style.</p>
        </div>

        {/* Quiz/Compare Card - Only show if NO material is selected */}
        {!data.material && (
          <div className="p-8 rounded-[2rem] border-2 border-dashed border-[#C9A961]/50 bg-[#C9A961]/5 space-y-8 animate-in fade-in duration-500">
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C9A961]/10 flex items-center justify-center shrink-0">
                   <Info className="w-5 h-5 text-[#C9A961]" />
                </div>
                <div className="space-y-1">
                   <h4 className="font-black text-black">Not sure which flooring to choose?</h4>
                   <p className="text-sm text-gray-500 font-medium">We understand flooring decisions can be confusing. Let us help you find the perfect match!</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setIsQuizModalOpen(true)}
                  className="p-5 rounded-2xl bg-white border border-[#C9A961]/20 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 group"
                >
                   <Sparkles className="w-5 h-5 text-[#C9A961] group-hover:scale-110 transition-transform" />
                   <span className="font-black text-black">Take Quick Quiz</span>
                </button>
                <button 
                  onClick={() => setIsCompareModalOpen(true)}
                  className="p-5 rounded-2xl bg-white border border-[#C9A961]/20 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 group"
                >
                   <BarChart3 className="w-5 h-5 text-[#C9A961] group-hover:scale-110 transition-transform" />
                   <span className="font-black text-black">Compare Options</span>
                </button>
             </div>
             
             <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">Or skip ahead and schedule a free consultation with our experts</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {materials.map((mat) => (
            <button
              key={mat.id}
              onClick={() => onChange({ ...data, material: mat.id, grade: "", finish: "" })}
              className={`p-6 rounded-3xl border-2 text-left flex gap-5 transition-all group overflow-hidden relative ${
                data.material === mat.id
                  ? "border-[#C9A961] bg-white shadow-xl shadow-[#C9A961]/5"
                  : "border-gray-50 bg-white hover:border-gray-100 hover:bg-gray-50/50"
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-colors duration-500 ${data.material === mat.id ? "bg-[#C9A961]/10" : "bg-gray-50"}`}>
                {mat.icon}
              </div>
              <div className="space-y-1 pr-6 flex-1">
                <div className="flex items-center gap-2">
                   <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      data.material === mat.id ? "border-[#C9A961]" : "border-gray-200"
                   }`}>
                      {data.material === mat.id && <div className="w-2 h-2 rounded-full bg-[#C9A961]"></div>}
                   </div>
                   <h4 className={`font-black tracking-tight leading-none ${data.material === mat.id ? "text-black" : "text-gray-400 group-hover:text-gray-600"}`}>{mat.label}</h4>
                </div>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{mat.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 7: Product Grade (Dynamic) */}
      {data.material && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-[#C9A961] uppercase tracking-[0.2em]">Step 7</span>
            </div>
            <h3 className="text-3xl font-black text-black">Select product grade</h3>
            <p className="text-gray-400 text-sm font-medium">Choose the right balance of quality and value for your project.</p>
          </div>

          <div className="grid gap-4">
            {materialGrades[data.material]?.map((grade) => (
              <button
                key={grade.id}
                onClick={() => onChange({ ...data, grade: grade.id })}
                className={`p-8 rounded-3xl border-2 text-left flex justify-between items-center transition-all group ${
                  data.grade === grade.id 
                    ? "border-[#C9A961] bg-[#C9A961]/5 shadow-lg shadow-[#C9A961]/5" 
                    : "border-gray-50 bg-white hover:border-gray-100"
                }`}
              >
                <div className="flex gap-6 items-start">
                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 shrink-0 transition-colors ${
                      data.grade === grade.id ? "border-[#C9A961]" : "border-gray-200"
                   }`}>
                      {data.grade === grade.id && <div className="w-3 h-3 rounded-full bg-[#C9A961]"></div>}
                   </div>
                   <div className="space-y-1">
                      <h4 className="font-black text-xl text-black leading-none">{grade.label}</h4>
                      {grade.tag && (
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-orange-500 uppercase tracking-widest mt-1">
                           <Zap className="w-3 h-3 fill-orange-500" />
                           {grade.tag}
                        </div>
                      )}
                      <p className="text-sm text-gray-400 font-medium mt-1">{grade.desc}</p>
                      <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-2">{grade.spec}</p>
                   </div>
                </div>
                {grade.price && (
                  <div className="text-right">
                     <span className="text-xl font-black text-[#C9A961]">{grade.price}</span>
                     <span className="block text-[10px] font-bold text-gray-300 uppercase tracking-widest">per sqft</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 8: Finish Selection (For all materials) */}
      {data.material && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-[#C9A961] uppercase tracking-[0.2em]">Step 8</span>
            </div>
            <h3 className="text-3xl font-black text-black">Choose your finish</h3>
            <p className="text-gray-400 text-sm font-medium">Select the tone or color that complements your space.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {finishPalettes[data.material]?.map((finish) => (
              <button
                key={finish.id}
                onClick={() => onChange({ ...data, finish: finish.id })}
                className={`p-4 rounded-[2rem] border-2 transition-all group ${
                  data.finish === finish.id 
                    ? "border-[#C9A961] bg-[#C9A961]/5 shadow-lg" 
                    : "border-gray-50 bg-white hover:border-gray-100"
                }`}
              >
                <div className={`w-full aspect-[4/3] rounded-2xl mb-4 overflow-hidden border border-gray-100 transition-transform duration-500 group-hover:scale-[1.02] ${finish.color}`}></div>
                <div className="flex items-center gap-3 px-2">
                   <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center shrink-0 ${
                      data.finish === finish.id ? "border-[#C9A961] bg-[#C9A961]" : "border-gray-200 bg-white"
                   }`}>
                      {data.finish === finish.id && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                   </div>
                   <span className={`text-sm font-bold truncate ${data.finish === finish.id ? "text-black" : "text-gray-400"}`}>{finish.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 9: Timeline */}
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-[#C9A961] uppercase tracking-[0.2em]">
              Step {data.material ? "9" : "7"}
            </span>
          </div>
          <h3 className="text-3xl font-black text-black">When would you like to start your project?</h3>
        </div>

        <div className="grid gap-3">
          {timelineOptions.map(opt => (
            <button 
              key={opt}
              onClick={() => onChange({...data, timeline: opt})}
              className={`p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all group ${
                data.timeline === opt 
                  ? "border-[#C9A961] bg-[#C9A961]/5" 
                  : "border-gray-50 bg-white hover:border-gray-100"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                data.timeline === opt ? "border-[#C9A961]" : "border-gray-200"
              }`}>
                {data.timeline === opt && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A961]"></div>}
              </div>
              <span className={`font-bold transition-colors ${data.timeline === opt ? "text-black" : "text-gray-400 group-hover:text-gray-600"}`}>{opt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Completion Buttons */}
      <div className="space-y-3 pt-12">
        <button 
          onClick={onComplete}
          disabled={!data.material || !data.grade || !data.sqft || (data.material && !data.finish)}
          className={`w-full py-5 font-black rounded-xl transition-all flex items-center justify-center gap-3 ${
            data.material && data.grade && data.sqft && data.finish
              ? "bg-[#C9A961] text-white hover:bg-[#B69752] shadow-xl shadow-[#C9A961]/20"
              : "bg-[#D1D5DB] text-gray-500 cursor-not-allowed"
          }`}
        >
          {isUnlocked ? <Calendar className="w-5 h-5 flex-shrink-0" /> : <Phone className="w-5 h-5 flex-shrink-0" />}
          <span className="text-sm">
            {isUnlocked ? "Schedule Free In-Home Visit & Get Exclusive Discount" : "View Price & Get PDF Quote"}
          </span>
        </button>
        <button 
          onClick={onSkip}
          className="w-full py-5 bg-white border-2 border-gray-50 text-gray-400 font-black rounded-xl hover:border-gray-100 hover:text-gray-600 transition-all"
        >
          Skip to Schedule
        </button>
      </div>

      <FlooringQuizModal 
        isOpen={isQuizModalOpen} 
        onClose={() => setIsQuizModalOpen(false)} 
        onComplete={(answers) => onChange({ ...data, quizResults: answers })}
      />
      <FlooringComparisonModal 
        isOpen={isCompareModalOpen} 
        onClose={() => setIsCompareModalOpen(false)} 
      />
    </div>
  );
};

export default FloorDetailsForm;
