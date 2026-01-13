// ============================================
//       ACTIVITY MESSAGES DATABASE
// ============================================

// CITTÀ INTERNAZIONALI (English-speaking + major cities)
export const INTERNATIONAL_CITIES = [
  "London",
  "New York",
  "Los Angeles",
  "Toronto",
  "Sydney",
  "Melbourne",
  "Dublin",
  "Edinburgh",
  "Vancouver",
  "Boston",
  "Chicago",
  "Austin",
  "Seattle",
  "San Francisco",
  "Miami",
  "Atlanta",
  "Portland",
  "Denver",
  "Manchester",
  "Glasgow",
];

// NOMI FEMMINILI (ADHD-appropriate, diverse)
export const FEMALE_NAMES = [
  "Sarah",
  "Emma",
  "Olivia",
  "Ava",
  "Mia",
  "Isabella",
  "Sophia",
  "Charlotte",
  "Amelia",
  "Harper",
  "Evelyn",
  "Abigail",
  "Emily",
  "Elizabeth",
  "Sofia",
  "Madison",
  "Avery",
  "Ella",
  "Scarlett",
  "Grace",
];

// PRODOTTI (EBOOK ADHD in Women specifici)
export const PRODUCTS = [
  "ADHD in Women Ebook",
  "Complete Bundle",
  "Digital Guide",
  "ADHD Resource Pack",
  "Women's ADHD Guide",
  "Understanding ADHD Ebook",
];

// ============================================
//       MESSAGE TEMPLATES
// ============================================

export interface ActivityMessage {
  type: "connection" | "cart" | "purchase" | "view" | "stat" | "community";
  template: string;
  icon: string;
  priority: number; // 1=highest, 5=lowest
  requiresData?: boolean;
}

// TIPO 1: CONNESSIONI (Real WebSocket)
export const CONNECTION_MESSAGES: ActivityMessage[] = [
  {
    type: "connection",
    template: "Someone from {city} just joined",
    icon: "💜",
    priority: 1,
    requiresData: true,
  },
  {
    type: "connection",
    template: "{name} from {city} is here",
    icon: "🌟",
    priority: 1,
    requiresData: true,
  },
  {
    type: "connection",
    template: "An ADHD warrior from {city} just connected",
    icon: "✨",
    priority: 2,
    requiresData: true,
  },
];

// TIPO 2: CARRELLO (Real WebSocket)
export const CART_MESSAGES: ActivityMessage[] = [
  {
    type: "cart",
    template: "Someone from {city} just grabbed this ebook",
    icon: "📚",
    priority: 1,
    requiresData: true,
  },
  {
    type: "cart",
    template: "{name} from {city} added to cart",
    icon: "🛒",
    priority: 1,
    requiresData: true,
  },
  {
    type: "cart",
    template: "Someone just got {product}",
    icon: "✨",
    priority: 2,
    requiresData: true,
  },
];

// TIPO 3: ACQUISTI (Real WebSocket)
export const PURCHASE_MESSAGES: ActivityMessage[] = [
  {
    type: "purchase",
    template: "Just purchased from {city} - Welcome! 🎉",
    icon: "✅",
    priority: 1,
    requiresData: true,
  },
  {
    type: "purchase",
    template: "{name} from {city} just started their ADHD journey",
    icon: "🌟",
    priority: 1,
    requiresData: true,
  },
  {
    type: "purchase",
    template: "Someone just got the {product}",
    icon: "💪",
    priority: 2,
    requiresData: true,
  },
];

// TIPO 4: VISUALIZZAZIONI (Fake Smart)
export const VIEW_MESSAGES: ActivityMessage[] = [
  {
    type: "view",
    template: "{count} women are reading this right now",
    icon: "👀",
    priority: 3,
    requiresData: false,
  },
  {
    type: "view",
    template: "Someone from {city} is viewing the ebook",
    icon: "📖",
    priority: 3,
    requiresData: false,
  },
  {
    type: "view",
    template: "{count} people considering {product}",
    icon: "💜",
    priority: 4,
    requiresData: false,
  },
];

