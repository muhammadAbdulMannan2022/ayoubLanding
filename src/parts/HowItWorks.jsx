import React from "react";

export const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Customize Your Project",
      description:
        "Choose floors, stairs, or both. Select your size, materials, and preferred finish.",
    },
    {
      number: "2",
      title: "Get Your Price & Quote",
      description:
        "Provide your contact info to instantly view pricing and receive a detailed PDF estimate via email.",
    },
    {
      number: "3",
      title: "Professional Installation",
      description:
        "Our experienced team handles everything from old flooring removal to final installation.",
    },
  ];

  return (
    <section className="bg-white py-24 sm:py-32 border-t border-gray-100">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="text-center mb-20 lg:mb-24">
          <h2 className="text-4xl md:text-5xl font-medium text-black tracking-tight">
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-16 lg:gap-24">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >
              {/* Numbered Circle */}
              <div className="w-20 h-20 rounded-full bg-[#F4F5F7] flex items-center justify-center text-2xl font-medium text-[#1A1A1A] mb-10 transition-transform group-hover:scale-110 duration-500">
                {step.number}
              </div>

              {/* Step Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-black tracking-tight uppercase sm:normal-case">
                  {step.title}
                </h3>
                <p className="text-[#6B7280] text-[15px] leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
