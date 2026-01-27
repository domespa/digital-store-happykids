import { useLandingContext } from "../../../context/LandingContext";
import {
  HeartCrack,
  Users,
  AlertTriangle,
  Calendar,
  BookOpen,
  Brain,
  CheckCircle2,
  Quote,
} from "lucide-react";

export default function ParentStrugglesSection() {
  const { config } = useLandingContext();

  if (!config) return null;

  const struggles = [
    {
      id: "tried-everything",
      quote:
        "90-minute meltdowns. Timers don't work. Rewards don't work. Negotiations end in screaming. I've tried everything, and nothing sticks.",
      context: "Every strategy fails",
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      id: "partner-undermines",
      quote:
        "My partner thinks I'm overreacting. They give in when I'm not looking. I'm the only one fighting this, and I'm losing.",
      context: "Fighting alone",
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      id: "expert-advice",
      quote:
        "Every parenting 'expert' says 'just set boundaries.' Cool. Now tell me how when my child is screaming and I haven't slept in 3 days.",
      context: "Advice doesn't match reality",
      icon: AlertTriangle,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      id: "guilt",
      quote:
        "I gave them screens to survive. Just 10 minutes of peace. Now they can't function without them, and I hate myself for it.",
      context: "The crushing guilt",
      icon: HeartCrack,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      id: "cant-play",
      quote:
        "My child forgot how to play. 'I'm bored' every 5 minutes. They can't sit alone for 10 seconds without asking for a screen.",
      context: "Lost ability to play",
      icon: AlertTriangle,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: "workarounds",
      quote:
        "Parental controls? They cracked them. Screen limits? Worse tantrums. I'm out of ideas and watching them disappear further every day.",
      context: "Everything makes it worse",
      icon: AlertTriangle,
      color: "text-gray-600",
      bg: "bg-gray-100",
    },
  ];

  const stats = [
    {
      Icon: Calendar,
      number: "30",
      label: "Days to Reset",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      Icon: BookOpen,
      number: "117",
      label: "Pages Complete",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      Icon: Brain,
      number: "100%",
      label: "Research-Backed",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-200 via-slate-100 to-gray-100 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 rounded-full text-base font-bold text-red-600 mb-5">
            <HeartCrack className="w-5 h-5" />
            <span>Does This Sound Painfully Familiar?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
            You're Not Alone in This Battle
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Every parent fighting screen addiction faces these exact struggles.
            <span className="block mt-2 font-bold text-gray-900">
              The exhaustion. The guilt. The feeling that nothing works.
            </span>
          </p>
        </div>

        {/* Struggles Grid - CON ANIMAZIONI */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10 lg:mb-12">
          {struggles.map((struggle, index) => {
            const Icon = struggle.icon;

            return (
              <div
                key={struggle.id}
                className="group bg-white rounded-xl p-5 sm:p-6 border-2 border-gray-200 hover:border-red-400 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon + Quote Mark */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 ${struggle.bg} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon
                      className={`w-5 h-5 ${struggle.color}`}
                      strokeWidth={2.5}
                    />
                  </div>
                  <Quote className="w-8 h-8 text-gray-200" />
                </div>

                {/* Struggle Quote */}
                <blockquote className="text-gray-900 text-sm sm:text-base leading-relaxed mb-4 font-medium min-h-[100px]">
                  {struggle.quote}
                </blockquote>

                {/* Context Label */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                    {struggle.context}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recognition + Hope Box - MIGLIORATO */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-red-50 via-orange-50 to-green-50 rounded-xl p-6 sm:p-8 border-2 border-red-200 shadow-lg">
            <div className="text-center space-y-4">
              <div className="text-5xl mb-4">⚠️</div>

              <p className="text-lg sm:text-xl font-bold text-gray-900 leading-relaxed">
                If you recognized yourself in even{" "}
                <span className="text-red-600">one</span> of these...
              </p>

              <p className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                You're exactly who this protocol was built for.
              </p>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Not perfect parents with unlimited time and energy.
              </p>

              <div className="bg-white/80 rounded-lg p-4 border border-gray-200">
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  Exhausted, desperate parents who need a system that{" "}
                  <span className="text-green-600">actually works</span>.
                </p>
              </div>

              <div className="pt-5 border-t-2 border-gray-300 mt-6">
                <div className="inline-flex items-center gap-2 bg-green-50 border-2 border-green-300 px-5 py-2.5 rounded-full shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-bold text-sm sm:text-base">
                    You're in the right place
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats - CON LUCIDE ICONS */}
        <div className="mt-10 lg:mt-12 grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.Icon;

            return (
              <div
                key={index}
                className="group text-center p-4 sm:p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="flex justify-center mb-3">
                  <div
                    className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon
                      className={`w-6 h-6 ${stat.color}`}
                      strokeWidth={2.5}
                    />
                  </div>
                </div>

                <div
                  className={`text-2xl sm:text-3xl font-black ${stat.color} mb-1`}
                >
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-gray-700 font-bold">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
