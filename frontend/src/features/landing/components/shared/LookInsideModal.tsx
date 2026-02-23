import { useState, useEffect } from "react";

interface PreviewImage {
  src: string;
  title: string;
  description: string;
}

interface LookInsideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: () => void;
}

export default function LookInsideModal({
  isOpen,
  onClose,
  onAddToCart,
}: LookInsideModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // 5 PREVIEW IMAGES (in ordine narrativo)
  const previews: PreviewImage[] = [
    {
      src: "/previews/toc.jpg",
      title: "Table of Contents",
      description:
        "Complete 30-day program structure: Foundations, 4 weekly modules, Emergency Toolkit, and Bonus Resources",
    },
    {
      src: "/previews/day1.jpg",
      title: "Day 1: The Disaster Audit",
      description:
        "Start with the 5-Zone Chaos Map exercise. No fixing, just observing where your life falls apart daily.",
    },
    {
      src: "/previews/worksheet.jpg",
      title: "Worksheet Example",
      description:
        "50+ fillable worksheets included. Track your personal overwhelm triggers across physical, emotional, and cognitive zones.",
    },
    {
      src: "/previews/emergency.jpg",
      title: "Emergency Protocol",
      description:
        "When you're at 10/10 overwhelm: 5-step crisis protocol to reset in 15 minutes. No willpower required.",
    },
    {
      src: "/previews/bonus-apps.jpg",
      title: "Bonus: ADHD Apps & Tools",
      description:
        "Curated list of ADHD-friendly apps that actually work. Time management, task tracking, body doubling, and more.",
    },
  ];

  // RESET INDEX quando modal si apre
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsImageLoading(true);
      // Previeni scroll body quando modal è aperto
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // NAVIGATION
  const goToNext = () => {
    setIsImageLoading(true);
    setCurrentIndex((prev) => (prev + 1) % previews.length);
  };

  const goToPrevious = () => {
    setIsImageLoading(true);
    setCurrentIndex((prev) => (prev - 1 + previews.length) % previews.length);
  };

  const goToIndex = (index: number) => {
    setIsImageLoading(true);
    setCurrentIndex(index);
  };

  // KEYBOARD NAVIGATION
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPreview = previews[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* MODAL CONTAINER - CENTRATO */}
      <div className="relative w-full max-w-6xl max-h-[75dvh] bg-white rounded-xl sm:rounded-2xl shadow-2xl transform transition-all flex flex-col">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:-top-4 sm:-right-4 z-10 bg-white rounded-full p-2 sm:p-3 shadow-xl hover:bg-gray-100 transition-colors group"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-gray-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* MODAL CONTENT - SCROLLABLE INTERNO */}
        <div className="overflow-y-auto flex-1">
          {/* MOBILE: SINGLE COLUMN */}
          <div className="lg:hidden p-4 space-y-4">
            {/* IMAGE SECTION */}
            <div className="space-y-3">
              {/* MAIN IMAGE */}
              <div className="relative bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg overflow-hidden aspect-[3/4]">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
                  </div>
                )}

                <img
                  src={currentPreview.src}
                  alt={currentPreview.title}
                  className="w-full h-full object-contain"
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => setIsImageLoading(false)}
                />

                {/* NAVIGATION ARROWS - MOBILE */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
                  aria-label="Next image"
                >
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* COUNTER */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                  {currentIndex + 1} / {previews.length}
                </div>
              </div>

              {/* THUMBNAIL NAVIGATION - MOBILE */}
              <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                {previews.map((preview, index) => (
                  <button
                    key={index}
                    onClick={() => goToIndex(index)}
                    className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all snap-start ${
                      index === currentIndex
                        ? "border-teal-600 shadow-lg scale-105"
                        : "border-gray-200 opacity-60"
                    }`}
                  >
                    <img
                      src={preview.src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* INFO SECTION - MOBILE */}
            <div className="space-y-4">
              {/* TITLE */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {currentPreview.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {currentPreview.description}
                </p>
              </div>

              {/* HIGHLIGHTS */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-teal-900 text-sm mb-2">
                  What's Included:
                </h4>
                <div className="space-y-1.5 text-xs text-teal-800">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>200-page comprehensive program</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>30 daily structured lessons</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>50+ fillable worksheets</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Instant download + lifetime access</span>
                  </div>
                </div>
              </div>

              {/* CTA BUTTON - MOBILE */}
              {onAddToCart && (
                <button
                  onClick={onAddToCart}
                  className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 px-6 rounded-xl font-bold text-base hover:shadow-xl transform active:scale-95 transition-all duration-200"
                >
                  🚀 Add to Cart
                </button>
              )}

              {/* TRUST BADGES - MOBILE */}
              <div className="text-center space-y-2 text-xs text-gray-600 pt-2 border-t">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-3 h-3 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Instant digital download</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-3 h-3 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Secure SSL encrypted payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP: TWO COLUMNS */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6 p-8">
            {/* LEFT: MAIN IMAGE - DESKTOP */}
            <div className="lg:col-span-2 space-y-4">
              {/* IMAGE CONTAINER */}
              <div className="relative bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl overflow-hidden aspect-[3/4] lg:aspect-[4/5]">
                {/* LOADING SPINNER */}
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                  </div>
                )}

                {/* MAIN IMAGE */}
                <img
                  src={currentPreview.src}
                  alt={currentPreview.title}
                  className="w-full h-full object-contain"
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => setIsImageLoading(false)}
                />

                {/* NAVIGATION ARROWS */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all group"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-6 h-6 text-gray-700 group-hover:text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all group"
                  aria-label="Next image"
                >
                  <svg
                    className="w-6 h-6 text-gray-700 group-hover:text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* COUNTER */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentIndex + 1} / {previews.length}
                </div>
              </div>

              {/* THUMBNAIL NAVIGATION - DESKTOP */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {previews.map((preview, index) => (
                  <button
                    key={index}
                    onClick={() => goToIndex(index)}
                    className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? "border-teal-600 shadow-lg scale-105"
                        : "border-gray-200 hover:border-gray-400 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={preview.src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: INFO & CTA - DESKTOP */}
            <div className="space-y-6 lg:border-l lg:border-gray-200 lg:pl-6">
              {/* TITLE */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentPreview.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {currentPreview.description}
                </p>
              </div>

              {/* PROGRAM HIGHLIGHTS */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-teal-900 mb-3">
                  What's Included:
                </h4>
                <div className="space-y-2 text-sm text-teal-800">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>200-page comprehensive program</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>30 daily structured lessons</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>50+ fillable worksheets</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Emergency protocols & toolkits</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Instant download + lifetime access</span>
                  </div>
                </div>
              </div>

              {/* CTA BUTTON */}
              {onAddToCart && (
                <button
                  onClick={onAddToCart}
                  className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  🚀 Add to Cart - Start Today
                </button>
              )}

              {/* TRUST BADGES */}
              <div className="text-center space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Instant digital download</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Secure SSL encrypted payment</span>
                </div>
              </div>

              {/* KEYBOARD HINTS (desktop only) */}
              <div className="text-xs text-gray-400 text-center space-y-1 pt-4 border-t">
                <div>Use ← → arrow keys to navigate</div>
                <div>Press ESC to close</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
