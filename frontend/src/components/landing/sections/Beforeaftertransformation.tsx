import { useState, useRef, useEffect } from "react";

export default function BeforeAfterTransformation() {
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
    <section className="py-16 lg:py-10 bg-gradient-to-br from-[#F8F9FA] to-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#52796F] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#84A98C] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4 leading-tight">
            Does your brain feel like this?
          </h2>
        </div>

        {/* Image Comparison Slider */}
        <div
          ref={containerRef}
          className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#52796F] cursor-ew-resize select-none mb-8"
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
              <span>What's Possible</span>
            </div>

            {/* After Text Overlay */}
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg max-w-xs">
              <ul className="space-y-2 text-sm text-[#2F3E46]">
                {/* <li className="flex items-center gap-2">
                  <span className="text-[#52796F] font-bold">✓</span>
                  <span>Clear mind</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#52796F] font-bold">✓</span>
                  <span>Organized space</span>
                </li> */}
                <li className="flex items-center gap-2">
                  <span className="text-[#52796F] font-bold">✓</span>
                  <span>In control</span>
                </li>
              </ul>
            </div>
          </div>

          {/* BEFORE Image (Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src="/adhd-chaos-desk.jpg"
              alt="Chaotic overwhelmed workspace"
              className="w-full h-full object-cover absolute left-0"
              style={{ width: `${(100 / sliderPosition) * 100}%` }}
              draggable={false}
            />
            {/* Before Label */}
            <div className="absolute top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
              <span>😰</span>
              <span>Your Reality Now</span>
            </div>

            {/* Before Text Overlay */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg max-w-xs">
              <ul className="space-y-2 text-sm text-gray-700">
                {/* <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Mental fog</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Constant chaos</span>
                </li> */}
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Overwhelmed</span>
                </li>
              </ul>
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
          {/* {showHint && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none z-40 animate-pulse">
              <div className="bg-white px-6 py-3 rounded-full shadow-2xl">
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span>👆</span>
                  <span>Drag to compare</span>
                </p>
              </div>
            </div>
          )} */}
        </div>

        {/* Bottom Message */}
        <div className="text-center space-y-4">
          <p className="text-xl sm:text-2xl font-semibold text-[#2F3E46]">
            It doesn't have to stay this way.
          </p>
        </div>
      </div>
    </section>
  );
}
