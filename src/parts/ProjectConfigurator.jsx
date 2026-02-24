import React, { useState } from "react";
import {
  Home,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  Ruler,
  MousePointer2,
  Lock,
  Tag,
  Phone,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import BookingModal from "./BookingModal";
import QuoteUnlockModal from "./QuoteUnlockModal";
import PreConfigModal from "./PreConfigModal";

import FloorDetailsForm from "./FloorDetailsForm";

export const ProjectConfigurator = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [pendingType, setPendingType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreModalOpen, setIsPreModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pendingQuoteUnlock, setPendingQuoteUnlock] = useState(false);
  const [bookingUserData, setBookingUserData] = useState(null);
  const [stairData, setStairData] = useState({
    steps: "0",
    landings: "0",
    boxSteps: "0",
    material: "LVP 5mm or thicker",
    timeline: "As soon as possible",
  });
  const [floorData, setFloorData] = useState({
    roomCount: 1,
    roomSizes: [""],
    sqft: "",
    removal: "none",
    trim: "1/4round",
    material: "",
    grade: "",
    finish: "",
    timeline: "As soon as possible",
    quizResults: null,
  });

  const calculateTotal = () => {
    let total = 0;

    // Stair Calculation
    if (selectedType === "stairs" || selectedType === "both") {
      total += (Number(stairData.steps) || 0) * 135;
      total += (Number(stairData.landings) || 0) * 200;
      total += (Number(stairData.boxSteps) || 0) * 250;
    }

    // Floor Calculation
    if (selectedType === "floor" || selectedType === "both") {
      const sqft = Number(floorData.sqft) || 0;
      let materialPrice = 0;

      if (floorData.material === "lvp") {
        const gradePrices = {
          "8.5mm": 6.99,
          "5mm": 5.99,
          "6mm": 6.99,
          "7mm": 7.99,
        };
        materialPrice = gradePrices[floorData.grade] || 0;
      } else if (floorData.material === "hardwood") {
        materialPrice = 10.99;
      } else if (floorData.material === "tile") {
        const gradePrices = {
          ceramic: 6.99,
          porcelain: 7.99,
          luxury: 9.99,
          not_sure: 6.99,
        };
        materialPrice = gradePrices[floorData.grade] || 0;
      } else if (floorData.material === "laminate") {
        const gradePrices = {
          value: 4.99,
          premium: 5.99,
          waterproof: 6.99,
          not_sure: 4.99,
        };
        materialPrice = gradePrices[floorData.grade] || 0;
      }

      const removalPrices = {
        none: 0,
        carpet: 0.5,
        tile: 4.0,
        hardwood: 4.5,
        vinyl: 0.75,
      };
      const removalPrice = removalPrices[floorData.removal] || 0;

      const trimPrices = { "1/4round": 0, baseboard: 1.5 };
      const trimPrice = trimPrices[floorData.trim] || 0;

      total += sqft * (materialPrice + removalPrice + trimPrice);
    }

    return total;
  };

  const isStairsValid = () => {
    return Number(stairData.steps) > 0;
  };

  const isFloorValid = () => {
    return floorData.material && floorData.grade && Number(floorData.sqft) > 0 && floorData.finish;
  };

  const isConfigValid = () => {
    if (selectedType === "stairs") return isStairsValid();
    if (selectedType === "floor") return isFloorValid();
    if (selectedType === "both") return isStairsValid() && isFloorValid();
    return false;
  };

  const handleCompleteAllSteps = () => {
    if (!isUnlocked) {
      setIsUnlockModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const totalEstimate = calculateTotal();

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
          <div className="flex-1 space-y-24">
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
                    onClick={() => {
                      setPendingType(option.id);
                      setIsPreModalOpen(true);
                    }}
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

            {/* Step 2: Dynamic Detail Forms */}
            {selectedType === "stairs" && (
              <StairDetailsForm
                stairData={stairData}
                setStairData={setStairData}
                isUnlocked={isUnlocked}
                onComplete={handleCompleteAllSteps}
                onSkip={() => setIsModalOpen(true)}
                isConfigValid={isConfigValid}
              />
            )}
            {selectedType === "floor" && (
              <FloorDetailsForm
                data={floorData}
                onChange={setFloorData}
                onComplete={handleCompleteAllSteps}
                isUnlocked={isUnlocked}
                onSkip={() => {
                  setIsModalOpen(true);
                }}
              />
            )}
            {selectedType === "both" && (
              <div className="space-y-24">
                <FloorDetailsForm
                  data={floorData}
                  onChange={setFloorData}
                  onComplete={handleCompleteAllSteps}
                  isUnlocked={isUnlocked}
                  onSkip={() => {
                    setIsModalOpen(true);
                  }}
                />
                <div className="h-px bg-gray-100"></div>
                <StairDetailsForm
                  stairData={stairData}
                  setStairData={setStairData}
                  isUnlocked={isUnlocked}
                  onComplete={handleCompleteAllSteps}
                  onSkip={() => setIsModalOpen(true)}
                  isConfigValid={isConfigValid}
                />
              </div>
            )}
          </div>

          {/* Right Side: Summary Widgets */}
          <div className="w-full lg:w-100 space-y-6 lg:sticky lg:top-32">
            {/* Schedule Help Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-6 group border border-[#C9A961]/20 ">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#C9A961]/10 rounded-2xl flex-shrink-0">
                  <Home className="w-6 h-6 text-[#C9A961]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black text-black leading-tight">
                    Prefer an In-Home Visit?
                  </h4>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">
                    Don't have all the details? We'll visit your home for free
                    and provide an exact quote.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 bg-[#1A1A1A] text-white font-black rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Calendar className="w-5 h-5" />
                Schedule Free In-Home Quote
              </button>
            </div>

            {/* Live Selection Preview Image */}
            <div className="relative group rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl aspect-square sm:aspect-video flex items-center justify-center bg-gray-100">
               <img 
                 src={
                   selectedType === 'stairs' ? '/heroimg2.jpg' : 
                   selectedType === 'floor' ? '/heroimg.png' :
                   selectedType === 'both' ? '/heroimg.png' : 
                   '/heroimg2.jpg'
                 } 
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                 alt="Project Preview" 
               />
               <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
               <div className="absolute bottom-6 left-6 right-6 flex flex-col items-start gap-1">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A961] animate-pulse"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Preview</span>
                  </div>
                  <h4 className="text-2xl font-black text-white tracking-tight">
                    {selectedType === 'stairs' ? 'Stairs Only' : 
                     selectedType === 'floor' ? 'Floor Only' :
                     selectedType === 'both' ? 'Floor & Stairs' : 
                     'Select a project'}
                  </h4>
               </div>
            </div>

            {/* Custom Quote Card */}
            {(selectedType === "stairs" ||
            selectedType === "both" ||
            (selectedType === "floor" && floorData.sqft > 0)) && (
              <div id="quote-card" className="bg-[#1A1A1A] p-8 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden group border border-white/5 animate-in zoom-in-95 duration-500">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-[#C9A961] rounded-full"></div>
                  <span className="text-[10px] font-black text-[#C9A961] uppercase tracking-[0.2em]">
                    Your Custom Quote
                  </span>
                </div>

                <div className="bg-black/40 rounded-3xl p-8 text-center border border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-b from-[#C9A961]/5 to-transparent pointer-events-none"></div>
                  <div className="flex flex-col items-center">
                    {!isUnlocked ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-[#C9A961] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(201,169,97,0.4)]">
                          <Lock className="w-8 h-8 text-black" />
                        </div>
                        <h4 className="text-2xl font-black text-white tracking-tight mb-1">
                          Price Ready!
                        </h4>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                          Unlock to view your personalized quote
                        </p>
                      </>
                    ) : (
                      <div className="animate-in zoom-in-95 duration-500">
                        <span className="text-[10px] font-black text-[#C9A961] uppercase tracking-[0.2em] mb-2">
                          Total Estimate
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-white">
                            $
                            {totalEstimate.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-4 flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          Professional Pricing Ready
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/40 font-medium text-xs">
                      Project Type
                    </span>
                    <span className="text-white font-black text-xs">
                      {selectedType === "stairs"
                        ? "Stairs Only"
                        : selectedType === "floor"
                          ? "Floor Only"
                          : "Floor & Stairs"}
                    </span>
                  </div>

                  {(selectedType === "floor" || selectedType === "both") && (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40 font-medium text-xs">
                          Total Area
                        </span>
                        <span className="text-[#C9A961] font-black text-xs">
                          {floorData.sqft || 0} SQFT
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40 font-medium text-xs">
                          Room Count
                        </span>
                        <span className="text-white font-black text-xs">
                          {floorData.roomCount} Rooms
                        </span>
                      </div>
                    </>
                  )}

                  {(selectedType === "stairs" || selectedType === "both") && (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40 font-medium text-xs">
                          Steps (Straight)
                        </span>
                        <span className="text-white font-black text-xs">
                          {stairData.steps}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40 font-medium text-xs">
                          Landings
                        </span>
                        <span className="text-white font-black text-xs">
                          {stairData.landings}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-[#C9A961] uppercase tracking-widest">
                    <Tag className="w-3.5 h-3.5" />
                    Get Your Price & PDF Quote
                  </div>
                  {!isUnlocked ? (
                    <button
                      onClick={handleCompleteAllSteps}
                      disabled={!isConfigValid()}
                      className={`w-full py-5 font-black rounded-2xl transition-all shadow-xl flex flex-col items-center justify-center group ${
                        isConfigValid()
                          ? "bg-[#C9A961] hover:bg-[#B69752] text-black"
                          : "bg-white/5 text-white/20 cursor-not-allowed border border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Phone className={`w-5 h-5 ${isConfigValid() ? "text-black" : "text-white/20"}`} />
                        <span className="font-black">View Price & Get PDF Quote</span>
                      </div>
                      {!isConfigValid() && (
                        <span className="text-[8px] uppercase tracking-tighter opacity-40 mt-1">
                          Complete details above *
                        </span>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleCompleteAllSteps}
                      className="w-full py-5 bg-[#C9A961] hover:bg-[#B69752] text-black font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 group"
                    >
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm">Schedule Free In-Home Visit & Get Exclusive Discount</span>
                    </button>
                  )}
                    <p className="text-[9px] text-white/40 font-medium text-center px-4">
                      Provide your email to instantly view pricing and receive your detailed PDF quote
                    </p>
                </div>
              </div>
            )}

            {!selectedType && (
              /* Live Estimate Card (Original) */
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
                    <div className="flex items-baseline gap-2">
                       <span className="text-sm font-bold text-[#C9A961] uppercase tracking-[0.2em] leading-relaxed">
                        Select a project type <br /> to see your custom estimate
                       </span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 space-y-4 text-sm font-medium text-gray-400">
                    Calculated in real-time based on your project selections.
                  </div>

                  <button
                    disabled
                    className="w-full py-5 bg-gray-100 text-gray-400 font-black rounded-2xl transition-all flex items-center justify-center gap-3 cursor-not-allowed"
                  >
                    Select Project Type First
                  </button>
                </div>
              </div>
            )}

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

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPendingQuoteUnlock(false);
        }}
        initialData={{ ...bookingUserData, type: selectedType }}
        shouldNavigate={!pendingQuoteUnlock}
        onComplete={(data) => {
          if (pendingQuoteUnlock) {
            setBookingUserData(data);
            setIsUnlockModalOpen(true);
            setPendingQuoteUnlock(false);
          }
        }}
      />

      <QuoteUnlockModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        initialData={bookingUserData}
        onUnlocked={() => setIsUnlocked(true)}
        setBookingUserData={setBookingUserData}
        projectData={{
          type: selectedType,
          stairDetails: stairData,
          floorDetails: floorData,
        }}
      />

      <PreConfigModal
        isOpen={isPreModalOpen}
        onClose={() => setIsPreModalOpen(false)}
        projectType={pendingType}
        onStart={() => {
          setSelectedType(pendingType);
          setIsPreModalOpen(false);
        }}
      />
    </section>
  );
};

// --- Sub Components ---
const StairDetailsForm = ({ stairData, setStairData, isUnlocked, onComplete, onSkip, isConfigValid }) => (
  <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
    {/* Step 2: Stair Details */}
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-[#C9A961] uppercase tracking-[0.2em]">
            Step 2
          </span>
        </div>
        <h3 className="text-3xl font-black text-black">
          Enter your stair details
        </h3>
        <p className="text-gray-400 text-sm font-medium">
          Note: Pricing is for straight stairs only. If you have curved
          stairs, the final price may be adjusted.
        </p>
      </div>

      <div className="space-y-6">
        {[
          {
            label: "Number of steps *",
            key: "steps",
            placeholder: "Enter number of steps",
          },
          {
            label: "Number of landings",
            key: "landings",
            placeholder: "0",
          },
          {
            label: "Number of box steps",
            key: "boxSteps",
            placeholder: "0",
          },
        ].map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">
              {field.label}
            </label>
            <input
              type="number"
              className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-[#C9A961] outline-none transition-all font-medium text-black"
              placeholder={field.placeholder}
              value={stairData[field.key]}
              onChange={(e) =>
                setStairData({ ...stairData, [field.key]: e.target.value })
              }
            />
          </div>
        ))}
        <p className="text-[10px] text-gray-400 font-medium italic">
          Exact numbers help us provide a more accurate estimate.
        </p>
      </div>
    </div>

    {/* Step 3: Stair Material */}
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-[#C9A961] uppercase tracking-[0.2em]">
            Step 3
          </span>
        </div>
        <h3 className="text-3xl font-black text-black">
          Your stair material
        </h3>
        <p className="text-gray-400 text-sm font-medium">
          For stairs, we use premium LVP flooring for optimal durability.
        </p>
      </div>

      <div className="p-8 rounded-3xl border-2 border-[#C9A961] bg-[#C9A961]/5 flex gap-6 relative group cursor-pointer transition-all">
        <div className="w-6 h-6 rounded-full border-2 border-[#C9A961] flex items-center justify-center mt-1 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#C9A961]"></div>
        </div>
        <div className="space-y-2">
          <h4 className="font-black text-black text-xl tracking-tight">
            LVP 5mm or thicker
          </h4>
          <p className="text-[#C9A961] font-bold text-sm">
            Professional Grade Stair Flooring
          </p>
          <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-lg">
            Premium Luxury Vinyl Plank with exceptional durability and core
            SPC strength. High quality stair finish that's durable, stylish,
            and easy to maintain.
          </p>
          <p className="pt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            5mm+ core thickness • Premium wear layer
          </p>
        </div>
      </div>
    </div>

    {/* Step 4: Timeline */}
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-[#C9A961] uppercase tracking-[0.2em]">
            Step 4
          </span>
        </div>
        <h3 className="text-3xl font-black text-black">
          When would you like to start your project?
        </h3>
      </div>

      <div className="grid gap-3">
        {[
          "As soon as possible",
          "Within 1-2 weeks",
          "Within 1 month",
          "Just planning / exploring",
        ].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setStairData({ ...stairData, timeline: opt })}
            className={`p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all group ${
              stairData.timeline === opt
                ? "border-[#C9A961] bg-[#C9A961]/5"
                : "border-gray-200 bg-white hover:border-[#C9A961]/30"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                stairData.timeline === opt
                  ? "border-[#C9A961]"
                  : "border-gray-200"
              }`}
            >
              {stairData.timeline === opt && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#C9A961]"></div>
              )}
            </div>
            <span
              className={`font-bold transition-colors ${
                stairData.timeline === opt
                  ? "text-black"
                  : "text-gray-400 group-hover:text-gray-600"
              }`}
            >
              {opt}
            </span>
          </button>
        ))}
      </div>
    </div>

    {/* Completion Buttons */}
    <div className="space-y-3 pt-12">
      <button
        onClick={onComplete}
        disabled={!isConfigValid()}
        className={`w-full py-5 font-black rounded-xl transition-all flex items-center justify-center gap-3 ${
          isConfigValid()
            ? "bg-[#C9A961] text-white hover:bg-[#B69752] shadow-xl shadow-[#C9A961]/20"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isUnlocked ? <Calendar className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
        <div className="flex flex-col items-center">
          <span className="text-sm">
            {isUnlocked ? "Schedule Free In-Home Visit & Get Exclusive Discount" : "View Price & Get PDF Quote"}
          </span>
          {!isConfigValid() && (
            <span className="text-[9px] uppercase tracking-widest opacity-60">
              Please complete all required fields *
            </span>
          )}
        </div>
      </button>

      {!isUnlocked && (
        <button
          onClick={onSkip}
          className="w-full py-5 bg-[#ffffff] border hover:cursor-pointer border-[#C9A961] text-[#C9A961]  rounded-xl transition-all font-black"
        >
          Skip to Schedule
        </button>
      )}
    </div>
  </div>
);

// --- Icons ---
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