// TIPO 5: STATISTICHE DATABASE (Real DB Stats)
export const STAT_MESSAGES: ActivityMessage[] = [
  {
    type: "stat",
    template: "This ebook has 86 five-star reviews ⭐⭐⭐⭐⭐",
    icon: "⭐",
    priority: 1,
    requiresData: false,
  },
  {
    type: "stat",
    template: "{count} women found clarity this month",
    icon: "💪",
    priority: 2,
    requiresData: true,
  },
  {
    type: "stat",
    template: "{count}% report better understanding after reading",
    icon: "🎯",
    priority: 2,
    requiresData: true,
  },
  {
    type: "stat",
    template: "{count} downloads completed this week",
    icon: "✨",
    priority: 3,
    requiresData: true,
  },
  {
    type: "stat",
    template: "Helped {count} women with ADHD this month",
    icon: "💜",
    priority: 2,
    requiresData: true,
  },
];

// TIPO 6: COMMUNITY (Supportive)
export const COMMUNITY_MESSAGES: ActivityMessage[] = [
  {
    type: "community",
    template: "Join 500+ ADHD warriors thriving together",
    icon: "🌱",
    priority: 4,
    requiresData: false,
  },
  {
    type: "community",
    template: "Welcome! You're in good company",
    icon: "💜",
    priority: 4,
    requiresData: false,
  },
  {
    type: "community",
    template: "Small steps lead to big changes",
    icon: "✨",
    priority: 5,
    requiresData: false,
  },
  {
    type: "community",
    template: "You've got this - start today",
    icon: "💪",
    priority: 5,
    requiresData: false,
  },
  {
    type: "community",
    template: "94% would recommend to a friend",
    icon: "⭐",
    priority: 3,
    requiresData: false,
  },
];

// ============================================
//       HELPER FUNCTIONS
// ============================================

// RANDOM CITY
export const getRandomCity = (): string => {
  return INTERNATIONAL_CITIES[
    Math.floor(Math.random() * INTERNATIONAL_CITIES.length)
  ];
};

// RANDOM NAME
export const getRandomName = (): string => {
  return FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];
};

// RANDOM PRODUCT
export const getRandomProduct = (): string => {
  return PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
};

// RANDOM COUNT (credibile)
export const getRandomCount = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// GENERA MESSAGGIO DA TEMPLATE
export const generateMessage = (
  message: ActivityMessage,
  data?: {
    city?: string;
    name?: string;
    product?: string;
    count?: number;
  }
): string => {
  let result = message.template;

  // Sostituisci placeholders
  if (data?.city) {
    result = result.replace("{city}", data.city);
  } else {
    result = result.replace("{city}", getRandomCity());
  }

  if (data?.name) {
    result = result.replace("{name}", data.name);
  } else {
    result = result.replace("{name}", getRandomName());
  }

  if (data?.product) {
    result = result.replace("{product}", data.product);
  } else {
    result = result.replace("{product}", getRandomProduct());
  }

  if (data?.count !== undefined) {
    result = result.replace("{count}", data.count.toString());
  } else {
    // Random count credibile
    const randomCount = getRandomCount(2, 8);
    result = result.replace("{count}", randomCount.toString());
  }

  return result;
};

// SELEZIONA MESSAGGIO RANDOM DA CATEGORIA
export const getRandomMessage = (
  category: ActivityMessage[]
): ActivityMessage => {
  return category[Math.floor(Math.random() * category.length)];
};

// TUTTI I MESSAGGI COMBINATI
export const ALL_MESSAGES = [
  ...CONNECTION_MESSAGES,
  ...CART_MESSAGES,
  ...PURCHASE_MESSAGES,
  ...VIEW_MESSAGES,
  ...STAT_MESSAGES,
  ...COMMUNITY_MESSAGES,
];

// FILTRA PER PRIORITY
export const getMessagesByPriority = (
  maxPriority: number = 3
): ActivityMessage[] => {
  return ALL_MESSAGES.filter((msg) => msg.priority <= maxPriority);
};
