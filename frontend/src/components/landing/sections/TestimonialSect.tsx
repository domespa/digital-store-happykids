import { useLandingContext } from "../../../context/LandingContext";
import { useState } from "react";

export default function TestimonialSect() {
  const { config, isLoading } = useLandingContext();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Avatar images array - maps to testimonials by index
  const testimonialAvatars = [
    "/images/testimonials/parent-1.jpg",
    "/images/testimonials/parent-2.jpg",
    "/images/testimonials/parent-3.jpg",
    "/images/testimonials/parent-4.jpg",
    "/images/testimonials/parent-5.jpg",
    "/images/testimonials/parent-6.jpg",
  ];

  if (isLoading || !config) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const stars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`${
          index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full text-lg font-bold text-green-600 mb-6">
            <span>💪</span>
            <span>Success Stories</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {config.testimonials.title}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            {config.testimonials.subtitle}
          </p>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden mb-10">
          {(() => {
            const testimonial =
              config.testimonials.testimonials[activeTestimonial];
            const avatarImage =
              testimonialAvatars[activeTestimonial % testimonialAvatars.length];

            return (
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
                {/* Stars */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-lg">
                    {stars(testimonial.rating)}
                  </div>
                  <span className="text-xs font-semibold text-gray-600">
                    {testimonial.rating}/5
                  </span>
                </div>

                {/* Quote */}
                <blockquote className="text-gray-900 text-base leading-relaxed mb-5 font-medium">
                  "{testimonial.content}"
                </blockquote>

                {/* Before/After - PROMINENT */}
                {(testimonial.before || testimonial.after) && (
                  <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-lg p-4 space-y-3 border-2 border-gray-200 mb-5">
                    {testimonial.before && (
                      <div className="flex items-start gap-2">
                        <span className="text-red-600 font-bold text-sm flex-shrink-0">
                          ❌ BEFORE:
                        </span>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {testimonial.before}
                        </p>
                      </div>
                    )}
                    {testimonial.after && (
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold text-sm flex-shrink-0">
                          ✅ AFTER:
                        </span>
                        <p className="text-sm text-gray-900 leading-relaxed font-medium">
                          {testimonial.after}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Author with IMAGE */}
                <div className="flex items-center gap-3">
                  <img
                    src={avatarImage}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                    onError={(e) => {
                      const fallbackDiv = document.createElement("div");
                      fallbackDiv.className =
                        "w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm border-2 border-blue-500 shadow-sm";
                      fallbackDiv.textContent = getInitials(testimonial.name);
                      e.currentTarget.parentNode?.replaceChild(
                        fallbackDiv,
                        e.currentTarget
                      );
                    }}
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {testimonial.title}
                      {testimonial.location && ` • ${testimonial.location}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Carousel Dots */}
          <div className="flex justify-center mt-6 gap-2">
            {config.testimonials.testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeTestimonial
                    ? "bg-blue-600 w-6"
                    : "bg-gray-300 w-2"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid - 3 Column */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mb-16">
          {config.testimonials.testimonials
            .slice(0, 6)
            .map((testimonial, index) => {
              const avatarImage =
                testimonialAvatars[index % testimonialAvatars.length];

              return (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all"
                >
                  {/* Stars */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-base">
                      {stars(testimonial.rating)}
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-900 text-sm leading-relaxed mb-5 font-medium min-h-[80px]">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Before/After - COMPACT */}
                  {(testimonial.before || testimonial.after) && (
                    <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-lg p-3 space-y-2 border border-gray-200 mb-4">
                      {testimonial.before && (
                        <div>
                          <div className="text-xs font-bold text-red-600 mb-1">
                            ❌ BEFORE
                          </div>
                          <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                            {testimonial.before}
                          </p>
                        </div>
                      )}
                      {testimonial.after && (
                        <div>
                          <div className="text-xs font-bold text-green-600 mb-1">
                            ✅ AFTER
                          </div>
                          <p className="text-xs text-gray-900 leading-relaxed font-medium line-clamp-2">
                            {testimonial.after}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Author with IMAGE */}
                  <div className="flex items-center gap-3 mt-auto">
                    <img
                      src={avatarImage}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shadow-sm flex-shrink-0"
                      onError={(e) => {
                        const fallbackDiv = document.createElement("div");
                        fallbackDiv.className =
                          "w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs border-2 border-blue-500 shadow-sm flex-shrink-0";
                        fallbackDiv.textContent = getInitials(testimonial.name);
                        e.currentTarget.parentNode?.replaceChild(
                          fallbackDiv,
                          e.currentTarget
                        );
                      }}
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Stats Bottom */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 sm:p-10 max-w-4xl mx-auto border-2 border-blue-200 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Join 2,000+ Parents Who Got Their Kids Back
            </h3>
            <p className="text-base text-gray-700 font-medium">
              Real parents. Real transformations. In just 30 days.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { number: "2,000+", label: "Parents Helped", icon: "👨‍👩‍👧‍👦" },
              { number: "4.8/5", label: "Average Rating", icon: "⭐" },
              { number: "30", label: "Days to Freedom", icon: "🎯" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-gray-700 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Urgency Message */}
          <div className="mt-8 pt-6 border-t-2 border-blue-200 text-center">
            <p className="text-base sm:text-lg text-gray-900 font-bold">
              Every parent was skeptical at first.{" "}
              <br className="hidden sm:block" />
              Every parent is grateful they started.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
