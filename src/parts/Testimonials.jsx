import React from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Montgomery",
    text: "The quality of the 8.5mm planks is unbelievable. It feels so solid underfoot compared to our old floors. The crew was professional and finished our entire downstairs in just two days!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    text: "Alpha Flooring handled our stair renovation perfectly. The custom nose-matching for the steps looks seamless. Very transparent pricing from the start, no hidden fees.",
    rating: 5,
  },
  {
    name: "Jessica Williams",
    text: "I was hesitant about the cost, but after seeing the thickness difference, it was a no-brainer. Their team even helped move our heavy furniture. Outstanding service!",
    rating: 5,
  },
  {
    name: "David Rodriguez",
    text: "Professional, punctual, and precise. The floor installation has completely transformed our living room. I recommend them to all my neighbors now.",
    rating: 5,
  },
  {
    name: "Emily Thompson",
    text: "Everything was handled with such care. From the initial quote to the final cleanup, Alpha Flooring exceeded our expectations. Our new stairs are the talk of the neighborhood.",
    rating: 5,
  },
  {
    name: "Robert Martinez",
    text: "The team was on time and very respectful of our home. The floors look amazing and the finish is flawless. Truly a top-tier contractor in Florida.",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="bg-white py-24 sm:py-32 border-t border-gray-100 pb-40">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight leading-tight">
            What Our Customers <br /> <span className="text-gray-400 font-bold">Are Saying</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group bg-[#F9FAFB] p-8 lg:p-10 rounded-[2.5rem] border border-gray-100 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Star Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
                ))}
              </div>

              {/* Testimonial Text */}
              <div className="relative flex-1">
                <Quote className="absolute -top-4 -left-4 w-8 h-8 text-gray-200 opacity-20 group-hover:opacity-40 transition-opacity" />
                <p className="text-gray-600 font-medium leading-relaxed mb-8 relative z-10 italic">
                  "{testimonial.text}"
                </p>
              </div>

              {/* Author */}
              <div className="pt-6 border-t border-gray-200/50">
                <h4 className="text-lg font-black text-black uppercase tracking-widest">
                  {testimonial.name}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
