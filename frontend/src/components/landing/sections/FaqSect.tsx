import { useLandingContext } from "../../../context/LandingContext";
import { useState } from "react";

export default function FaqSect() {
  const { isLoading, config } = useLandingContext();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  if (isLoading || !config) {
    return (
      <section className="py-12 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-[#CAD2C5] rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-[#CAD2C5] rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const toggleFaq = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  return (
    <section className="py-16 lg:py-20 bg-[#F8F9FA] relative overflow-hidden">
      {/* Subtle background - CORAL TONES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#84A98C] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#52796F] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl relative z-10">
        {/* Header - WARM BROWNS */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
            Common Questions
          </h2>
          <p className="text-lg text-[#4A4A4A] max-w-2xl mx-auto">
            Everything you need to know about the guide.
          </p>
        </div>

        {/* FAQ Items - WHITE CARDS ON CREAM */}
        <div className="space-y-3 mb-12">
          {config.faq.faqs.map((faq) => {
            const isOpen = openFaq === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-sm border border-[#CAD2C5] overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-5 text-left flex items-start justify-between hover:bg-[#F8F9FA] transition-colors group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A] pr-4 leading-snug">
                    {faq.question}
                  </h3>

                  <div
                    className={`flex-shrink-0 w-6 h-6 flex items-center justify-center transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-[#4A4A4A]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                <div
                  id={`faq-answer-${faq.id}`}
                  className="grid transition-all duration-200 ease-in-out"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`px-6 pb-5 transition-opacity duration-200 ${
                        isOpen ? "opacity-100 pt-2" : "opacity-0"
                      }`}
                    >
                      <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA - WHITE CARD WITH CORAL BUTTON */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-[#CAD2C5] text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
              Still have questions?
            </h3>
            <p className="text-base text-[#4A4A4A]">
              We're here to help. Get in touch and we'll answer within 24 hours.
            </p>
          </div>

          <a
            href="mailto:shethrivesadhd@shethrivesadhd.com"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#52796F] hover:bg-[#3D5A51] text-white font-semibold rounded-xl transition-colors shadow-md"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>Email Us</span>
          </a>

          <div className="mt-6 pt-6 border-t border-[#CAD2C5]">
            <div className="flex items-center justify-center gap-6 text-sm text-[#4A4A4A]">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#10B981]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>24h Response</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#10B981]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Instant Download</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
