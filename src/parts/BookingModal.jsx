import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Mail, Phone, MapPin, Briefcase, FileText } from "lucide-react";
import { useNavigate } from "react-router";

const BookingModal = ({ isOpen, onClose, initialData }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Date, 2: Details
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

  // Mock Calendar Generation
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // Just hardcoding a mock month structure for "January 2026" as per screenshot concept
  // In a real app, use date-fns or similar
  const calendarDays = Array.from({ length: 35 }, (_, i) => i + 1).map(d => d > 31 ? null : d); 
  
  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", 
    "5:00 PM", "6:00 PM"
  ];

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(day);
      setStep(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would integrate with the backend/CRM
    navigate("/thankyoumeeting");
    onClose();
  };

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
          {step === 1 ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#C9A961] font-bold text-lg">
                <CalendarIcon className="w-5 h-5" />
                <h3>Select Your Preferred Date</h3>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-lg font-black text-black">January 2026</span>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 mb-4">
                  {days.map(day => (
                    <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                  {/* Empty slots for offset if needed, simplified here */}
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
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Time Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#C9A961] font-bold text-lg">
                  <Clock className="w-5 h-5" />
                  <h3>Select Your Preferred Time</h3>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all duration-200
                        ${selectedTime === time
                          ? "bg-[#C9A961] border-[#C9A961] text-black shadow-md"
                          : "bg-white border-gray-200 text-gray-600 hover:border-[#C9A961]/50 hover:bg-[#C9A961]/5"
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#C9A961] font-bold text-lg">
                  <User className="w-5 h-5" />
                  <h3>Your Contact Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name *</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A961] focus:ring-4 focus:ring-[#C9A961]/10 outline-none transition-all"
                        placeholder="John Smith"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A961] focus:ring-4 focus:ring-[#C9A961]/10 outline-none transition-all"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number *</label>
                      <input 
                        type="tel" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A961] focus:ring-4 focus:ring-[#C9A961]/10 outline-none transition-all"
                        placeholder="(321) 555-0100"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address *</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A961] focus:ring-4 focus:ring-[#C9A961]/10 outline-none transition-all"
                        placeholder="123 Main St, Anytown, USA"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

               {/* Project Info */}
               <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#C9A961] font-bold text-lg">
                  <Briefcase className="w-5 h-5" />
                  <h3>What type of project are you interested in?</h3>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { id: "stairs", label: "Stairs Only" },
                    { id: "floor", label: "Floor Only" },
                    { id: "both", label: "Both Stairs & Floor" },
                    { id: "unsure", label: "Not Sure Yet" }
                  ].map(type => (
                    <label 
                      key={type.id}
                      className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${formData.projectType === type.id
                          ? "border-[#C9A961] bg-[#C9A961]/5"
                          : "border-gray-100 hover:border-gray-200"
                        }`}
                    >
                      <input 
                        type="radio" 
                        name="projectType"
                        className="w-5 h-5 accent-[#C9A961]"
                        checked={formData.projectType === type.id}
                        onChange={() => setFormData({...formData, projectType: type.id})}
                      />
                      <span className={`font-bold ${formData.projectType === type.id ? "text-black" : "text-gray-500"}`}>
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Additional Notes (Optional)</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A961] focus:ring-4 focus:ring-[#C9A961]/10 outline-none transition-all resize-none"
                  placeholder="Any specific details or questions you'd like to share?"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-between items-center">
          {step === 2 ? (
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-black hover:bg-gray-200 transition-all"
            >
              Back
            </button>
          ) : (
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-black hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          )}

          {step === 1 ? (
             <button 
              disabled={!selectedDate}
              onClick={() => setStep(2)}
              className="px-8 py-3 bg-[#1A1A1A] text-white font-bold rounded-xl hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step
            </button>
          ) : (
             <button 
              onClick={handleSubmit}
              className="px-8 py-3 bg-[#1A1A1A] text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
            >
              Confirm Visit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
