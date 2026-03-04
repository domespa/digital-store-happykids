import { ChevronDown, HelpCircle, Check, Clock } from "lucide-react";
import { useState } from "react";
import { useLandingCart } from "../../../../hooks/useLandingCart";

export default function FaqW() {
  const { formatPrice, mainPrice } = useLandingCart();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "My toddler can't even write yet. Will this work?",
      answer:
        "These workbooks are designed for ages 3-5, including kids who haven't learned to write. Most activities are coloring, tracing, and matching - perfect for little hands still developing motor skills. They don't need to 'know' anything to start. The activities progress gradually, so your child can grow with the workbooks.",
      category: "product",
    },
    {
      question: "What if my child refuses to do it and just asks for the iPad?",
      answer:
        "Start with ONE page when they're NOT asking for screens - like after breakfast or before lunch. Make it available, not forced. Most toddlers get curious when there's no pressure. If they ignore it, try again tomorrow. The workbooks aren't going anywhere. Typically, parents see engagement within 1-2 weeks of consistent, low-pressure availability.",
      category: "usage",
    },
    {
      question:
        "My kid can't focus for more than 2 minutes. How will this help?",
      answer:
        "That's exactly why these work. Each activity is designed for 3-5 minutes max - perfect for toddler attention spans destroyed by screens. They do ONE page, feel accomplished, move on. Short bursts = rebuilding focus naturally. You'll notice their attention span gradually increasing over 2-3 weeks.",
      category: "usage",
    },
    {
      question: "I don't have time for messy crafts. Is this more work for me?",
      answer:
        "No. Print a few pages, hand them crayons, done. No glue, no cutting, no cleanup beyond putting crayons back. These are designed for exhausted parents who need kids occupied, not Pinterest projects. Most parents report spending less than 5 minutes on setup.",
      category: "practical",
    },
    {
      question: "Should I buy the bundle or start with one workbook?",
      answer: `Most parents buy the bundle (${formatPrice(mainPrice)}) because variety prevents boredom. If your toddler only does ONE type of activity (like coloring), they'll lose interest fast. 5 workbooks = rotation options for months. Plus, you save money versus buying individually (€10 savings on the bundle).`,
      category: "purchase",
    },
    {
      question: "Can I print multiple copies? I have 3 kids.",
      answer:
        "Yes! Print unlimited copies for your own family. Have twins? Print two. Mess up a page? Print another. Save the originals and print practice copies. Lifetime access means you own it forever. One purchase works for all your children, now and in the future.",
      category: "practical",
    },
    {
      question: "Will this magically make my kid stop asking for screens?",
      answer:
        "No. This isn't magic. These workbooks give you something BETTER to offer when they ask for the iPad. 'Not right now, but look at THIS!' Eventually, they choose the workbook because it's engaging. It takes time - usually 1-2 weeks of consistency. Think of it as offering a new, healthier habit.",
      category: "expectations",
    },
    {
      question: "Do I need special paper or a fancy printer?",
      answer:
        "No. Regular printer paper works fine. Any home printer (inkjet or laser) will do. You can also print at a local print shop like Fedex Office or Staples for pennies per page. Black and white printing is perfectly fine - kids can color the pages themselves!",
      category: "practical",
    },
    {
      question: "How long does it take to see results?",
      answer:
        "Most parents notice initial interest within the first few days. Real habit change typically takes 1-2 weeks of consistent, low-pressure availability. By week 3-4, many parents report their kids asking for the workbooks instead of screens. Every child is different, but consistency is key.",
      category: "expectations",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <HelpCircle className="w-5 h-5" />
            Questions Answered
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Before You Think
            <br />
            <span className="text-primary">"My Kid Won't Do This"</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Every parent worries about this. Here's the truth, backed by
            <strong> 10,000+ families</strong> who've been exactly where you
            are.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden transition-all hover:border-primary/30"
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-gray-900 text-lg flex-1 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 text-primary flex-shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Answer */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-5 pt-2">
                    <div className="pl-4 border-l-4 border-primary/20">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Features */}
        <div className="flex justify-center md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 border-2 border-primary/20 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Instant Access</h3>
            <p className="text-sm text-gray-600">
              Download immediately after purchase. Start in 5 minutes.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-primary/20 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Print Unlimited</h3>
            <p className="text-sm text-gray-600">
              One purchase = unlimited prints for all your kids, forever
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-2xl p-8 text-center text-white shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Still Have Questions?
          </h3>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            We're here to help! Email us at{" "}
            <strong>H4ppyKids@H4ppyKids.com</strong> and we'll answer within 24
            hours. Or take advantage of our risk-free guarantee and try it
            yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:H4ppyKids@H4ppyKids.com"
              className="bg-white text-primary font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all inline-flex items-center gap-2"
            >
              <HelpCircle className="w-5 h-5" />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
