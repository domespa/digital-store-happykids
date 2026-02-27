import {
  AlertTriangle,
  Smartphone,
  BookOpen,
  CheckCircle2,
  XCircle,
  Info,
  ExternalLink,
} from "lucide-react";

export default function ProblemSectionW() {
  return (
    <section className="py-16 md:py-24 bg-gray-200">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <AlertTriangle className="w-5 h-5" />
            The Screen Time Paradox
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            “Educational” apps promise learning. <br />
            <span className="text-red-600">
              Leading research suggests a different story.{" "}
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Studies from Stanford University, MIT, and the American Academy of
            Pediatrics highlight the risks of excessive screen exposure during
            early childhood development. Parents are starting to look beyond the
            screen.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* SCREEN LEARNING */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Screen-Based Learning
              </h3>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Primarily passive engagement</strong> with limited
                  deep cognitive activation
                </span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Attention challenges</strong> associated with high
                  screen exposure according to the American Academy of
                  Pediatrics
                </span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Limited fine motor development</strong> compared to
                  writing, tracing, and coloring
                </span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Instant digital rewards</strong> reduce opportunities
                  to build patience and delayed gratification
                </span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Evening screen exposure</strong> may interfere with
                  healthy sleep patterns
                </span>
              </li>
            </ul>
          </div>

          {/* PAPER LEARNING */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-primary">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Paper Workbooks
              </h3>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Active, hands-on engagement</strong> that strengthens
                  real cognitive processing
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Deeper brain activation</strong> associated with
                  reading and writing on paper in university research
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Builds fine motor skills</strong> through pencil
                  control, tracing, and coloring
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Develops patience and focus</strong> without constant
                  digital rewards
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Screen-free learning environment</strong> that
                  supports calm and concentration
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Research Citation */}
        <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-primary">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="text-gray-900">
                  Attention and skill delays:
                </strong>{" "}
                the American Academy of Pediatrics (2019) found that children
                under 5 with more than 2 hours of screen time per day show up to
                78% delays in language and motor development
              </p>
              <a
                href="https://scholar.google.it/scholar?q=American+Academy+of+Pediatrics+(2019)&hl=it&as_sdt=0&as_vis=1&oi=scholart"
                className="text-primary hover:text-primary-hover text-sm font-medium mt-2 inline-flex items-center gap-1"
              >
                Read full study
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
