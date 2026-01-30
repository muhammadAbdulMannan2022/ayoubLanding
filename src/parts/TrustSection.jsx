import React from "react";
import { Heart, ShieldCheck, ThumbsUp, Star } from "lucide-react";

export const TrustSection = () => {
  const features = [
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      bgColor: "bg-red-50",
      title: "Fall in Love With Your Home Again",
      description: "Beautiful floors and stairs that elevate the look and feel of your entire space.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
      bgColor: "bg-blue-50",
      title: "Built to Last",
      description: "Durable LVP installation with professional craftsmanship and attention to detail.",
    },
    {
      icon: <ThumbsUp className="w-6 h-6 text-green-500" />,
      bgColor: "bg-green-50",
      title: "Stress-Free Experience",
      description: "Clear communication, transparent pricing, and a smooth process from start to finish.",
    },
  ];

  return (
    <section className="bg-white py-24 sm:py-32 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        {/* Top Features */}
        <div className="text-center mb-16 lg:mb-24">
          <h2 className="text-4xl md:text-5xl font-medium text-black tracking-tight mb-16 px-4">
            Transform Your Home with Premium Flooring
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center px-4">
                <div className={`w-14 h-14 rounded-full ${feature.bgColor} flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-black mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#6B7280] text-[15px] leading-relaxed max-w-xs">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Google Review Section */}
        <div className="bg-[#F9FAFB]/50 rounded-[2.5rem] p-8 lg:p-12 mt-12">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Google Card */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-[340px] flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-2xl font-semibold text-gray-700">Google</span>
              </div>
              
              <div className="space-y-1 mb-4 text-left w-full">
                <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Alpha Flooring</p>
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-black text-black">5.0</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#FBBC05] text-[#FBBC05]" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[#6B7280] text-sm font-medium border-t border-gray-100 pt-4 w-full">
                Based on customer reviews
              </p>
            </div>

            {/* Why Trust Text */}
            <div className="flex-1 space-y-8 text-left">
              <h3 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
                Why Customers Trust Alpha Flooring
              </h3>
              <div className="space-y-6">
                <p className="text-[#6B7280] text-lg leading-relaxed font-medium">
                  Our commitment to excellence has earned us a perfect 5-star rating on Google. We pride ourselves on transparent pricing, expert craftsmanship, and exceptional customer service from consultation to completion.
                </p>
                <p className="text-[#6B7280] text-lg leading-relaxed font-medium">
                  When you choose Alpha Flooring, you're choosing a team that treats your home with the respect it deserves. We're fully licensed, insured, and dedicated to delivering results that exceed your expectations every time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
