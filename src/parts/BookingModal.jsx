import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Mail, Phone, MapPin, Briefcase, FileText, CheckCircle2, Info, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

const BookingModal = ({ isOpen, onClose, initialData, onComplete }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState("date");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    projectType: initialData?.type || "not_sure",
    notes: ""
  });

  if (!isOpen) return null;

  const handleDateClick = (day) => {
    if (day) setSelectedDate(day);
  };

  const handleNext = () => {
    if (step === "date") setStep("contact");
  };

  const handleBack = () => {
    if (step === "contact") setStep("date");
    else onClose();
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (onComplete) onComplete(formData);
    onClose();
    if (!onComplete) navigate("/thankyoumeeting");
  };

  // Mock Calendar Generation
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = Array.from({ length: 35 }, (_, i) => i + 1).map(d => d > 31 ? null : d); 
  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1A1A1A] p-6 text-center relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-black text-white mb-1">
            Schedule Free In-Home Visit
          </h2>
          <p className="text-white/60 text-sm font-medium">
            We'll help measure and provide an accurate quote
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {step === "date" ? (
             <div className="space-y-6">
             <div className="flex items-center gap-2 text-[#C9A961] font-bold text-lg">
               <CalendarIcon className="w-5 h-5" />
               <h3>Select Your Preferred Date</h3>
             </div>
             <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                 <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black"><ChevronLeft className="w-5 h-5" /></button>
                 <span className="text-lg font-black text-black">January 2026</span>
                 <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black"><ChevronRight className="w-5 h-5" /></button>
               </div>
               <div className="grid grid-cols-7 mb-4">
                 {days.map(day => (<div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">{day}</div>))}
               </div>
               <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                 <div className="col-span-4"></div> 
                 {calendarDays.map((day, i) => (
                   day ? (
                     <button 
                       key={i} 
                       onClick={() => handleDateClick(day)} 
                       className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 
                         ${selectedDate === day
                           ? "bg-[#C9A961] text-black shadow-lg" 
                           : "text-gray-700 hover:bg-[#C9A961]/10 hover:text-[#C9A961]"
                         }`}
                      >
                        {day}
                      </button>
                   ) : null
                 ))}
               </div>
             </div>
           </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#C9A961] font-bold text-lg"><Clock className="w-5 h-5" /><h3>Select Preferred Time</h3></div>
                <div className="grid grid-cols-5 gap-3">
                  {timeSlots.map(time => (<button key={time} type="button" onClick={() => setSelectedTime(time)} className={`py-3 px-1 rounded-xl text-[10px] font-bold border transition-all ${selectedTime === time ? "bg-[#C9A961] border-[#C9A961] text-black" : "bg-white border-gray-100 text-gray-600 hover:border-[#C9A961]/50"}`}>{time}</button>))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#C9A961] font-bold text-lg"><User className="w-5 h-5" /><h3>Contact Information</h3></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name *</label>
                    <input 
                      placeholder="John Smith" 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-[#C9A961] outline-none" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address *</label>
                    <input 
                      placeholder="john@example.com" 
                      required 
                      type="email" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-[#C9A961] outline-none" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number *</label>
                    <input 
                      placeholder="(321) 555-0100" 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-[#C9A961] outline-none" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Project Address *</label>
                    <input 
                      placeholder="123 Main St" 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-[#C9A961] outline-none" 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <button 
                onClick={handleSubmit} 
                className="w-full py-5 bg-[#1A1A1A] text-white font-black rounded-xl hover:bg-black transition-all shadow-xl"
              >
                Confirm Visit & Complete
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step === "date" && (
           <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-between items-center">
            <button type="button" onClick={handleBack} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-black transition-all">Back</button>
            <button disabled={!selectedDate} onClick={handleNext} className="px-8 py-3 bg-[#1A1A1A] text-white font-bold rounded-xl hover:bg-black transition-all disabled:opacity-50">Next Step</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
