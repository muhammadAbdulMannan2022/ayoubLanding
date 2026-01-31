import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, CheckCircle2, DollarSign, CloudRain, ShieldCheck, Zap, Sparkles, Loader2 } from "lucide-react";

const FlooringQuizModal = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      id: "budget",
      question: "What's your budget priority?",
      icon: <DollarSign className="w-5 h-5 text-[#C9A961]" />,
      options: [
        { label: "Budget-friendly - I want the best value", value: "budget" },
        { label: "Balanced - Quality and price matter equally", value: "balanced" },
        { label: "Premium - I want the best, cost is secondary", value: "premium" }
      ]
    },
    {
      id: "durability",
      question: "How much foot traffic will the room get?",
      icon: <Zap className="w-5 h-5 text-[#C9A961]" />,
      options: [
        { label: "Low - Guest rooms or low-use areas", value: "low" },
        { label: "Moderate - Living rooms and bedrooms", value: "moderate" },
        { label: "High - Kitchens, hallways, or busy homes", value: "high" }
      ]
    },
    {
      id: "moisture",
      question: "How important is water protection?",
      icon: <CloudRain className="w-5 h-5 text-[#C9A961]" />,
      options: [
        { label: "Standard - Mostly dry areas", value: "standard" },
        { label: "High - Kitchens or potential spill areas", value: "high" },
        { label: "Essential - Bathrooms or basements (100% waterproof)", value: "essential" }
      ]
    },
    {
      id: "style",
      question: "What's your preferred style?",
      icon: <Sparkles className="w-5 h-5 text-[#C9A961]" />,
      options: [
        { label: "Natural & Classic - The look and feel of real wood", value: "wood" },
        { label: "Modern & Sleek - High-end realistic textures", value: "modern" },
        { label: "Timeless & Traditional - Stone or tile patterns", value: "traditional" }
      ]
    }
  ];

  if (!isOpen) return null;

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleOptionSelect = (value) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (onComplete) onComplete(newAnswers);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[#C9A961] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
             </div>
             <h2 className="text-xl font-black text-black">Find Your Perfect Flooring</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-8 pt-8">
           <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Question {step + 1} of {questions.length}</span>
              <span className="text-[10px] font-black text-[#C9A961] uppercase tracking-widest">{Math.round(progress)}%</span>
           </div>
           <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#C9A961] transition-all duration-500 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
           </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-[#C9A961] animate-spin" />
                <Sparkles className="w-16 h-16 text-[#C9A961]/20 absolute inset-0 animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-black mb-2">Finding your match...</h3>
                <p className="text-gray-400 text-sm font-medium">Analyzing your preferences for the perfect recommendation</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-[#C9A961]/10 flex items-center justify-center">
                    {currentQuestion.icon}
                 </div>
                 <h3 className="text-2xl font-black text-black leading-tight tracking-tight">{currentQuestion.question}</h3>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    className={`w-full p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all group ${
                      answers[currentQuestion.id] === option.value
                        ? "border-[#C9A961] bg-[#C9A961]/5"
                        : "border-gray-50 hover:border-gray-100 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      answers[currentQuestion.id] === option.value ? "border-[#C9A961]" : "border-gray-200"
                    }`}>
                      {answers[currentQuestion.id] === option.value && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A961]"></div>}
                    </div>
                    <span className={`font-bold transition-colors ${answers[currentQuestion.id] === option.value ? "text-black" : "text-gray-400 group-hover:text-gray-600"}`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
           <button 
             onClick={() => setStep(Math.max(0, step - 1))}
             disabled={step === 0 || loading}
             className="px-6 py-3 rounded-xl font-bold font-black text-gray-400 hover:text-black transition-all flex items-center gap-2 disabled:opacity-0"
           >
             <ChevronLeft className="w-5 h-5" /> Back
           </button>
           {!loading && (
             <button 
               onClick={() => setStep(Math.min(questions.length - 1, step + 1))}
               disabled={!answers[currentQuestion.id] || step === questions.length - 1}
               className="px-8 py-3 bg-gray-100 text-gray-400 font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
             >
               Next <ChevronRight className="w-5 h-5" />
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default FlooringQuizModal;
