// ===========================
//           LANDING TYPES
// ===========================
export interface HeroConfig {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  subtext?: string;
}

export interface LandingUser {
  country: string;
  currency: string;
}

export interface BackendProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  compareAtPrice?: number | null;
  displayPrice?: number;
  displayCompareAtPrice?: number;
  images?: Array<{
    id: string;
    url: string;
    altText?: string | null;
    isMain: boolean;
  }>;
  isActive: boolean;
  createdAt: string;
}

export interface LandingContextType {
  config: LandingConfig | null;
  user: LandingUser | null;
  isLoading: boolean;
  backendProduct?: BackendProduct | null;
  isLoadingProduct?: boolean;
}

// PROB
export interface Problem {
  id: string;
  icon: string;
  title: string;
  description: string;
  painPoints: string[];
}

export interface ProblemsConfig {
  title: string;
  subtitle: string;
  problems: Problem[];
  emotionalHook: string;
}

// FEATURES
export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  benefits: string[];
}

export interface Bonus {
  id: string;
  title: string;
  description: string;
  value: number;
  icon: string;
}

// PRICING
export interface PricingHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface PricingBonus {
  title: string;
  description: string;
  value: number;
}

export interface PricingUrgency {
  enabled: boolean;
  message: string;
  countdown?: boolean;
}

export interface PricingConfig {
  title: string;
  subtitle: string;
  mainPrice: number;
  originalPrice: number;
  currency: string;
  included: string[];
  highlights: PricingHighlight[];
  guarantees: string[];
  urgency?: PricingUrgency;
  bonuses?: PricingBonus[];
  valueStack?: Array<{
    item: string;
    value: number | string;
  }>;
  individualOption?: IndividualOption;
}

export interface FeaturesConfig {
  title: string;
  subtitle: string;
  features: Feature[];
  bonuses: Bonus[];
}

// TESTIM
export interface Testimonial {
  id: string;
  name: string;
  title?: string;
  location?: string;
  content: string;
  rating: number;
  before?: string;
  after?: string;
}

export interface TestimonialsConfig {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

// FAQ
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQConfig {
  title: string;
  subtitle: string;
  faqs: FAQ[];
}

export interface TrustBarConfig {
  stats: Array<{
    number: string;
    label: string;
    icon?: string;
  }>;
  trustedBy?: string;
  logos?: Array<{
    name: string;
    url: string;
  }>;
}

export interface UrgencyConfig {
  enabled: boolean;
  endDate: string;
  message: string;
  urgencyText: string;
  showStock?: boolean;
  stockRemaining?: number;
}

export interface ContentPreviewConfig {
  title: string;
  subtitle: string;
  totalPages: number;
  chapters: Array<{
    number: number;
    title: string;
    description: string;
    highlights?: string[];
  }>;
}

export interface FinalCtaConfig {
  title: string;
  subtitle: string;
  ctaText: string;
  guaranteeText: string;
  urgencyMessage?: string;
  stats: string[];
}

export interface StickyBarConfig {
  enabled: boolean;
  text: string;
  ctaText: string;
  showTimer: boolean;
}

export interface LandingConfig {
  productId?: string;
  productIds?: string[];
  workbooksShowcase?: WorkbooksShowcase;
  hero: HeroConfig;
  problems: ProblemsConfig;
  features: FeaturesConfig;
  testimonials: TestimonialsConfig;
  faq: FAQConfig;
  pricing: PricingConfig;
  settings: {
    theme: "default" | "dark" | "minimal";
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background?: string;
      text?: string;
      textLight?: string;
      border?: string;
      success?: string;
      error?: string;
    };
    showCountdown?: boolean;
    countdownEnd?: string;
    currency: string;
  };
  trustBar: TrustBarConfig;
  urgency: UrgencyConfig;
  contentPreview: ContentPreviewConfig;
  finalCta: FinalCtaConfig;
  stickyBar: StickyBarConfig;
}

export interface WorkbookItem {
  id: string;
  name: string;
  pages: number;
  price: number;
  priceEUR: number;
  image: string;
  description?: string;
  highlights?: string[];
}

export interface WorkbooksShowcase {
  title: string;
  subtitle: string;
  workbooks: WorkbookItem[];
  upsellMessage?: string;
  showIndividualPricing?: boolean;
}

export interface IndividualOption {
  enabled: boolean;
  price: number;
  priceEUR: number;
  note?: string;
}

export interface LandingPageProps {
  config: LandingConfig;
  className?: string;
}
