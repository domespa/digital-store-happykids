import { useState } from "react";
import { useLandingCart } from "../../hooks/useLandingCart";
import LookInsideModal from "./LookInsideModal";

export default function LookInsideSect() {
  const landingCart = useLandingCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // PREVIEW THUMBNAILS (same order as modal)
  const previewThumbs = [
    {
      src: "/previews/toc.jpg",
      label: "Table of Contents",
      icon: "📋",
    },
    {
      src: "/previews/day1.jpg",
      label: "Daily Lessons",
      icon: "📖",
    },
    {
      src: "/previews/worksheet.jpg",
      label: "Worksheets",
      icon: "📝",
    },
    {
      src: "/previews/emergency.jpg",
      label: "Emergency Toolkit",
      icon: "🆘",
    },
  ];

  return (
    <>
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* SECTION HEADER */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Real Pages. Real Strategies.
              </span>{" "}
              <br className="hidden sm:block" />
              Zero Fluff.
            </h2>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-8">
              Not theory. Not motivational quotes. Just{" "}
              <strong>practical worksheets and step-by-step protocols</strong>{" "}
              you can use today.
            </p>
          </div>

          {/* PREVIEW GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {previewThumbs.map((thumb, index) => (
              <button
                key={index}
                onClick={openModal}
                className="group relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {/* THUMBNAIL IMAGE */}
                <img
                  src={thumb.src}
                  alt={thumb.label}
                  className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="text-white">
                    <div className="text-2xl mb-1">{thumb.icon}</div>
                    <div className="text-sm font-semibold">{thumb.label}</div>
                  </div>
                </div>

                {/* MAGNIFYING GLASS ICON */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-5 h-5 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* CTA BOX */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 text-center">
            <button
              onClick={openModal}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg sm:text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 mb-4"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View Full Preview (5 Pages)
            </button>

            <p className="text-sm sm:text-base text-gray-600">
              Browse actual pages from the program • No email required
            </p>
          </div>
        </div>
      </section>

      {/* MODAL */}
      <LookInsideModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddToCart={() => {
          landingCart.addMainProductToCart();
          closeModal();
        }}
      />
    </>
  );
}
