import { ArrowLeft, BanknoteArrowDown, Mail, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function RefundPolicyPage() {
  const navigate = useNavigate();

  const openCookieSettings = () => {
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
              <BanknoteArrowDown className="w-5 h-5 text-blue-600" />
              <h1 className="text-lg font-bold text-gray-900">Refund Policy</h1>
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
                <BanknoteArrowDown className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Refund Policy</h1>
              </div>
            </div>
          </div>

          {/* Policy Content */}
          <div className="px-8 py-8 prose prose-sm max-w-none">
            {/* Section 1 */}
            <section className="mb-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                Due to the nature of digital products, we cannot issue a refund
                once the files have been downloaded.
                <br />
                However, we will consider granting a refund that meets specific
                internal criteria (e.g., duplicate order) and will grant refunds
                at our reasonable discretion.
                <br />
                Please know that your satisfaction is our goal, so we will
                ensure you are happy with your purchase! If the outcome is not
                what you had in mind, please reach out so we can help resolve
                the issue.
              </p>
            </section>

            {/* Contact Section */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Any questions?
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <p className="text-gray-700 mb-4">Contact Us:</p>
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default RefundPolicyPage;
