import { useState, useRef, useEffect } from "react";

export default function PainPointSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    // Bound between 10% and 90%
    const bounded = Math.min(Math.max(percentage, 10), 90);
    setSliderPosition(bounded);

    // Hide hint after first interaction
    if (showHint) setShowHint(false);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  // Auto-hide hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-white to-[#F8F9FA] relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#52796F] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT: Before/After Slider */}
          <div className="order-2 lg:order-1">
            <div
              ref={containerRef}
              className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#52796F] cursor-ew-resize select-none"
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              {/* AFTER Image (Full Background) */}
              <div className="absolute inset-0">
                <img
                  src="/adhd-calm-desk.jpg"
                  alt="Organized calm workspace"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {/* After Label */}
                <div className="absolute top-4 right-4 bg-[#52796F] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                  <span>✨</span>
                  <span>After</span>
                </div>
              </div>

              {/* BEFORE Image (Clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src="/images/pain.jpg"
                  alt="Woman with ADHD feeling overwhelmed"
                  className="w-full h-full object-cover absolute left-0"
                  style={{ width: `${(100 / sliderPosition) * 100}%` }}
                  draggable={false}
                />
                {/* Before Label */}
                <div className="absolute top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                  <span>😰</span>
                  <span>Before</span>
                </div>
              </div>

              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-30"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Handle Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-2xl border-4 border-[#52796F] flex items-center justify-center hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-[#52796F]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {/* Left arrow */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M11 19l-7-7 7-7"
                    />
                    {/* Right arrow */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Hint Overlay */}
              {showHint && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none z-40 animate-pulse">
                  <div className="bg-white px-6 py-3 rounded-full shadow-2xl">
                    <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span>👆</span>
                      <span>Drag to compare</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Pain Points Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#52796F]/10 px-4 py-2 rounded-full text-sm font-semibold text-[#52796F]">
              <span>😰</span>
              <span>Does This Sound Familiar?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight">
              If you've ever felt like this...
            </h2>

            <div className="space-y-4">
              {[
                {
                  emoji: "😵‍💫",
                  text: "Staring at your to-do list, paralyzed by where to start",
                },
                {
                  emoji: "😤",
                  text: "Feeling like everyone else has it figured out except you",
                },
                {
                  emoji: "😔",
                  text: "Beating yourself up for 'not trying hard enough'",
                },
                {
                  emoji: "😖",
                  text: "Exhausted from fighting your own brain every single day",
                },
              ].map((pain, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-5 bg-white rounded-xl border-2 border-[#CAD2C5] shadow-sm hover:border-[#52796F] hover:shadow-md transition-all"
                >
                  <span className="text-3xl flex-shrink-0">{pain.emoji}</span>
                  <p className="text-base text-[#1A1A1A] leading-relaxed font-medium">
                    {pain.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <div className="bg-gradient-to-r from-[#52796F] to-[#84A98C] rounded-2xl p-6 sm:p-8 text-white text-center">
                <p className="text-2xl sm:text-3xl font-bold mb-3">
                  You're not broken.
                </p>
                <p className="text-lg sm:text-xl opacity-95">
                  You just need a system designed for <em>your</em> brain, not a
                  neurotypical one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
