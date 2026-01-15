import { useLandingContext } from "../../../context/LandingContext";
import { useState } from "react";

export default function FaqSect() {
  const { isLoading, config } = useLandingContext();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  if (isLoading || !config) {
    return (
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const toggleFaq = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full text-sm font-bold text-blue-600 mb-6">
            <span>❓</span>
            <span>Your Questions Answered</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {config.faq.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {config.faq.subtitle}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3 mb-12">
          {config.faq.faqs.map((faq) => {
            const isOpen = openFaq === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden hover:border-blue-500 hover:shadow-md transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-5 text-left flex items-start justify-between hover:bg-slate-50 transition-colors group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 pr-4 leading-snug">
                    {faq.question}
                  </h3>

                  <div
                    className={`flex-shrink-0 w-6 h-6 flex items-center justify-center transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
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
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Box - PROMINENT */}
        {/* <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-8 border-2 border-green-200 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl">✓</span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                30-Day Money-Back Guarantee
              </h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Try the protocol risk-free. If you follow the guide and it
                doesn't work, we'll refund every penny. No questions asked, no
                hassle.
              </p>
            </div>
          </div>
        </div> */}

        {/* Contact CTA */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Still Have Questions?
            </h3>
            <p className="text-base text-gray-600">
              We're here to help every step of the way. Get in touch and we'll
              answer within 24 hours.
            </p>
          </div>

          <a
            href="mailto:support@screendetox.com"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-105"
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
            <span>Email Support</span>
          </a>

          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">24h Response Time</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Instant Download</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">No Risk Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final Urgency Message */}
        <div className="mt-8 text-center">
          <p className="text-base text-gray-600 italic">
            Don't let uncertainty keep you stuck. Every day you wait, the
            addiction gets deeper.
          </p>
        </div>
      </div>
    </section>
  );
}
