import React, { useState,useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  CheckCircle2,
  Info,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import { createBooking } from "../api/backend";

const BookingModal = ({ isOpen, onClose, initialData, onComplete, shouldNavigate = true }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState("date");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    projectType: initialData?.type || "not_sure",
    notes: "",
  });

  // Sync formData with initialData when it changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        fullName: initialData.fullName || prev.fullName,
        email: initialData.email || prev.email,
        phone: initialData.phone || prev.phone,
        address: initialData.address || prev.address,
        projectType: initialData.type || "not_sure"
      }));
    }
  }, [initialData]);

  // Calendar State - MOVED TO TOP
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!isOpen) return null;

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days: daysInMonth, firstDay } = getDaysInMonth(currentMonth);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const isDateSelected = (day) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const handleDateSelect = (day) => {
    setSelectedDate(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day),
    );
  };

  const handleDateClick = (day) => {
    handleDateSelect(day); // Reusing the new handler
  };

  const handleNext = () => {
    if (step === "date") setStep("contact");
  };

  const handleBack = () => {
    if (step === "contact") setStep("date");
    else onClose();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      // Split full name into first and last name
      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "__";

      // Format date if selected
      let formattedDate = null;
      if (selectedDate) {
        // Adjust for timezone to ensure correct date string
        const offset = selectedDate.getTimezoneOffset();
        const localDate = new Date(selectedDate.getTime() - offset * 60 * 1000);
        formattedDate = localDate.toISOString().split("T")[0]; // YYYY-MM-DD
      }

      // Format time if selected (convert to 24-hour format)
      let formattedTime = null;
      if (selectedTime) {
        const [time, period] = selectedTime.split(" ");
        let [hours, minutes] = time.split(":");
        hours = parseInt(hours);

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        formattedTime = `${hours.toString().padStart(2, "0")}:${minutes}`;
      }

      // Call backend API
      const result = await createBooking({
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        date: formattedDate,
        time: formattedTime,
        projectType: formData.projectType,
        notes:
          formData.notes ||
          `Booking from website. Project type: ${formData.projectType}`,
      });

      console.log("Booking created successfully:", result);

      // Call onComplete callback if provided
      if (onComplete) onComplete(formData);

      // Close modal
      onClose();

      // Navigate to thank you page ONLY if shouldNavigate is true
      if (shouldNavigate) {
        navigate("/thankyoumeeting");
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      setError(error.message || "Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
  ];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
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
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-lg font-black text-black">
                    {currentMonth.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-black"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-7 mb-4">
                  {days.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                  {calendarDays.map((day, i) =>
                    day ? (
                      <button
                        key={i}
                        onClick={() => handleDateSelect(day)}
                        className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 
                         ${
                           isDateSelected(day)
                             ? "bg-[#C9A961] text-black shadow-lg"
                             : "text-gray-700 hover:bg-[#C9A961]/10 hover:text-[#C9A961]"
                         }`}
                      >
                        {day}
                      </button>
                    ) : (
                      <div key={i}></div>
                    ),
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#C9A961] font-bold text-lg">
                  <Clock className="w-5 h-5" />
                  <h3>Select Preferred Time</h3>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-1 rounded-xl text-[10px] font-bold border transition-all ${selectedTime === time ? "bg-[#C9A961] border-[#C9A961] text-black" : "bg-white border-gray-100 text-gray-600 hover:border-[#C9A961]/50"}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#C9A961] font-bold text-lg">
                  <User className="w-5 h-5" />
                  <h3>Contact Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Full Name *
                    </label>
                    <input
                      placeholder="John Smith"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-[#C9A961] outline-none"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Email Address *
                    </label>
                    <input
                      placeholder="john@example.com"
                      required
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-[#C9A961] outline-none"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Phone Number *
                    </label>
                    <input
                      placeholder="(321) 555-0100"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-[#C9A961] outline-none"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Project Address *
                    </label>
                    <input
                      placeholder="123 Main St"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-[#C9A961] outline-none"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-900">
                      Booking Failed
                    </p>
                    <p className="text-xs text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-5 bg-[#1A1A1A] text-white font-black rounded-xl hover:bg-black transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Confirm Visit & Complete
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step === "date" && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-between items-center">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-black transition-all"
            >
              Back
            </button>
            <button
              disabled={!selectedDate}
              onClick={handleNext}
              className="px-8 py-3 bg-[#1A1A1A] text-white font-bold rounded-xl hover:bg-black transition-all disabled:opacity-50"
            >
              Next Step
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
