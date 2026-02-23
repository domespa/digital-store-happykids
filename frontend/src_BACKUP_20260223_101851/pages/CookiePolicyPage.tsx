import { ArrowLeft, Cookie, Mail, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CookiePolicyPage() {
  const navigate = useNavigate();

  const openCookieSettings = () => {
    // Clear consent to re-show banner
    localStorage.removeItem("cookie_consent");
    navigate("/");
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
              <Cookie className="w-5 h-5 text-blue-600" />
              <h1 className="text-lg font-bold text-gray-900">Cookie Policy</h1>
            </div>
            <button
              onClick={openCookieSettings}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Manage Cookies</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Cookie className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Cookie Policy</h1>
                <p className="text-blue-100 text-sm mt-1">
                  Last Updated: October 21, 2025
                </p>
              </div>
            </div>
            <p className="text-blue-100 leading-relaxed">
              This Cookie Policy explains how H4ppyKids uses cookies and similar
              tracking technologies on our website to enhance your experience.
            </p>
          </div>

          {/* Policy Content */}
          <div className="px-8 py-8 prose prose-sm max-w-none">
            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                1. What Are Cookies?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cookies are small text files that are stored on your device
                (computer, smartphone, tablet) when you visit a website. They
                help the website recognize your device and remember information
                about your visit.
              </p>
              <div className="grid md:grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="font-semibold text-blue-900 text-sm mb-1">
                    🍪 Cookies
                  </p>
                  <p className="text-xs text-blue-800">
                    Small text files stored by your browser
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="font-semibold text-blue-900 text-sm mb-1">
                    💾 Local Storage
                  </p>
                  <p className="text-xs text-blue-800">
                    HTML5 web storage (more persistent)
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="font-semibold text-blue-900 text-sm mb-1">
                    ⏱️ Session Storage
                  </p>
                  <p className="text-xs text-blue-800">
                    Temporary, cleared when you close browser
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                2. Cookie Categories
              </h2>

              {/* Essential */}
              <div className="mb-6 border border-green-200 rounded-xl overflow-hidden">
                <div className="bg-green-50 px-4 py-3 border-b border-green-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-green-900">
                      🔒 Essential Cookies
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Always Active
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-sm text-gray-700 mb-3">
                    Strictly necessary for the website to function properly. No
                    consent required.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-900 mb-2">
                      Examples:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>
                        •{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          cart_token
                        </code>{" "}
                        - Shopping cart contents
                      </li>
                      <li>
                        •{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          session_id
                        </code>{" "}
                        - Browsing session
                      </li>
                      <li>
                        •{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          checkout_session
                        </code>{" "}
                        - Checkout process
                      </li>
                      <li>
                        •{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          csrf_token
                        </code>{" "}
                        - Security protection
                      </li>
                    </ul>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Duration: Session to 30 days
                  </p>
                </div>
              </div>

              {/* Functional */}
              <div className="mb-6 border border-purple-200 rounded-xl overflow-hidden">
                <div className="bg-purple-50 px-4 py-3 border-b border-purple-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-purple-900">
                      ⚙️ Functional Cookies
                    </h3>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      Consent Required
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-sm text-gray-700 mb-3">
                    Enhance your experience by remembering your preferences.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-900 mb-2">
                      Examples:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>
                        •{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          currency_preference
                        </code>{" "}
                        - Your selected currency
                      </li>
                      <li>
                        •{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          language_preference
                        </code>{" "}
                        - Preferred language
                      </li>
                      <li>
                        •{" "}
                        <code className="bg-gray-200 px-1 rounded">
                          location_data
                        </code>{" "}
                        - Approximate location for pricing
                      </li>
                    </ul>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Duration: 30-90 days
                  </p>
                </div>
              </div>

              {/* Analytics */}
              <div className="mb-6 border border-blue-200 rounded-xl overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-blue-900">
                      📊 Analytics Cookies
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      Consent Required
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-sm text-gray-700 mb-3">
                    Help us understand how visitors use our website so we can
                    improve it.
                  </p>

                  {/* Google Analytics 4 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center">
                        <span className="text-xs">📈</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Google Analytics 4 (GA4)
                      </h4>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 mb-2">
                      <p className="text-xs font-semibold text-gray-900 mb-1">
                        Cookies Used:
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>
                          •{" "}
                          <code className="bg-gray-200 px-1 rounded">_ga</code>{" "}
                          - Distinguish users (2 years)
                        </li>
                        <li>
                          •{" "}
                          <code className="bg-gray-200 px-1 rounded">
                            _ga_*
                          </code>{" "}
                          - Session data (2 years)
                        </li>
                        <li>
                          •{" "}
                          <code className="bg-gray-200 px-1 rounded">_gid</code>{" "}
                          - Distinguish users (24 hours)
                        </li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        Provider: Google LLC
                      </span>
                      <a
                        href="https://tools.google.com/dlpage/gaoptout"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Opt-out →
                      </a>
                    </div>
                  </div>

                  {/* Google Ads Conversion */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                        <span className="text-xs">🎯</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Google Ads Conversion Tracking
                      </h4>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 mb-2">
                      <p className="text-xs font-semibold text-gray-900 mb-1">
                        Cookies Used:
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>
                          •{" "}
                          <code className="bg-gray-200 px-1 rounded">
                            _gcl_au
                          </code>{" "}
                          - Store click info (90 days)
                        </li>
                        <li>
                          •{" "}
                          <code className="bg-gray-200 px-1 rounded">
                            _gac_*
                          </code>{" "}
                          - Campaign data (90 days)
                        </li>
                      </ul>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      <strong>Purpose:</strong> Measure advertising campaign
                      effectiveness and track conversions from Google Ads.
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        Provider: Google LLC
                      </span>
                      <a
                        href="https://adssettings.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Manage ads →
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketing */}
              <div className="mb-6 border border-pink-200 rounded-xl overflow-hidden">
                <div className="bg-pink-50 px-4 py-3 border-b border-pink-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-pink-900">
                      🎯 Marketing Cookies
                    </h3>
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">
                      Consent Required
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-sm text-gray-700 mb-4">
                    Used to show you relevant ads based on your interests and
                    measure ad campaign effectiveness.
                  </p>

                  {/* Meta Pixel */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-xs">📘</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Meta Pixel (Facebook/Instagram Ads)
                      </h4>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 mb-2">
                      <p className="text-xs font-semibold text-gray-900 mb-1">
                        Cookies Used:
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>
                          •{" "}
                          <code className="bg-gray-200 px-1 rounded">_fbp</code>{" "}
                          - Track visits (90 days)
                        </li>
                        <li>
                          •{" "}
                          <code className="bg-gray-200 px-1 rounded">_fbc</code>{" "}
                          - Store last visit (90 days)
                        </li>
                        <li>
                          • <code className="bg-gray-200 px-1 rounded">fr</code>{" "}
                          - Ad targeting (90 days)
                        </li>
                      </ul>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      <strong>Purpose:</strong> Track conversions from Facebook
                      and Instagram ads, enable retargeting, and measure ad
                      performance.
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        Provider: Meta Platforms Inc.
                      </span>
                      <a
                        href="https://www.facebook.com/ads/preferences"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Manage ads →
                      </a>
                    </div>
                  </div>

                  {/* TikTok Pixel */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
                        <span className="text-xs text-white">🎵</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        TikTok Pixel
                      </h4>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 mb-2">
                      <p className="text-xs font-semibold text-gray-900 mb-1">
                        Cookies Used:
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>
                          •{" "}
                          <code className="bg-gray-200 px-1 rounded">_ttp</code>{" "}
                          - Track conversions (13 months)
                        </li>
                        <li>
                          •{" "}
                          <code className="bg-gray-200 px-1 rounded">
                            _tt_enable_cookie
                          </code>{" "}
                          - Consent status (13 months)
                        </li>
                        <li>
                          •{" "}
                          <code className="bg-gray-200 px-1 rounded">
                            _ttq_session
                          </code>{" "}
                          - Session tracking (Session)
                        </li>
                      </ul>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      <strong>Purpose:</strong> Measure TikTok ad effectiveness,
                      track conversions, and enable ad targeting.
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        Provider: TikTok Inc.
                      </span>
                      <a
                        href="https://www.tiktok.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Privacy policy →
                      </a>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg mt-4">
                    <p className="text-xs text-yellow-900">
                      <strong>Note:</strong> Marketing cookies are only
                      activated after you provide explicit consent via our
                      cookie banner.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 - Third Party Cookies Table */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                3. Third-Party Cookies Summary
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-900">
                        Provider
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900">
                        Purpose
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900">
                        Duration
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-900">
                        Opt-out
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="bg-white">
                      <td className="p-3 text-gray-700 font-medium">
                        Google Analytics
                      </td>
                      <td className="p-3 text-gray-600 text-xs">
                        Website analytics
                      </td>
                      <td className="p-3 text-gray-600 text-xs">2 years</td>
                      <td className="p-3">
                        <a
                          href="https://tools.google.com/dlpage/gaoptout"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Link
                        </a>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 text-gray-700 font-medium">
                        Google Ads
                      </td>
                      <td className="p-3 text-gray-600 text-xs">
                        Ad conversion tracking
                      </td>
                      <td className="p-3 text-gray-600 text-xs">90 days</td>
                      <td className="p-3">
                        <a
                          href="https://adssettings.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Link
                        </a>
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-3 text-gray-700 font-medium">
                        Meta (Facebook)
                      </td>
                      <td className="p-3 text-gray-600 text-xs">
                        Ad targeting, retargeting
                      </td>
                      <td className="p-3 text-gray-600 text-xs">90 days</td>
                      <td className="p-3">
                        <a
                          href="https://www.facebook.com/ads/preferences"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Link
                        </a>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-3 text-gray-700 font-medium">TikTok</td>
                      <td className="p-3 text-gray-600 text-xs">
                        Ad conversion tracking
                      </td>
                      <td className="p-3 text-gray-600 text-xs">13 months</td>
                      <td className="p-3">
                        <a
                          href="https://www.tiktok.com/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Link
                        </a>
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-3 text-gray-700 font-medium">Stripe</td>
                      <td className="p-3 text-gray-600 text-xs">
                        Payment processing
                      </td>
                      <td className="p-3 text-gray-600 text-xs">Session</td>
                      <td className="p-3 text-gray-600 text-xs">Essential</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                4. Managing Your Cookie Preferences
              </h2>
              <p className="text-gray-700 mb-4">
                You can manage your cookie preferences at any time:
              </p>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Via Our Cookie Banner:
                </h3>
                <button
                  onClick={openCookieSettings}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Manage Cookie Settings
                </button>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Via Your Browser:
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="font-medium text-gray-900 mb-2 text-sm">
                      Chrome / Edge
                    </p>
                    <p className="text-xs text-gray-600">
                      Settings → Privacy → Cookies and site data
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="font-medium text-gray-900 mb-2 text-sm">
                      Firefox
                    </p>
                    <p className="text-xs text-gray-600">
                      Settings → Privacy & Security → Cookies
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="font-medium text-gray-900 mb-2 text-sm">
                      Safari
                    </p>
                    <p className="text-xs text-gray-600">
                      Preferences → Privacy → Manage Website Data
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="font-medium text-gray-900 mb-2 text-sm">
                      Mobile (iOS/Android)
                    </p>
                    <p className="text-xs text-gray-600">
                      Settings → Privacy → Clear browsing data
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <p className="text-sm text-yellow-900">
                  <strong>Note:</strong> Blocking all cookies may prevent you
                  from using certain features like shopping cart and checkout.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                5. Third-Party Opt-Outs
              </h2>
              <div className="space-y-3">
                <a
                  href="http://www.youronlinechoices.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      Your Online Choices (EU)
                    </p>
                    <p className="text-xs text-gray-600">
                      European advertising opt-out
                    </p>
                  </div>
                  <span className="text-purple-600">→</span>
                </a>
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      Google Ads Settings
                    </p>
                    <p className="text-xs text-gray-600">
                      Manage Google advertising preferences
                    </p>
                  </div>
                  <span className="text-purple-600">→</span>
                </a>
                <a
                  href="https://www.facebook.com/ads/preferences"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      Facebook Ad Preferences
                    </p>
                    <p className="text-xs text-gray-600">
                      Control Facebook advertising
                    </p>
                  </div>
                  <span className="text-purple-600">→</span>
                </a>
                <a
                  href="https://www.tiktok.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      TikTok Privacy Center
                    </p>
                    <p className="text-xs text-gray-600">
                      Manage TikTok data and ads
                    </p>
                  </div>
                  <span className="text-purple-600">→</span>
                </a>
              </div>
              <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Do Not Track (DNT):</strong> We respect browser "Do
                  Not Track" signals. If DNT is enabled, we will only use
                  essential cookies.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                6. Contact Us
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <p className="text-gray-700 mb-4">
                  For cookie-related questions:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <a
                      href="mailto:H4ppyKids@H4ppyKids.com"
                      className="text-blue-600 hover:text-blue-700 font-medium"
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
              <p className="text-sm text-gray-600 mb-2">
                By continuing to use H4ppyKids, you acknowledge that you have
                read and understood this Cookie Policy.
              </p>
              <p className="text-xs text-gray-500">
                Last Updated: October 21, 2025 • Effective Date: October 21,
                2025
              </p>
            </div>
          </div>
        </div>

        {/* Back to top */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
                className="hover:text-blue-600"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/privacy-policy")}
                className="hover:text-blue-600"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default CookiePolicyPage;
