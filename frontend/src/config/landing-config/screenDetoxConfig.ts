import type { LandingConfig } from "../../types/landing";

export const screenDetoxConfig: LandingConfig = {
  productId: "cmkcfleu40000brx7zyn51pla",

  hero: {
    title:
      "Your Child Is Disappearing Into a Screen. Here's How to Get Them Back.",
    subtitle:
      "The proven 30-day protocol that helps desperate parents break their child's screen addiction without endless battles, guilt, or losing their mind.",
    image: "/cover.png",
    ctaText: "Get Your Child Back",
    subtext: "117-page guide • Instant download • Research-backed protocol",
  },

  trustBar: {
    stats: [
      { number: "30", label: "Day Protocol", icon: "calendar" },
      { number: "117", label: "Pages", icon: "book-open" },
      { number: "50+", label: "Tools & Scripts", icon: "wrench" },
      { number: "100%", label: "Actionable", icon: "target" },
    ],
    trustedBy:
      "Built by a parent who lived through the chaos and figured out what actually works",
  },

  urgency: {
    enabled: false,
    endDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    message: "",
    urgencyText: "",
    showStock: false,
    stockRemaining: 0,
  },

  problems: {
    title: "Does This Sound Terrifyingly Familiar?",
    subtitle:
      "You're not a bad parent. Your child isn't bad. But screens are hijacking their brain, and every day you wait makes this harder to fix.",
    emotionalHook:
      "Your child is already glued to screens. You know it. They know it. But you have no idea how to stop it without chaos taking over your living room.",
    problems: [
      {
        id: "zombie-mode",
        icon: "eye-off",
        title: "The Zombie Mode",
        description:
          "Your vibrant, curious child turns into a glassy-eyed stranger the moment a screen is on.",
        painPoints: [
          "They don't respond when you call their name",
          "They zone out for hours if you let them",
          "They forget how to play or focus",
          "They resist all attempts to engage",
        ],
      },
      {
        id: "the-battles",
        icon: "swords",
        title: "The Endless Battles",
        description:
          "Every single day, the begging, the bargaining, the screaming. You're exhausted.",
        painPoints: [
          "90-minute meltdowns when you take the tablet away",
          "Negotiations that would make a hostage negotiator quit",
          "You give in just to get 30 minutes of peace",
          "You hate yourself for it, but you're too tired to fight",
        ],
      },
      {
        id: "everything-failed",
        icon: "x-circle",
        title: "Everything You Tried Failed",
        description:
          "Screen time limits. Parental controls. Reward charts. None of it worked.",
        painPoints: [
          "They found workarounds to every restriction",
          "The tantrums got worse, not better",
          "Your partner thinks you're too strict, or not strict enough",
          "You're out of ideas and starting to lose hope",
        ],
      },
      {
        id: "the-guilt",
        icon: "heart-crack",
        title: "The Crushing Guilt",
        description:
          "You know, deep down, this isn't entirely your fault. You were just trying to survive.",
        painPoints: [
          "You gave them a tablet too early, just to get a break",
          "It felt normal because every other kid has screens",
          "Now they can't play alone without a device",
          "You're watching them lose their childhood in real-time",
        ],
      },
      {
        id: "the-fear",
        icon: "alert-triangle",
        title: "The Terrifying Future",
        description:
          "You're scared of what could happen if this keeps up. The habits are already forming, and every day makes it harder to fix",
        painPoints: [
          "They hide devices or sneak screen time",
          "Their social skills are suffering—they struggle to play with real kids",
          "You worry they'll never develop focus, patience, or real-world skills",
          "This isn't getting better on its own—it's getting worse",
        ],
      },
    ],
  },

  contentPreview: {
    title: "Inside: The Complete 30-Day Screen Detox Protocol",
    subtitle:
      "Everything you need to break your child's screen addiction - without losing your sanity or their love.",
    totalPages: 117,
    chapters: [
      {
        number: 1,
        title: "Part I: It's Not Your Fault (But You Have to Fix It)",
        description:
          "Understand why everything you tried failed - and why this method actually works.",
        highlights: [
          "Why your child's brain is literally hijacked (this isn't about willpower)",
          "The brutal truth: Every 'expert' method assumes conditions you don't have",
          "Why waiting won't help - the addiction compounds every day",
        ],
      },
      {
        number: 2,
        title: "Part II: The First 72 Hours (Hell Week)",
        description:
          "Days 1-3: Survival mode. This is the hardest part - but you can do it.",
        highlights: [
          "Hour-by-hour survival guide for Day 1 (when the screaming starts)",
          "The 'Distraction Box' strategy: 50 screen-free activities that actually work",
          "Emergency scripts for when you feel like giving in at 3 PM on Day 2",
          "What to expect: tantrums, manipulation, testing - and how to survive",
        ],
      },
      {
        number: 3,
        title: "Days 4-14: The Turning Point",
        description:
          "This is when you'll start seeing the first signs of your real child coming back.",
        highlights: [
          "Day 7: the breakthrough moment most parents experience",
          "How to handle 'I'm bored' without giving in (15 proven responses)",
          "Rebuilding play skills: they've forgotten how to entertain themselves",
        ],
      },
      {
        number: 4,
        title: "Days 15-30: Building the New Normal",
        description: "Make the changes stick - without constant supervision.",
        highlights: [
          "Create new routines that don't rely on screens",
          "Handle birthday parties, visits to other homes, and school devices",
          "The Reintroduction Protocol: if you bring screens back, do it safely",
        ],
      },
      {
        number: 5,
        title: "Survival Tools & Crisis Management",
        description:
          "For when things go sideways - and they will. This chapter gives you the tools to stay in control.",
        highlights: [
          "15 critical troubleshooting scenarios with exact solutions",
          "Co-parent alignment worksheet to keep everyone on the same page",
          "Solo parent modifications - yes, you can do this alone",
          "3 real parent success stories - proof this works",
        ],
      },
    ],
  },

  features: {
    title: "Why This Works When Everything Else Failed",
    subtitle:
      "Built by a parent in the trenches. Backed by behavioral psychology. Zero fluff.",
    features: [
      {
        id: "realistic",
        icon: "shield-check",
        title: "Brutally Realistic",
        description:
          "No toxic positivity. No 'just set boundaries!' advice. This is written for parents in the trenches.",
        benefits: [
          "Assumes you're exhausted, outnumbered, and out of patience",
          "Gives you permission to lower every other standard for 72 hours",
          "Built-in 'Comeback Protocol' for when you mess up (you will)",
        ],
      },
      {
        id: "step-by-step",
        icon: "list-checks",
        title: "Day-by-Day Roadmap",
        description:
          "You don't need to think. Just follow the protocol for your specific day.",
        benefits: [
          "Each morning: Read ONLY today's section (no overwhelm)",
          "Quick Reference sheets for when you're in crisis mode",
          "Printable checklists you can stick on the fridge",
        ],
      },
      {
        id: "troubleshooting",
        icon: "fire-extinguisher",
        title: "Crisis Management",
        description:
          "For when your child finds the hidden iPad on Day 3 at 11 PM. (It happens.)",
        benefits: [
          "15 exact scenarios with word-for-word scripts",
          "What to do when: they won't sleep, won't eat, won't stop crying",
          "Emergency support plan (who to text when you're about to cave)",
        ],
      },
      {
        id: "family-tools",
        icon: "users",
        title: "Family Alignment Tools",
        description:
          "Get everyone on the same page—or this will fail on Day 2.",
        benefits: [
          "Co-parent agreement template (prevent sabotage)",
          "Scripts for explaining this to grandparents (who think you're crazy)",
          "How to handle the OTHER parent who 'doesn't see the problem'",
        ],
      },
    ],
    bonuses: [
      {
        id: "quick-ref",
        title: "Quick Reference Guide",
        description:
          "One-page cheat sheet for your fridge. When you're in survival mode at 3 PM on Day 2, you won't flip through 117 pages. You'll grab this.",
        value: 17,
        icon: "file-text",
      },
      {
        id: "activities",
        title: "50 Screen-Free Activities",
        description:
          "What to actually DO with your child when they say 'I'm bored' for the 47th time today. Categorized by age, energy level, and 'how desperate you are.'",
        value: 13,
        icon: "palette",
      },
      {
        id: "scripts",
        title: "Word-for-Word Scripts",
        description:
          "Exactly what to say when: they beg, they cry, they threaten, they manipulate. Copy-paste responses so you don't have to think.",
        value: 11,
        icon: "message-square",
      },
    ],
  },

  testimonials: {
    title: "Does This Sound Painfully Familiar?",
    subtitle:
      "You're not alone. Every parent fighting screen addiction faces these exact battles.",
    testimonials: [
      {
        id: "battle-1",
        name: "",
        title: "",
        location: "",
        content:
          "90-minute meltdowns when the tablet gets taken away. You've tried everything: timers, rewards, negotiations. Nothing works.",
        rating: 0,
        before: "",
        after: "",
      },
      {
        id: "battle-2",
        name: "",
        title: "",
        location: "",
        content:
          "Your child can't play independently anymore. 'I'm bored' becomes a constant refrain. They've forgotten how to entertain themselves.",
        rating: 0,
        before: "",
        after: "",
      },
      {
        id: "battle-3",
        name: "",
        title: "",
        location: "",
        content:
          "Every parenting 'expert' says 'just set boundaries.' Yeah, thanks. That totally works when your child is screaming and you haven't slept in days.",
        rating: 0,
        before: "",
        after: "",
      },
      {
        id: "battle-4",
        name: "",
        title: "",
        location: "",
        content:
          "You feel guilty. You gave them screens because you needed a break. Now you're watching them lose their childhood in real-time.",
        rating: 0,
        before: "",
        after: "",
      },
      {
        id: "battle-5",
        name: "",
        title: "",
        location: "",
        content:
          "Your partner thinks you're overreacting. Or they undermine your limits. You're fighting this battle alone.",
        rating: 0,
        before: "",
        after: "",
      },
      {
        id: "battle-6",
        name: "",
        title: "",
        location: "",
        content:
          "You tried parental controls. They found workarounds. You tried screen time limits. The tantrums got worse. You're out of ideas.",
        rating: 0,
        before: "",
        after: "",
      },
    ],
  },

  faq: {
    title: "Before You Panic: Your Questions Answered",
    subtitle: "Every parent asks these. Here's the truth.",
    faqs: [
      {
        id: "too-hard",
        question: "This sounds intense. Can I really do this?",
        answer:
          "Yes. Days 1-3 are challenging, but it's 72 hours of focused effort vs. years of watching your child disappear into screens. You're already handling hard things every day—this is just a different kind of hard, with a clear end point.",
        category: "product",
      },
      {
        id: "age",
        question: "My child is very young. Will this work for them?",
        answer:
          "Absolutely. The protocol is designed for children **ages 3 and up**. Younger kids are usually easier to guide because they use less manipulation. Older kids can follow the same principles with minor adjustments included in the guide.",
        category: "product",
      },
      {
        id: "school-devices",
        question: "What if my child needs a device for school?",
        answer:
          "No problem. Chapter 9 covers this exact scenario. School devices should have only the necessary apps, and you take them at night. Many parents successfully follow the protocol while keeping schoolwork intact.",
        category: "product",
      },
      {
        id: "sabotage",
        question: "What if my partner or grandparents undermine me?",
        answer:
          "Consistency is key. The guide includes Co-Parent Alignment worksheets to get everyone on board before Day 1. If someone gives in too early, it can reset progress, so plan carefully or choose a period when your child is primarily with you.",
        category: "product",
      },
      {
        id: "relapse",
        question: "What if I mess up? What if they get screen time on Day 4?",
        answer:
          "Slip-ups happen. The guide includes a 'Comeback Protocol'—you don't restart, you course-correct within 2 hours. Most parents slip at least once and still succeed.",
        category: "product",
      },
      {
        id: "forever",
        question: "Do we have to stay screen-free forever?",
        answer:
          "No. This is a **30-day RESET**. After that, screens can be reintroduced carefully—supervised, limited, and only for approved content. Some families stay mostly screen-free, others do family movie nights. The choice is yours after the reset.",
        category: "product",
      },
      {
        id: "guarantee",
        question: "What if this doesn't work for my child?",
        answer:
          "You are fully protected with a 30-day money-back guarantee. Follow the protocol and if it doesn't work—or if you decide it's not for you—we refund every penny. No questions asked. Your only risk is staying stuck where you are now.",
        category: "product",
      },
      {
        id: "format",
        question: "What format is the guide? Can I print it?",
        answer:
          "It's a 117-page PDF you can read on any device—phone, tablet, or computer. You can also print it; many parents recommend printing the Quick Reference sheets for easy fridge access. Instant download after purchase.",
        category: "product",
      },
    ],
  },

  pricing: {
    title: "The Complete 30-Day Screen Detox Protocol",
    subtitle:
      "Everything you need to break the addiction and get your child back",
    mainPrice: 27,
    originalPrice: 117,
    currency: "USD",
    valueStack: [
      { item: "Complete 117-Page Protocol", value: "$27" },
      { item: "50 Screen-Free Activities Guide", value: "$11" },
      { item: "Quick Reference Sheets (printable)", value: "$13" },
      { item: "Co-Parent Alignment Tools", value: "$12" },
      { item: "Word-for-Word Crisis Scripts", value: "$11" },
      { item: "Troubleshooting for 15 Scenarios", value: "$14" },
      { item: "3 Real Parent Success Stories", value: "Priceless" },
    ],
    included: [
      "Instant digital download (PDF format)",
      "Lifetime access + all future updates",
      "Mobile-friendly (read on any device)",
      "Printable worksheets & checklists",
      "30-day money-back guarantee",
    ],
    highlights: [
      {
        icon: "zap",
        title: "Instant Download",
        description: "Start TODAY—your child doesn't get worse while you wait",
      },
      {
        icon: "lock",
        title: "One-Time Payment",
        description: "No subscription. No upsells. Just the complete protocol.",
      },
      {
        icon: "check-circle",
        title: "Complete System",
        description:
          "Battle-tested protocol with everything you need to succeed",
      },
    ],
    guarantees: [
      "30-day money-back guarantee—try the protocol risk-free",
      "If you follow the guide and it doesn't work, we'll refund every penny",
      "No questions asked, no hassle—just email us",
    ],
    urgency: {
      enabled: false,
      message: "",
      countdown: false,
    },
  },

  finalCta: {
    title: "Your Child Is Waiting on the Other Side of This",
    subtitle:
      "The longer you wait, the deeper the addiction gets. Every day of delay makes this harder. Start today.",
    ctaText: "Get The Complete Protocol Now",
    guaranteeText:
      "Try it risk-free for 30 days. If you follow the protocol and it doesn't work, we'll refund every penny. No questions asked.",
    urgencyMessage: "",
    stats: [
      "Complete 30-day system",
      "Research-backed protocol",
      "Instant download",
    ],
  },

  stickyBar: {
    enabled: true,
    text: "Get Your Child Back",
    ctaText: "Start Protocol Now - $27",
    showTimer: false,
  },

  settings: {
    theme: "default",
    colors: {
      primary: "#2563eb",
      secondary: "#1e293b",
      accent: "#10b981",
      background: "#ffffff",
      text: "#1e293b",
      textLight: "#64748b",
      border: "#e2e8f0",
      success: "#10b981",
      error: "#ef4444",
    },
    showCountdown: false,
    countdownEnd: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    currency: "USD",
  },
};

export default screenDetoxConfig;
