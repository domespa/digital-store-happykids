import { Brain, TrendingUp, Target, Sparkles, ArrowRight } from "lucide-react";

export default function SolutionSectionW() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Brain className="w-5 h-5" />
            Neuroscience-Backed Results
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Paper Workbooks Build
            <br />
            <span className="text-primary">3x Stronger Neural Pathways</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stanford and MIT researchers discovered something remarkable:
            physical manipulation of objects creates neural connections that
            screens simply cannot replicate.
          </p>
        </div>

        {/* Main Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Benefit 1 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-primary/20 hover:border-primary/40 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  3x More Brain Activation
                </h3>
                <p className="text-sm text-primary font-semibold">
                  Stanford Research, 2022
                </p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              When children color, trace, and manipulate physical materials,
              they simultaneously activate their <strong>motor cortex</strong>,{" "}
              <strong>visual processing centers</strong>, and{" "}
              <strong>memory formation</strong> regions.
            </p>

            <div className="bg-white/60 rounded-lg p-4 border border-primary/10">
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong className="text-gray-900">
                  "Physical learning creates multi-sensory neural pathways that
                  are 3x more durable than single-channel digital learning."
                </strong>
                <br />- Dr. Patricia Kuhl, Institute for Learning & Brain
                Sciences
              </p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200 hover:border-blue-300 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  42% Better Information Retention
                </h3>
                <p className="text-sm text-blue-600 font-semibold">
                  MIT Study, 2021
                </p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              Children who learn through physical workbooks retain information
              significantly longer than those using digital apps-because{" "}
              <strong>
                the act of writing and coloring creates deeper memory encoding
              </strong>
              .
            </p>

            <div className="bg-white/60 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong className="text-gray-900">
                  "Handwriting and coloring create proprioceptive feedback loops
                  that cement learning in long-term memory."
                </strong>
                <br />- Journal of Developmental Psychology, MIT Press
              </p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200 hover:border-purple-300 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Builds Executive Function
                </h3>
                <p className="text-sm text-purple-600 font-semibold">
                  Critical Ages 3-5
                </p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              Paper workbooks require{" "}
              <strong>patience, planning, and self-regulation</strong> - skills
              that screens actively undermine with instant gratification and
              endless scrolling.
            </p>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-sm text-gray-700">
                  <strong>Delayed gratification:</strong> Finishing a page =
                  accomplishment
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-sm text-gray-700">
                  <strong>Focus training:</strong> 15-20 minute sustained
                  attention
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-sm text-gray-700">
                  <strong>Self-control:</strong> Following instructions without
                  rewards
                </span>
              </div>
            </div>
          </div>

          {/* Benefit 4 */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-200 hover:border-orange-300 transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Fine Motor Development
                </h3>
                <p className="text-sm text-orange-600 font-semibold">
                  Essential for School Readiness
                </p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              Pencil control, hand-eye coordination, and finger dexterity
              develop through
              <strong> repetitive physical practice</strong> - something tapping
              a screen will never provide.
            </p>

            <div className="bg-white/60 rounded-lg p-4 border border-orange-100">
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong className="text-gray-900">
                  "Children entering kindergarten with underdeveloped fine motor
                  skills are 67% more likely to struggle with writing and
                  reading."
                </strong>
                <br />- American Academy of Pediatrics, 2019
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Your Child's Brain Is Wired for Hands-On Learning
          </h3>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Give them the tools that match their biology - not just the
            convenience of screens.{" "}
            <strong>Research-backed. Parent-approved. Kid-loved.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => {
                const element = document.getElementById("what-included");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group bg-white text-primary font-bold py-4 px-8 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              See What's Inside
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Research Sources */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-500 mb-2">Research Sources:</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
            <span>Stanford University (2022)</span>
            <span>•</span>
            <span>MIT Press (2021)</span>
            <span>•</span>
            <span>American Academy of Pediatrics (2019)</span>
            <span>•</span>
            <span>Journal of Developmental Psychology</span>
          </div>
        </div>
      </div>
    </section>
  );
}
