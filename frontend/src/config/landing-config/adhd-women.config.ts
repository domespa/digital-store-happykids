import type { LandingConfig } from "../../types/landing";

export const adhdWomenConfig: LandingConfig = {
  productId: "cmgagj3jr00044emfdvtzucfb",

  hero: {
    title:
      "What if your ADHD brain isn't broken - it just needs the right tools?",
    subtitle:
      "Stop fighting your brain. Start working with it. Join 500+ women who've transformed their ADHD.",
    image: "/cover.png",
    ctaText: "Start Your Transformation",
    subtext: "30-day program • Instant download • Lifetime access",
  },

  trustBar: {
    stats: [
      { number: "30", label: "Daily Lessons", icon: "📅" },
      { number: "200+", label: "Pages", icon: "📖" },
      { number: "50+", label: "Worksheets", icon: "📝" },
      { number: "Instant", label: "Download", icon: "⚡" },
    ],
    trustedBy:
      "Join 500+ women who've transformed their ADHD into sustainable systems",
  },

  urgency: {
    enabled: false,
    endDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    message: "Limited Time: Introductory Pricing",
    urgencyText: "Offer ends in:",
    showStock: false,
    stockRemaining: 47,
  },

  problems: {
    title: "Does This Sound Like Your Life?",
    subtitle:
      "You're not broken. You're not lazy. Your brain just works differently - and that's why nothing you've tried has worked... until now.",
    emotionalHook:
      "Every productivity system assumes you have willpower, motivation, and executive function. You don't. And that's not your fault.",
    problems: [],
  },

  contentPreview: {
    title: "What's Inside the Guide",
    subtitle:
      "A complete 30-day system designed specifically for women's ADHD brains.",
    totalPages: 200,
    chapters: [
      {
        number: 1,
        title: "Week 1: Reset Your Brain",
        description: "Understand your ADHD and stop fighting it",
        highlights: [
          "The Brain Dump: Free your mental RAM",
          "Create your Safe Zone (one clear surface)",
          "Anti-Forgetting Station (never lose keys again)",
        ],
      },
      {
        number: 2,
        title: "Week 2: Build Your System",
        description: "Simple tools that actually work for ADHD",
        highlights: [
          "The 2-Minute Rule for ADHD brains",
          "Body Doubling Magic: Work 'with' someone even alone",
          "Done Badly > Not Done: Permission to do things imperfectly",
        ],
      },
      {
        number: 3,
        title: "Week 3: Handle Emotions",
        description: "Manage overwhelm without medication",
        highlights: [
          "Sensory Overload First Aid",
          "The Art of No: Say no without guilt",
          "Decompression Rituals: 15 minutes between worlds",
        ],
      },
      {
        number: 4,
        title: "Week 4: Stay Consistent",
        description: "Make it stick long-term",
        highlights: [
          "Habit Stacking: Attach new to existing habits",
          "The Comeback Protocol: Restart after falling off",
          "Energy Management: Protect your battery",
        ],
      },
    ],
  },

  features: {
    title: "What Makes This Different",
    subtitle: "Built specifically for ADHD brains",
    features: [],
    bonuses: [],
  },

  testimonials: {
    title: "Real Women, Real Results",
    subtitle:
      "Don't just take our word for it. Here's what 500+ women are saying.",
    testimonials: [
      {
        id: "maria",
        name: "Maria K.",
        title: "Entrepreneur, Age 36",
        location: "Austin, TX",
        content:
          "The 2-Minute Rule changed my business. I spent YEARS avoiding tasks that took 2 minutes because they felt overwhelming. Now I just do them.",
        rating: 5,
        before: "Constant procrastination, clients waiting weeks",
        after: "Responsive, organized, growing client base",
      },
      {
        id: "sarah",
        name: "Sarah L.",
        title: "Mother of 2",
        location: "Portland, OR",
        content:
          "The Safe Zone concept sounds SO simple but it's revolutionary. Having one surface that stays clear gives my brain a place to rest.",
        rating: 5,
        before: "Chaotic home, constant mom guilt",
        after: "Functional systems the kids can follow too",
      },
      {
        id: "jennifer",
        name: "Jennifer W.",
        title: "Graphic Designer",
        location: "Brooklyn, NY",
        content:
          "I finally understand why I hyperfocus on client work for 8 hours then can't do dishes. The Energy Management chapter taught me to protect my battery.",
        rating: 5,
        before: "Burnout cycles every 2-3 months",
        after: "Sustainable work rhythm, actual weekends",
      },
      {
        id: "amanda",
        name: "Amanda R.",
        title: "Teacher",
        location: "Seattle, WA",
        content:
          "This is the first ADHD resource that didn't make me feel broken. It validated my struggles and gave me tools that actually work.",
        rating: 5,
      },
      {
        id: "lisa",
        name: "Lisa M.",
        title: "Software Engineer",
        location: "San Francisco, CA",
        content:
          "The Comeback Protocol saved me. I used to give up after one bad day. Now I know how to restart without shame.",
        rating: 5,
      },
      {
        id: "rachel",
        name: "Rachel T.",
        title: "Freelance Writer",
        location: "Boston, MA",
        content:
          "Body doubling changed everything. I can finally work from home without procrastinating for hours.",
        rating: 5,
      },
    ],
  },
  faq: {
    title: "Common Questions",
    subtitle: "Everything you need to know about the guide.",
    faqs: [
      {
        id: "diagnosis",
        question: "Do I need an official ADHD diagnosis?",
        answer:
          "No. This program works for anyone with ADHD-like symptoms: chronic overwhelm, procrastination, executive dysfunction. Whether you're diagnosed, self-diagnosed, or just suspect ADHD - if these struggles sound familiar, this is for you.",
        category: "product",
      },
      {
        id: "time",
        question: "I barely have time to breathe. How will I do 30 days?",
        answer:
          "Each day takes 10-15 minutes max. You're not adding to your plate - you're building systems that SAVE you time. Most women save 30+ minutes daily by Week 2.",
        category: "product",
      },
      {
        id: "failed_before",
        question:
          "I've tried every system and failed. Why will this be different?",
        answer:
          "Because those systems assumed you have willpower and executive function. This one doesn't. It's designed for brains that can't 'just try harder.' Plus, it has built-in Restart Protocols for when you fall off.",
        category: "product",
      },
      {
        id: "format",
        question: "What format is it? Can I print it?",
        answer:
          "It's a professionally designed PDF (200+ pages). Works on any device (phone, tablet, computer, e-reader). You CAN print it, but it's designed for digital use with fillable sections.",
        category: "product",
      },
      {
        id: "medications",
        question: "I'm not on ADHD medication. Will this still work?",
        answer:
          "Yes. This program assumes ZERO medication. Every strategy works for unmedicated brains. (If you ARE medicated, it works even better - but it's not required.)",
        category: "product",
      },
      {
        id: "refund",
        question: "What if it doesn't work for me?",
        answer:
          "We offer a 30-day money-back guarantee. Try the guide risk-free. If it doesn't help you manage your ADHD better, we'll refund every penny. No questions asked.",
        category: "product",
      },
    ],
  },

  pricing: {
    title: "Your Complete 30-Day Program",
    subtitle: "Everything you need to go from chaos to clarity",
    mainPrice: 27,
    originalPrice: 87,
    currency: "USD",
    valueStack: [],
    included: [],
    highlights: [],
    guarantees: [],
  },

  finalCta: {
    title: "Ready to Stop Fighting Your ADHD Brain?",
    subtitle:
      "Join 500+ women who've already transformed their relationship with ADHD.",
    ctaText: "Start Your Transformation Now",
    guaranteeText:
      "Try the guide risk-free for 30 days. If it doesn't help you manage your ADHD better, we'll refund every penny. No questions asked.",
    urgencyMessage: undefined,
    stats: ["500+ women", "4.5/5 rating", "30-day program"],
  },

  stickyBar: {
    enabled: true,
    text: "Start Your Transformation",
    ctaText: "Get Instant Access",
    showTimer: false,
  },
  settings: {
    theme: "minimal",
    colors: {
      primary: "#52796F",
      secondary: "#4A4A4A",
      accent: "#84A98C",
    },
    showCountdown: false,
    countdownEnd: undefined,
    currency: "USD",
  },
};

export default adhdWomenConfig;
