import React, { useState } from "react";
import { X, Info, CheckCircle2, ArrowRight, Send, ChevronLeft } from "lucide-react";

const PreConfigModal = ({ isOpen, onClose, onStart, projectType }) => {
  const [step, setStep] = useState("info"); // "info" or "form"
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: ""
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === "info" ? "bg-blue-50 text-blue-500" : "bg-[#C9A961]/10 text-[#C9A961]"}`}>
              {step === "info" ? <Info className="w-5 h-5" /> : <Send className="w-5 h-5" />}
            </div>
            <h3 className="text-xl font-black text-black">
              {step === "info" ? "Before You Start" : "Get the Form Sent to You"}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === "info" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <p className="text-gray-500 font-medium">
                To provide you with an accurate estimate, please have the following information ready:
              </p>

              <div className="space-y-4">
                {/* Section 1 */}
                <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#C9A961] text-white flex items-center justify-center text-xs font-black">1</div>
                    <h4 className="font-black text-black">
                      {projectType === "both" ? "Flooring & Stair Information" : 
                       projectType === "floor" ? "Flooring Project Information" : 
                       "Stair Installation Information"}
                    </h4>
                  </div>
                  <div className="space-y-3 pl-9">
                    {[
                      (projectType === "floor" || projectType === "both") && "Room dimensions or approximate SQFT",
                      (projectType === "stairs" || projectType === "both") && "Number of steps & staircase shape",
                      (projectType === "stairs" || projectType === "both") && "Number of landings & box steps",
                      (projectType === "floor" || projectType === "both") && "Current flooring type (for removal)"
                    ].filter(Boolean).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2 */}
                <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#C9A961] text-white flex items-center justify-center text-xs font-black">2</div>
                    <h4 className="font-black text-black">Additional Details</h4>
                  </div>
                  <div className="space-y-3 pl-9">
                    {[
                      "Your preferred color or finish",
                      "Desired project timeline"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <p className="text-gray-500 font-medium leading-relaxed">
                We'll send you the configurator form so you can complete it when you have all the information ready.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address *</label>
                  <input 
                    type="email" 
                    placeholder="your@email.com"
                    className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-[#C9A961] outline-none transition-all font-bold"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Phone Number *</label>
                  <input 
                    type="tel" 
                    placeholder="(321) 555-0123"
                    className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-[#C9A961] outline-none transition-all font-bold"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Project Address *</label>
                  <input 
                    type="text" 
                    placeholder="123 Main St, St Cloud, FL"
                    className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-[#C9A961] outline-none transition-all font-bold"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 pt-0 space-y-3">
          {step === "info" ? (
            <>
              <button 
                onClick={onStart}
                className="w-full py-5 bg-[#C9A961] hover:bg-[#B69752] text-white font-black rounded-2xl transition-all shadow-xl shadow-[#C9A961]/20 flex items-center justify-center gap-3 group"
              >
                I Have This Information - Start Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setStep("form")}
                className="w-full py-5 bg-white border-2 border-gray-50 text-gray-400 font-bold rounded-2xl hover:border-gray-100 hover:text-gray-600 transition-all"
              >
                Send Me the Form - I'll Complete It Later
              </button>
            </>
          ) : (
            <div className="flex gap-4">
              <button 
                onClick={() => setStep("info")}
                className="flex-1 py-5 bg-white border-2 border-gray-50 text-gray-400 font-bold rounded-xl hover:border-gray-100 hover:text-gray-600 transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <button 
                onClick={onClose}
                className="flex-[2] py-5 bg-[#C9A961] hover:bg-[#B69752] text-white font-black rounded-xl transition-all shadow-xl shadow-[#C9A961]/20 flex items-center justify-center gap-3 group"
              >
                <Send className="w-4 h-4" />
                Send Me the Form
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreConfigModal;
