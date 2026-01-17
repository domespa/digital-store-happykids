import { useState, useRef, useEffect } from "react";
import { useLandingContext } from "../../../context/LandingContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCrack } from "@fortawesome/free-solid-svg-icons";

export default function PainPointSection() {
  const { config } = useLandingContext();
  const [_sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    const bounded = Math.min(Math.max(percentage, 10), 90);
    setSliderPosition(bounded);

    if (showHint) setShowHint(false);
  };

  // const handleMouseDown = () => setIsDragging(true);
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

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!config) return null;

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 rounded-full text-lg font-bold text-red-600 mb-6">
            <span>
              <FontAwesomeIcon icon={faHeartCrack} />
            </span>
            <span>The Reality Check</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {config.problems.title}
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6">
            {config.problems.subtitle}
          </p>

          {/* Emotional Hook Box */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 sm:p-8">
            <p className="text-xl sm:text-2xl font-bold text-gray-900 italic">
              "{config.problems.emotionalHook}"
            </p>
          </div>
        </div>

        {/* All Pain Points Expanded (Below) */}
        {config.problems.problems.length > 0 && (
          <div className="mt-16 lg:mt-20">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
              Sound Familiar? You're Not Alone.
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {config.problems.problems.map((problem) => (
                <div
                  key={problem.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all p-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl flex-shrink-0">
                      {problem.icon}
                    </span>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {problem.title}
                      </h4>
                      <p className="text-base text-gray-600 leading-relaxed mb-4">
                        {problem.description}
                      </p>
                    </div>
                  </div>

                  <div className="pl-12 space-y-2">
                    {problem.painPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="text-red-500 mt-1 flex-shrink-0">
                          ✗
                        </span>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
