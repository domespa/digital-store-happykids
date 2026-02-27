import type { LandingConfig } from "../../types/landing";

export const workbooksConfig: LandingConfig = {
  productId: "cml87a3250000140vhvtptbd6", // BUNDLE CMPLETO
  productIds: [
    "cml874iv70000j5ma3lmjfjzq", // A RAINBOW OF COLORS
    "cml874jfl0001j5ma9jkc2hl7", // LETTERS AND NUMBERS IN PLAY
    "cml874jyu0002j5mapb5yr6zg", // MY FIRST WRITING ADVENTURES
    "cml874ki50003j5macmb9lxda", // THE BIG BOOK OF ANIMALS AND DINO
    "cml874l1f0004j5ma1ve5e511", // WORLD OF SHAPES
  ],

  hero: {
    title: "The iPad Has Become Your Third Parent. Here's How to Fix It.",
    subtitle:
      "Fun, simple activities that naturally replace screen time for toddlers aged 3-5 - without tantrums, guilt, or losing your sanity.",
    image: "/cover.png",
    ctaText: "Reclaim Real Childhood",
    subtext: "5 workbooks • Ages 3-5 • Parent-friendly • Instant download",
  },

  trustBar: {
    stats: [
      { number: "5", label: "Workbooks", icon: "book-open" },
      { number: "295", label: "Total Pages", icon: "file-text" },
      { number: "150+", label: "Activities", icon: "sparkles" },
      { number: "3-5", label: "Years Old", icon: "users" },
    ],
    trustedBy: "Created by parents who refused to let screens raise their kids",
  },

  workbooksShowcase: {
    title: "What's Inside: 5 Complete Workbooks",
    subtitle:
      "295 pages designed to replace screen time naturally - so your toddler chooses real play without you forcing it.",
    showIndividualPricing: true,
    upsellMessage:
      "💡 Smart Choice: Get all 5 workbooks for €25 instead of buying separately and save €10!",
    workbooks: [
      {
        id: "cml874iv70000j5ma3lmjfjzq",
        name: "A Rainbow of Colors",
        pages: 47,
        price: 5,
        priceEUR: 5,
        image: "/cover-ebook/ranibowofcolors.jpg",
        description:
          "Color recognition, matching, and creative expression that keeps toddlers engaged for 30+ minutes.",
        highlights: [
          "15 color-matching activities",
          "No prep needed",
          "Perfect for short attention spans",
        ],
        previewImages: [
          "/extractebooks/arainbow1.jpg",
          "/extractebooks/arainbow2.jpg",
          "/extractebooks/arainbow3.jpg",
          "/extractebooks/arainbow4.jpg",
        ],
      },
      {
        id: "cml874jfl0001j5ma9jkc2hl7",
        name: "Letters and Numbers in Play",
        pages: 60,
        price: 5,
        priceEUR: 5,
        image: "/cover-ebook/lettersnumbersinplay.jpg",
        description:
          "Early literacy and math skills disguised as fun - because forcing ABCs doesn't work.",
        highlights: [
          "Letter tracing that doesn't feel like homework",
          "Number games that build counting skills",
          "Prepares them for kindergarten",
        ],
        previewImages: [
          "/extractebooks/letter1.jpg",
          "/extractebooks/letter2.jpg",
          "/extractebooks/letter3.jpg",
          "/extractebooks/letter4.jpg",
        ],
      },
      {
        id: "cml874jyu0002j5mapb5yr6zg",
        name: "My First Writing Adventure",
        pages: 59,
        price: 5,
        priceEUR: 5,
        image: "/cover-ebook/myfirstadventure.jpg",
        description:
          "Pre-writing skills that build confidence and focus - two things screens destroyed.",
        highlights: [
          "Line tracing and patterns",
          "Improves hand-eye coordination",
          "Builds focus and patience",
        ],
        previewImages: [
          "/extractebooks/writing1.jpg",
          "/extractebooks/writing2.jpg",
          "/extractebooks/writing3.jpg",
          "/extractebooks/writing4.jpg",
        ],
      },
      {
        id: "cml874ki50003j5macmb9lxda",
        name: "The Big Book of Animals and Dinosaurs",
        pages: 64,
        price: 5,
        priceEUR: 5,
        image: "/cover-ebook/animals.jpg",
        description:
          "Every toddler loves animals. Use it. This workbook taps into natural curiosity.",
        highlights: [
          "Animal matching and coloring",
          "Dinosaur activities",
          "Real engagement, not passive watching",
        ],
        previewImages: [
          "/extractebooks/animals1.jpg",
          "/extractebooks/animals2.jpg",
          "/extractebooks/animals3.jpg",
          "/extractebooks/animals4.jpg",
        ],
      },
      {
        id: "cml874l1f0004j5ma1ve5e511",
        name: "World of Shapes",
        pages: 65,
        price: 5,
        priceEUR: 5,
        image: "/cover-ebook/worldofshapes.jpg",
        description:
          "Spatial reasoning and problem-solving through hands-on activities - not passive watching.",
        highlights: [
          "Shape recognition games",
          "Critical thinking skills",
          "Independent play (you can breathe)",
        ],
        previewImages: [
          "/extractebooks/shapes1.jpg",
          "/extractebooks/shapes2.jpg",
          "/extractebooks/shapes3.jpg",
          "/extractebooks/shapes4.jpg",
        ],
      },
    ],
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
    title:
      "Your Toddler Prefers the iPad to You. And It's Breaking Your Heart.",
    subtitle:
      "You're not a bad parent. You're just exhausted. But screens are stealing the best years of your child's development - and you know it.",
    emotionalHook:
      "The iPad has become your third parent. Your toddler asks for it before breakfast. Melts down without it. Doesn't know how to play anymore. And you're too tired to fight.",
    problems: [
      {
        id: "screen-babysitter",
        icon: "tablet",
        title: "The iPad Babysitter",
        description:
          "You swore you'd never be 'that parent.' But here you are, handing over the screen just to get through the day.",
        painPoints: [
          "They ask for the tablet the moment they wake up",
          "You use it to get 20 minutes of peace just to make dinner",
          "They can't sit through a meal without a screen anymore",
          "You feel guilty every single time, but you're too exhausted to stop",
        ],
      },
      {
        id: "tantrum-terror",
        icon: "volume-2",
        title: "The Meltdown Monster",
        description:
          "Taking the screen away triggers World War III. So you give in. Again. And again.",
        painPoints: [
          "Epic meltdowns that last 30+ minutes when screen time ends",
          "They scream, cry, and throw things - you can't take them anywhere",
          "You negotiate like a hostage situation just to avoid the tantrum",
          "You've given up trying because the peace isn't worth the war",
        ],
      },
      {
        id: "forgot-how-to-play",
        icon: "frown",
        title: "They Forgot How to Play",
        description:
          "Remember when they used to play with toys, explore, imagine? Now it's just... screens.",
        painPoints: [
          "Toys sit untouched while they beg for 'just 5 more minutes'",
          "They say they're 'bored' unless there's a screen involved",
          "They can't focus on anything for more than 30 seconds",
          "Their imagination has been replaced by YouTube autoplay",
        ],
      },
      {
        id: "judgment-guilt",
        icon: "heart-crack",
        title: "The Guilt & Judgment",
        description:
          "You see other parents' perfect Instagram posts and wonder what you did wrong.",
        painPoints: [
          "Other parents judge you at the playground ('My child never uses screens')",
          "You feel like you failed because you gave in 'too early'",
          "You know this isn't healthy, but you don't know how to fix it",
          "Every night you promise yourself 'tomorrow will be different' - but it never is",
        ],
      },
      {
        id: "developmental-damage",
        icon: "alert-triangle",
        title: "The Development You Can't Get Back",
        description:
          "Ages 3-5 are CRITICAL. And every hour on screens is an hour they're not developing the skills that matter.",
        painPoints: [
          "Their speech is delayed compared to other kids their age",
          "They struggle with eye contact and don't play with other children",
          "They can't sit still, follow instructions, or focus on anything real",
          "You're terrified this is damaging them permanently - and you're right",
        ],
      },
    ],
  },

  contentPreview: {
    title: "Why the Complete Bundle Is Your Best Choice",
    subtitle:
      "Everything you need to replace screen time - in one complete package",
    totalPages: 295,
    chapters: [
      {
        number: 1,
        title: "295 Pages of Engaging Activities",
        description:
          "From simple coloring to pre-writing skills - designed for ages 3-5",
        highlights: [
          "Activities last 3-5 minutes each (perfect for toddler attention spans)",
          "Progressive difficulty: starts easy, gets more challenging",
          "No reading required - kids can do most activities independently",
        ],
      },
      {
        number: 2,
        title: "Complete Skill Development System",
        description: "Covers everything a 3-5 year old needs to develop",
        highlights: [
          "Colors, letters, numbers, shapes, animals - all covered",
          "Fine motor skills: tracing, coloring, matching",
          "Focus and patience: learning to finish without instant rewards",
        ],
      },
      {
        number: 3,
        title: "Zero Prep, Maximum Results",
        description: "Print what you need, when you need it",
        highlights: [
          "Just crayons or markers needed (you already have those)",
          "Print unlimited copies for all your kids",
          "Activities they can do alone while you make dinner",
        ],
      },
      {
        number: 4,
        title: "Parent Survival Guide (BONUS)",
        description:
          "How to actually transition from screens to workbooks without World War III",
        highlights: [
          "Tantrum management strategies",
          "When to introduce workbooks (timing matters)",
          "Realistic timelines: 1-2 weeks to see change",
        ],
      },
      {
        number: 5,
        title: "Screen Replacement Strategies (BONUS)",
        description: "Exactly when and how to introduce workbooks",
        highlights: [
          "Morning iPad? Replace with coloring workbook",
          "Car rides? Bring the animals workbook",
          "Before bed? Shapes workbook for calm-down time",
        ],
      },
    ],
  },

  features: {
    title: "What Makes This Different From 'Just Another Activity Book'",
    subtitle:
      "These aren't random coloring pages. They're a systematic replacement for screen addiction - designed by parents who lived it.",
    features: [
      {
        id: "anti-screen-design",
        icon: "shield-off",
        title: "Designed to Beat the iPad",
        description:
          "Most activity books are boring. These are engineered to compete with screens.",
        benefits: [
          "High visual engagement: colors, characters, variety",
          "Instant gratification: every page feels like 'winning'",
          "No frustration: activities match 3-5 year old capabilities exactly",
          "Dopamine hits without the screen: completion = accomplishment",
        ],
      },
      {
        id: "comprehensive-system",
        icon: "package",
        title: "Complete System, Not Random Pages",
        description:
          "5 workbooks covering everything a 3-5 year old needs to develop.",
        benefits: [
          "Colors, letters, numbers, animals, shapes - all covered",
          "295 pages total: months of screen-free activities",
          "Can rotate workbooks to prevent boredom",
          "Builds skills progressively (not just 'keep them busy')",
        ],
      },
      {
        id: "realistic-for-parents",
        icon: "heart",
        title: "Built for Exhausted Parents",
        description: "No guilt. No judgment. Just practical tools that work.",
        benefits: [
          "Print what you need, when you need it",
          "Activities they can do independently (you can breathe)",
          "No expensive supplies: just basic crayons/markers",
          "Works even if you're too tired to 'engage' right now",
        ],
      },
      {
        id: "multiple-kids",
        icon: "users",
        title: "Print Unlimited Copies",
        description:
          "One purchase = unlimited prints for all your kids, forever.",
        benefits: [
          "Have multiple kids? Print for each of them",
          "Mess up a page? Print another one",
          "Want to save originals? Print practice copies",
          "Lifetime access: download whenever you need it",
        ],
      },
    ],
    bonuses: [
      {
        id: "parent-guide",
        title: "Parent Survival Guide",
        description:
          "How to actually transition from screens to workbooks without World War III in your living room. Includes tantrum management and realistic timelines.",
        value: 12,
        icon: "book-open",
      },
      {
        id: "progress-tracker",
        title: "Progress Tracker",
        description:
          "Simple one-page sheet to track which activities your toddler loved (so you can print more of those). Because some kids love coloring, others love tracing.",
        value: 7,
        icon: "check-square",
      },
      {
        id: "replacement-strategies",
        title: "Screen Replacement Strategies",
        description:
          "Exactly when and how to introduce workbooks to replace specific screen times. Morning iPad? Car rides? Before bed? We've got you covered.",
        value: 9,
        icon: "repeat",
      },
    ],
  },

  testimonials: {
    title: "You're Not The Only One Fighting This Battle",
    subtitle:
      "Every parent with a screen-addicted toddler knows these struggles.",
    testimonials: [
      {
        id: "battle-1",
        name: "",
        title: "",
        location: "",
        content:
          "Your toddler asks for the iPad before saying 'good morning.' You've tried saying no. The 45-minute meltdown isn't worth it anymore.",
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
          "Every toy sits untouched. 'I'm bored' means 'give me the tablet.' They've completely forgotten how to play with anything real.",
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
          "You use screens just to get through dinner, the grocery store, car rides. You feel guilty every time, but you're too exhausted to fight.",
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
          "Other parents say 'just take it away.' Sure. Then what? They scream for 2 hours and you have nothing to replace it with.",
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
          "Ages 3-5 are supposed to be magical. Instead, your child stares at a screen while their development slips away. You know this isn't okay.",
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
          "You bought educational apps, 'learning' shows. Doesn't matter. They're still glued to screens and can't focus on anything real.",
        rating: 0,
        before: "",
        after: "",
      },
    ],
  },

  faq: {
    title: "Before You Think 'My Kid Won't Do This'",
    subtitle: "Every parent worries about this. Here's the truth.",
    faqs: [
      {
        id: "too-young",
        question: "My toddler can't even write yet. Will this work?",
        answer:
          "These workbooks are designed for ages 3-5, including kids who haven't learned to write. Most activities are coloring, tracing, and matching - perfect for little hands still developing motor skills. They don't need to 'know' anything to start.",
        category: "product",
      },
      {
        id: "wont-engage",
        question:
          "What if my child refuses to do it and just asks for the iPad?",
        answer:
          "Start with ONE page when they're NOT asking for screens - like after breakfast or before lunch. Make it available, not forced. Most toddlers get curious when there's no pressure. If they ignore it, try again tomorrow. The workbooks aren't going anywhere.",
        category: "product",
      },
      {
        id: "attention-span",
        question:
          "My kid can't focus for more than 2 minutes. How will this help?",
        answer:
          "That's exactly why these work. Each activity is designed for 3-5 minutes max - perfect for toddler attention spans destroyed by screens. They do ONE page, feel accomplished, move on. Short bursts = rebuilding focus naturally.",
        category: "product",
      },
      {
        id: "mess",
        question:
          "I don't have time for messy crafts. Is this more work for me?",
        answer:
          "No. Print a few pages, hand them crayons, done. No glue, no cutting, no cleanup beyond putting crayons back. These are designed for exhausted parents who need kids occupied, not Pinterest projects.",
        category: "product",
      },
      {
        id: "bundle-vs-single",
        question: "Should I buy the bundle or start with one workbook?",
        answer:
          "Most parents buy the bundle because variety prevents boredom. If your toddler only does ONE type of activity (like coloring), they'll lose interest fast. 5 workbooks = rotation options for months. But you can start with one if you want to test it.",
        category: "product",
      },
      {
        id: "unlimited-prints",
        question: "Can I print multiple copies? I have 3 kids.",
        answer:
          "Yes. Print unlimited copies for your own family. Have twins? Print two. Mess up a page? Print another. Save the originals and print practice copies. Lifetime access means you own it forever.",
        category: "product",
      },
      {
        id: "instant-fix",
        question: "Will this magically make my kid stop asking for screens?",
        answer:
          "No. This isn't magic. These workbooks give you something BETTER to offer when they ask for the iPad. 'Not right now, but look at THIS!' Eventually, they choose the workbook because it's engaging. It takes time - usually 1-2 weeks of consistency.",
        category: "product",
      },
    ],
  },

  pricing: {
    title: "Complete Workbooks Bundle: 295 Pages of Screen-Free Salvation",
    subtitle:
      "Everything you need to replace screen time without losing your mind",
    mainPrice: 25,
    originalPrice: 35,
    currency: "EUR",
    individualOption: {
      enabled: true,
      price: 5,
      priceEUR: 5,
      note: "Or buy workbooks individually for €5 each (but you'll miss the €10 savings)",
    },
    valueStack: [
      { item: "A Rainbow of Colors (47 pages)", value: "€5" },
      { item: "Letters and Numbers in Play (60 pages)", value: "€5" },
      { item: "My First Writing Adventure (59 pages)", value: "€5" },
      { item: "Big Book of Animals & Dinosaurs (64 pages)", value: "€5" },
      { item: "World of Shapes (65 pages)", value: "€5" },
      { item: "Parent Survival Guide (BONUS)", value: "€12" },
      { item: "Screen Replacement Strategies (BONUS)", value: "€9" },
    ],
    included: [
      "Instant digital download (5 PDF workbooks)",
      "295 total pages of activities",
      "Print unlimited copies for your family",
      "Ages 3-5 (pre-writing, no reading required)",
    ],
    highlights: [
      {
        icon: "download",
        title: "Instant Download",
        description: "Start TODAY - stop the screen battles tonight",
      },
      {
        icon: "printer",
        title: "Print Unlimited",
        description: "One purchase = unlimited prints for all your kids",
      },
      {
        icon: "zap",
        title: "Zero Prep",
        description: "Print → Hand to toddler → Breathe",
      },
    ],
    guarantees: ["Instant access, lifetime downloads"],
    urgency: {
      enabled: false,
      message: "",
      countdown: false,
    },
  },

  finalCta: {
    title: "Your Toddler's Development Can't Wait",
    subtitle:
      "Ages 3-5 are critical. Every day on screens is a day they're not building the skills that matter. Start today.",
    ctaText: "Get The Complete Bundle Now",
    guaranteeText:
      "Try it risk-free for 30 days. If your toddler won't engage with ANY of the 295 pages, we'll refund every penny. No questions asked.",
    urgencyMessage: "",
    stats: [
      "295 pages of activities",
      "5 complete workbooks",
      "Instant download",
    ],
  },

  stickyBar: {
    enabled: true,
    text: "End Screen Battles",
    ctaText: "Get Bundle Now - €25",
    showTimer: false,
  },

  settings: {
    theme: "default",
    colors: {
      primary: "primary",
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

export default workbooksConfig;
