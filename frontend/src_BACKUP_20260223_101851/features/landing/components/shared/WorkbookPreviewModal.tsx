import { useState } from "react";

interface WorkbookPreviewModalProps {
  workbookName: string;
  previewImages: string[];
  onClose: () => void;
}

export default function WorkbookPreviewModal({
  workbookName,
  previewImages,
  onClose,
}: WorkbookPreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % previewImages.length);
  };

  const prevPage = () => {
    setCurrentPage(
      (prev) => (prev - 1 + previewImages.length) % previewImages.length,
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{workbookName}</h3>
            <p className="text-sm text-gray-600">
              Page {currentPage + 1} of {previewImages.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
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
        </div>

        {/* Image Container */}
        <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-[3/4] mb-4">
          <img
            src={previewImages[currentPage]}
            alt={`${workbookName} - Page ${currentPage + 1}`}
            className="w-full h-full object-contain"
          />

          {/* Navigation Arrows */}
          {previewImages.length > 1 && (
            <>
              <button
                onClick={prevPage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
              >
                <svg
                  className="w-6 h-6 text-gray-800"
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
                onClick={nextPage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
              >
                <svg
                  className="w-6 h-6 text-gray-800"
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
            </>
          )}
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center gap-2 mb-4">
          {previewImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentPage ? "w-8 bg-blue-600" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">
            📖 Preview of the workbook content
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
