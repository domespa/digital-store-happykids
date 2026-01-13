import { useLandingContext } from "../../../context/LandingContext";
import { useState } from "react";

export default function TestimonialSect() {
  const { config, isLoading } = useLandingContext();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Avatar images array - maps to testimonials by index
  const testimonialAvatars = [
    "/images/testimonials/avatar-1.jpg",
    "/images/testimonials/avatar-2.jpg",
    "/images/testimonials/avatar-3.jpg",
    "/images/testimonials/avatar-4.jpg",
    "/images/testimonials/avatar-5.jpg",
    "/images/testimonials/avatar-6.jpg",
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
          index < Math.floor(rating) ? "text-[#FFB800]" : "text-gray-300"
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
    <section className="py-16 lg:py-20 bg-white relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#84A98C] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#52796F] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
            Real Women, Real Results
          </h2>
          <p className="text-lg sm:text-xl text-[#4A4A4A] max-w-2xl mx-auto">
            Don't just take our word for it. Here's what 500+ women are saying.
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
              <div className="bg-[#F8F9FA] rounded-xl shadow-sm p-6 border border-[#CAD2C5]">
                {/* Stars */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-lg">
                    {stars(testimonial.rating)}
                  </div>
                  <span className="text-xs font-semibold text-[#4A4A4A]">
                    {testimonial.rating}/5
                  </span>
                </div>

                {/* Quote */}
                <blockquote className="text-[#1A1A1A] text-base leading-relaxed mb-5">
                  "{testimonial.content}"
                </blockquote>

                {/* Author with IMAGE ONLY */}
                <div className="flex items-center gap-3 mb-5">
                  <img
                    src={avatarImage}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#84A98C] shadow-sm"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const fallbackDiv = document.createElement("div");
                      fallbackDiv.className =
                        "w-12 h-12 rounded-full bg-gradient-to-br from-[#84A98C] to-[#52796F] flex items-center justify-center text-white font-bold text-sm border-2 border-[#84A98C] shadow-sm";
                      fallbackDiv.textContent = getInitials(testimonial.name);
                      e.currentTarget.parentNode?.replaceChild(
                        fallbackDiv,
                        e.currentTarget
                      );
                    }}
                  />
                  <div>
                    <h4 className="font-bold text-[#1A1A1A] text-base">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-[#4A4A4A]">
                      {testimonial.title}
                    </p>
                  </div>
                </div>

                {/* Before/After */}
                {(testimonial.before || testimonial.after) && (
                  <div className="bg-white rounded-lg p-4 space-y-3 border border-[#CAD2C5]">
                    {testimonial.before && (
                      <div>
                        <div className="text-xs font-bold text-[#4A4A4A] uppercase mb-1">
                          Before
                        </div>
                        <p className="text-xs text-[#4A4A4A] leading-relaxed">
                          {testimonial.before}
                        </p>
                      </div>
                    )}
                    {testimonial.after && (
                      <div>
                        <div className="text-xs font-bold text-[#52796F] uppercase mb-1">
                          After
                        </div>
                        <p className="text-xs text-[#1A1A1A] leading-relaxed">
                          {testimonial.after}
                        </p>
                      </div>
                    )}
                  </div>
                )}
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
                    ? "bg-[#52796F] w-6"
                    : "bg-[#CAD2C5] w-2"
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
                  className="bg-[#F8F9FA] rounded-xl shadow-sm p-6 border border-[#CAD2C5] hover:shadow-md transition-shadow"
                >
                  {/* Stars */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-base">
                      {stars(testimonial.rating)}
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-[#1A1A1A] text-sm leading-relaxed mb-5">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author with IMAGE ONLY */}
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarImage}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#84A98C] shadow-sm flex-shrink-0"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const fallbackDiv = document.createElement("div");
                        fallbackDiv.className =
                          "w-10 h-10 rounded-full bg-gradient-to-br from-[#84A98C] to-[#52796F] flex items-center justify-center text-white font-bold text-xs border-2 border-[#84A98C] shadow-sm flex-shrink-0";
                        fallbackDiv.textContent = getInitials(testimonial.name);
                        e.currentTarget.parentNode?.replaceChild(
                          fallbackDiv,
                          e.currentTarget
                        );
                      }}
                    />
                    <div>
                      <h4 className="font-bold text-[#1A1A1A] text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-[#4A4A4A]">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Stats Bottom */}
        <div className="bg-[#F8F9FA] rounded-2xl p-8 sm:p-10 max-w-4xl mx-auto border border-[#CAD2C5]">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">
              Join 500+ Women Who've Transformed Their ADHD
            </h3>
            <p className="text-base text-[#4A4A4A]">
              Real stories from women who stopped fighting their brains.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { number: "500+", label: "Women Helped" },
              { number: "4.5/5", label: "Average Rating" },
              { number: "98%", label: "See Results" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl sm:text-4xl font-bold text-[#52796F] mb-1">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-[#4A4A4A] font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
