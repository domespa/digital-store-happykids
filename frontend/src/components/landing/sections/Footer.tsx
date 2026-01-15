import { Link } from "react-router-dom";
import { Shield, Cookie, BanknoteArrowDown } from "lucide-react";

export default function Footer() {
  const openCookieSettings = () => {
    localStorage.removeItem("cookie_consent");
    window.location.reload();
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-[#3D5A51] to-gray-900 text-white py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#52796F] rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#84A98C] rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-[#84A98C] to-[#52796F] bg-clip-text text-white mb-3">
              H4ppyKids
            </h3>
            <p className="text-white text-sm leading-relaxed">
              Helping parents break screen addiction and reconnect with their
              kids.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-white hover:text-[#84A98C] transition-colors text-sm flex items-center gap-2 group"
                >
                  <Shield className="w-4 h-4 text-gray-500 group-hover:text-[#84A98C] transition-colors" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/cookie-policy"
                  className="text-white hover:text-[#84A98C] transition-colors text-sm flex items-center gap-2 group"
                >
                  <Cookie className="w-4 h-4 text-gray-500 group-hover:text-[#84A98C] transition-colors" />
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-white hover:text-[#84A98C] transition-colors text-sm flex items-center gap-2 group"
                >
                  <BanknoteArrowDown className="w-4 h-4 text-gray-500 group-hover:text-[#84A98C] transition-colors" />
                  Refund Policy
                </Link>
              </li>
              <li>
                <button
                  onClick={openCookieSettings}
                  className="text-white hover:text-[#84A98C] transition-colors text-sm flex items-center gap-2 group"
                >
                  <svg
                    className="w-4 h-4 text-white group-hover:text-[#84A98C] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <a
                  href="mailto:H4ppyKids@H4ppyKids.com"
                  className="hover:text-[#84A98C] transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  H4ppyKids@H4ppyKids.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white">
            <p>© {new Date().getFullYear()} H4ppyKids. All rights reserved.</p>
            <div className="flex items-center gap-2 text-xs">
              <Shield className="w-3 h-3" />
              <span>GDPR Compliant • IP-based tracking only</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
