import React, { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { getReviewsData } from "../api/backend";

export const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await getReviewsData();
        setReviews(res?.data || []);
      } catch (err) {
        setError("Failed to load reviews");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="bg-white py-24 sm:py-32 border-t border-gray-100 pb-40">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight leading-tight">
            What Our Customers <br />
            <span className="text-gray-400 font-bold">Are Saying</span>
          </h2>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <p className="text-center text-red-400">{error}</p>
        )}

        {/* Empty state */}
        {!loading && !error && reviews.length === 0 && (
          <p className="text-center text-gray-400">No reviews yet</p>
        )}

        {/* Data */}
        {!loading && !error && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="group bg-[#F9FAFB] p-8 lg:p-10 rounded-[2.5rem] border border-gray-100 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]"
                    />
                  ))}
                </div>

                {/* Text */}
                <div className="relative flex-1">
                  <Quote className="absolute -top-4 -left-4 w-8 h-8 text-gray-200 opacity-20" />
                  <p className="text-gray-600 font-medium leading-relaxed mb-8 italic">
                    "{review.text}"
                  </p>
                </div>

                {/* User */}
                <div className="pt-6 border-t border-gray-200/50">
                  <h4 className="text-lg font-black text-black uppercase tracking-widest">
                    {review.user}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* 🔹 Skeleton Loader */
const SkeletonCard = () => {
  return (
    <div className="bg-[#F9FAFB] p-8 lg:p-10 rounded-[2.5rem] border border-gray-100 animate-pulse">
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
        ))}
      </div>

      <div className="space-y-3 mb-8">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>

      <div className="pt-6 border-t border-gray-200/50">
        <div className="h-4 bg-gray-300 rounded w-1/2" />
      </div>
    </div>
  );
};
