import React from "react";
import { Link } from "react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";

const ThankYou = ({ 
  title = "Quote Request Received!", 
  subtitle = "We've got your details and our team is already crunching the numbers.",
  message = "Expect a call or email from us within 24 hours with your preliminary estimate." 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full space-y-6 border border-gray-100">
        <div className="w-20 h-20 bg-[#C9A961]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#C9A961]" />
        </div>
        
        <h1 className="text-4xl font-black text-black tracking-tight mb-2">
          {title}
        </h1>
        
        <p className="text-xl text-gray-800 font-bold">
          {subtitle}
        </p>
        
        <p className="text-gray-500 leading-relaxed">
          {message}
        </p>
        
        <div className="pt-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white font-bold rounded-xl hover:bg-black transition-all"
          >
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
