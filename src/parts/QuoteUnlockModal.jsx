import React, { useState } from "react";
import { X, Lock, CheckCircle2, ShieldCheck, Mail, Loader2 } from "lucide-react";

const QuoteUnlockModal = ({ isOpen, onClose, projectData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: ""
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate generation
    setTimeout(() => {
      setLoading(false);
      alert("Quote generated and sent to " + formData.email);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="bg-[#1A1A1A] p-8 text-left relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute right-8 top-8 text-white/30 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 rounded-full bg-[#C9A961] flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
             </div>
             <h2 className="text-2xl font-black text-white leading-tight">
                Unlock Your Price & <br /> Get PDF Quote
             </h2>
          </div>
          <p className="text-white/50 text-sm font-medium">
            Your custom {projectData?.type || "Stairs"} calculation is ready!
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <p className="text-gray-500 text-sm leading-relaxed">
            To unlock your personalized price breakdown and receive a professional PDF quote via email (perfect for planning or sharing with family), please provide your details below.
          </p>

          <div className="bg-[#C9A961]/5 border border-[#C9A961]/20 rounded-2xl p-6 space-y-4">
            <h4 className="font-bold text-black border-b border-[#C9A961]/10 pb-3">We'll also include:</h4>
            <div className="grid grid-cols-1 gap-3">
              {[
                "Itemized cost breakdown",
                "Material specifications",
                "Next steps for scheduling",
                "24/7 access to your quote"
              ].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A961]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-black uppercase tracking-wider">Full Name *</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#C9A961] outline-none transition-all"
                placeholder="md abdullah"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-black uppercase tracking-wider">Email Address *</label>
              <input 
                type="email" 
                required
                className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#C9A961] outline-none transition-all"
                placeholder="programalltest@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-black text-black uppercase tracking-wider">Phone Number</label>
                <span className="text-[10px] text-gray-400 font-bold uppercase">(Optional)</span>
              </div>
              <input 
                type="tel" 
                className="w-full px-5 py-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#C9A961] outline-none transition-all"
                placeholder="01222222222"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <p className="text-[10px] text-gray-400 font-medium italic mt-1">For faster scheduling</p>
            </div>

            <button 
              disabled={loading}
              className="w-full py-5 bg-[#C9A961] hover:bg-[#B69752] text-black font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating your personalized quote...
                </>
              ) : (
                "Unlock My Results Now"
              )}
            </button>
          </form>

          <div className="space-y-3 pt-4 border-t border-gray-100">
             <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-300" />
                Your information is secure. We don't share your data.
             </div>
             <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                <Mail className="w-3.5 h-3.5 text-gray-300" />
                No spam, no sales calls unless you request one.
             </div>
             <p className="text-[9px] text-gray-300 text-center uppercase tracking-widest pt-4 font-bold">
               You can unsubscribe from emails anytime.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteUnlockModal;
