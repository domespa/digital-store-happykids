import { ArrowLeft, Shield, Mail, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Site</span>
            </button>
            <div className="flex-1 flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <h1 className="text-lg font-bold text-gray-900">
                Privacy Policy
              </h1>
            </div>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-12 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Privacy Policy</h1>
                <p className="text-purple-100 text-sm mt-1">
                  Last Updated: October 21, 2025
                </p>
              </div>
            </div>
            <p className="text-purple-100 leading-relaxed">
              At H4ppyKids, we value your privacy and are committed to
              protecting your personal information. This policy explains how we
              collect, use, and safeguard your data.
            </p>
          </div>

          {/* Policy Content */}
          <div className="px-8 py-8 prose prose-sm max-w-none">
            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                This Privacy Policy describes how H4ppyKids ("we", "us", or
                "our") collects, uses, and protects your personal information
                when you use our e-commerce platform at https://H4ppyKids.com
                (the "Service").
              </p>
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
                <p className="text-sm text-purple-900">
                  <strong>Important Note:</strong> Our platform operates on a
                  guest checkout model. We do not require user registration or
                  maintain user accounts. Personal data is collected only when
                  you place an order.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                2. Controller Information
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="font-semibold text-gray-900 mb-3">
                  Data Controller:
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="font-medium">H4ppyKids</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>Via Frat. Cervi</p>
                      <p>Carlentini, Sicily, Italy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href="mailto:H4ppyKids@H4ppyKids.com"
                      className="text-purple-600 hover:text-purple-700"
                    >
                      H4ppyKids@H4ppyKids.com
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                3. What Information We Collect
              </h2>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                3.1 Order Information (Collected at Checkout)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                When you place an order, we collect:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                <li>Email address (for order confirmation and updates)</li>
                <li>Full name (first name and last name)</li>
                <li>Shipping address (street, city, postal code, country)</li>
                <li>Billing address (if different from shipping)</li>
                <li>Phone number (optional, for delivery purposes)</li>
              </ul>
              <p className="text-sm text-gray-600 italic mb-4">
                <strong>Legal Basis:</strong> Contract performance (Article
                6(1)(b) GDPR) - necessary to fulfill your order.
              </p>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-4">
                <p className="text-sm text-blue-900 font-medium mb-2">
                  🔒 Payment Information:
                </p>
                <p className="text-sm text-blue-800">
                  We do NOT store credit card details. Payment processing is
                  handled securely by Stripe and PayPal.
                </p>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
                3.2 IP-Based Approximate Location (Automatic)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We automatically detect your approximate location using your IP
                address:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="font-semibold text-green-900 mb-2">
                    ✅ What We Collect:
                  </p>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Country (e.g., Italy, USA)</li>
                    <li>• Approximate city</li>
                    <li>• Region/State</li>
                    <li>• Timezone</li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="font-semibold text-red-900 mb-2">
                    ❌ What We DON'T Collect:
                  </p>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Precise GPS coordinates</li>
                    <li>• Exact street address</li>
                    <li>• Real-time tracking</li>
                    <li>• Movement patterns</li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
                <p className="text-sm text-purple-900">
                  <strong>Why No Consent Required:</strong> IP-based approximate
                  location is processed under "legitimate interest" (GDPR
                  Article 6(1)(f)) because the data is not precise (city-level
                  only), is necessary for currency conversion and pricing, and
                  does not pose privacy risks.
                </p>
              </div>
            </section>

            {/* Section 4 - NEW: Third-Party Services */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                4. Third-Party Services
              </h2>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                4.1 Payment Processors
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                      <span className="text-sm">💳</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Stripe</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Processes credit card payments securely. Stripe is PCI DSS
                    Level 1 certified.
                  </p>
                  <a
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-600 hover:underline"
                  >
                    Privacy Policy →
                  </a>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-sm">🅿️</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">PayPal</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Alternative payment method. PayPal processes payments on
                    their secure platform.
                  </p>
                  <a
                    href="https://www.paypal.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-600 hover:underline"
                  >
                    Privacy Policy →
                  </a>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                4.2 Advertising & Analytics Pixels
              </h3>
              <p className="text-gray-700 mb-4">
                With your consent, we use tracking pixels to measure advertising
                effectiveness and improve our marketing:
              </p>

              {/* Meta Pixel */}
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-sm font-bold">f</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Meta Pixel (Facebook/Instagram)
                  </h4>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <strong>What it does:</strong> Tracks conversions from
                    Facebook and Instagram ads, enables retargeting
                  </p>
                  <p className="text-gray-700">
                    <strong>Data shared:</strong> Page views, products viewed,
                    items added to cart, purchases (anonymous device ID, no
                    personal info without consent)
                  </p>
                  <p className="text-gray-700">
                    <strong>Legal basis:</strong> Consent (GDPR Art. 6(1)(a))
                  </p>
                  <p className="text-gray-700">
                    <strong>Your control:</strong> Manage via cookie banner or{" "}
                    <a
                      href="https://www.facebook.com/ads/preferences"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      Facebook Ad Preferences
                    </a>
                  </p>
                </div>
              </div>

              {/* Google Ads */}
              <div className="border border-green-200 rounded-lg p-4 bg-green-50 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center border border-green-300">
                    <span className="text-sm font-bold text-green-600">G</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Google Ads Conversion Tracking
                  </h4>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <strong>What it does:</strong> Measures Google Search and
                    Display ad performance, tracks conversions
                  </p>
                  <p className="text-gray-700">
                    <strong>Data shared:</strong> Ad clicks, page views,
                    purchases, anonymous identifiers
                  </p>
                  <p className="text-gray-700">
                    <strong>Legal basis:</strong> Consent (GDPR Art. 6(1)(a))
                  </p>
                  <p className="text-gray-700">
                    <strong>Your control:</strong> Manage via cookie banner or{" "}
                    <a
                      href="https://adssettings.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      Google Ads Settings
                    </a>
                  </p>
                </div>
              </div>

              {/* TikTok Pixel */}
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                    <span className="text-white text-sm">🎵</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">TikTok Pixel</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <strong>What it does:</strong> Tracks conversions from
                    TikTok ads, enables ad targeting
                  </p>
                  <p className="text-gray-700">
                    <strong>Data shared:</strong> Page views, purchases,
                    browsing behavior, device info
                  </p>
                  <p className="text-gray-700">
                    <strong>Legal basis:</strong> Consent (GDPR Art. 6(1)(a))
                  </p>
                  <p className="text-gray-700">
                    <strong>Your control:</strong> Manage via cookie banner or{" "}
                    <a
                      href="https://www.tiktok.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      TikTok Privacy Center
                    </a>
                  </p>
                </div>
              </div>

              {/* Google Analytics */}
              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                    <span className="text-sm">📊</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Google Analytics 4
                  </h4>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <strong>What it does:</strong> Analyzes website traffic and
                    user behavior to improve our site
                  </p>
                  <p className="text-gray-700">
                    <strong>Data shared:</strong> Page views, session duration,
                    device type, location (city-level), anonymized IP
                  </p>
                  <p className="text-gray-700">
                    <strong>Legal basis:</strong> Consent (GDPR Art. 6(1)(a))
                  </p>
                  <p className="text-gray-700">
                    <strong>Your control:</strong> Manage via cookie banner or{" "}
                    <a
                      href="https://tools.google.com/dlpage/gaoptout"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      Google Analytics Opt-out
                    </a>
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
                <p className="text-sm text-purple-900">
                  <strong>Important:</strong> These tracking pixels are only
                  activated after you provide explicit consent via our cookie
                  banner. You can withdraw consent at any time by clicking
                  "Manage Cookies" in our footer or cookie banner.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                5. How We Use Your Information
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Order Fulfillment
                  </h4>
                  <p className="text-sm text-gray-700">
                    Process and ship your order, send confirmation emails,
                    provide customer support
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Payment Processing
                  </h4>
                  <p className="text-sm text-gray-700">
                    Process payments securely through Stripe or PayPal
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Marketing (with consent)
                  </h4>
                  <p className="text-sm text-gray-700">
                    Send promotional emails about new products and offers (you
                    can unsubscribe anytime)
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Analytics & Improvement
                  </h4>
                  <p className="text-sm text-gray-700">
                    Understand how visitors use our site to improve user
                    experience
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                6. Data Sharing
              </h2>
              <p className="text-gray-700 mb-4">
                We share your data only with trusted service providers:
              </p>
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-900">
                      Service Provider
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900">
                      Purpose
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900">
                      Data Shared
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-white">
                    <td className="p-3 text-gray-700 font-medium">
                      Stripe / PayPal
                    </td>
                    <td className="p-3 text-gray-600 text-xs">
                      Payment processing
                    </td>
                    <td className="p-3 text-gray-600 text-xs">
                      Name, email, billing address
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 text-gray-700 font-medium">
                      Shipping Partners
                    </td>
                    <td className="p-3 text-gray-600 text-xs">
                      Product delivery
                    </td>
                    <td className="p-3 text-gray-600 text-xs">
                      Name, shipping address, phone
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 text-gray-700 font-medium">
                      Meta / Google / TikTok
                    </td>
                    <td className="p-3 text-gray-600 text-xs">
                      Advertising (with consent)
                    </td>
                    <td className="p-3 text-gray-600 text-xs">
                      Anonymous behavior data
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>We never sell your personal data.</strong> All service
                  providers are bound by GDPR-compliant data processing
                  agreements.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                7. Your Rights Under GDPR
              </h2>
              <p className="text-gray-700 mb-4">
                If you are in the EU/EEA, you have the following rights:
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                  <p className="font-semibold text-purple-900 text-sm mb-1">
                    Right of Access (Art. 15)
                  </p>
                  <p className="text-xs text-purple-800">
                    Request a copy of your data
                  </p>
                </div>
                <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                  <p className="font-semibold text-purple-900 text-sm mb-1">
                    Right to Rectification (Art. 16)
                  </p>
                  <p className="text-xs text-purple-800">
                    Correct inaccurate information
                  </p>
                </div>
                <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                  <p className="font-semibold text-purple-900 text-sm mb-1">
                    Right to Erasure (Art. 17)
                  </p>
                  <p className="text-xs text-purple-800">
                    Request data deletion
                  </p>
                </div>
                <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                  <p className="font-semibold text-purple-900 text-sm mb-1">
                    Right to Data Portability (Art. 20)
                  </p>
                  <p className="text-xs text-purple-800">
                    Receive data in portable format
                  </p>
                </div>
                <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                  <p className="font-semibold text-purple-900 text-sm mb-1">
                    Right to Object (Art. 21)
                  </p>
                  <p className="text-xs text-purple-800">
                    Object to data processing
                  </p>
                </div>
                <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                  <p className="font-semibold text-purple-900 text-sm mb-1">
                    Right to Withdraw Consent
                  </p>
                  <p className="text-xs text-purple-800">
                    Withdraw cookie consent anytime
                  </p>
                </div>
              </div>
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">
                  How to Exercise Your Rights:
                </p>
                <p className="text-sm text-gray-700">
                  Email:{" "}
                  <a
                    href="mailto:thrivesadhd@gmail.com"
                    className="text-purple-600 hover:underline"
                  >
                    thrivesadhd@gmail.com
                  </a>
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  We will respond within 30 days.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                8. Data Retention
              </h2>
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-900">
                      Data Type
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-900">
                      Retention Period
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-white">
                    <td className="p-3 text-gray-700">Order Data</td>
                    <td className="p-3 text-gray-600">
                      7 years (legal/tax requirement)
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 text-gray-700">Marketing Emails</td>
                    <td className="p-3 text-gray-600">Until unsubscribe</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 text-gray-700">Analytics Data</td>
                    <td className="p-3 text-gray-600">
                      26 months (Google Analytics)
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 text-gray-700">Advertising Pixels</td>
                    <td className="p-3 text-gray-600">90 days to 13 months</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 text-gray-700">Payment Data</td>
                    <td className="p-3 text-gray-600">
                      Not stored (handled by Stripe/PayPal)
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* Contact Section */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                9. Contact Us
              </h2>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                <p className="text-gray-700 mb-4">
                  For privacy-related questions or to exercise your rights:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <a
                      href="H4ppyKids@H4ppyKids.com"
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      H4ppyKids@H4ppyKids.com
                    </a>
                  </div>
                  <p className="text-sm text-gray-600">
                    Response time: Within 48 hours
                  </p>
                </div>
              </div>
            </section>

            {/* Footer note */}
            <div className="bg-gray-100 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-600">
                By placing an order on H4ppyKids, you acknowledge that you have
                read and understood this Privacy Policy.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Last Updated: October 21, 2025 • Effective Date: January 21,
                2025
              </p>
            </div>
          </div>
        </div>

        {/* Back to top */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            ↑ Back to Top
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <p>© 2025 H4ppyKids. All rights reserved.</p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/")}
                className="hover:text-purple-600"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/cookie-policy")}
                className="hover:text-purple-600"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PrivacyPolicyPage;
