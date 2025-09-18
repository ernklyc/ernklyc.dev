import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HP Character Wiki Gizlilik Politikası",
  description:
    "HP Character Wiki uygulaması için gizlilik politikası. Yelbegen Software tarafından geliştirildi.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0F1923] text-white">
      <section className="px-4 sm:px-6 md:px-8 pt-28 pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">HP Character Wiki Gizlilik Politikası</h1>
          <p className="text-sm text-gray-300 mb-8">Effective Date: September 18, 2025</p>

          <p className="mb-6 text-gray-200">
            This Privacy Policy explains how <strong>Yelbegen Software</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), the developer of the <strong>HP Character Wiki</strong> (&quot;Application&quot;), collects, uses, and protects your information.
          </p>
          <p className="mb-8 text-gray-200">By using our Application, you agree to the practices described below.</p>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>

          <h3 className="text-xl font-semibold mb-2">1.1 Personally Identifiable Information (PII)</h3>
          <p className="mb-6 text-gray-200">
            We do <strong>not</strong> collect or process any personally identifiable information such as your name, email address, phone number, or location.
          </p>

          <h3 className="text-xl font-semibold mb-2">1.2 User-Generated Data (Stored Locally)</h3>
          <ul className="list-disc list-inside mb-6 text-gray-200 space-y-1">
            <li>
              <strong>Favorites</strong>: When you mark characters or spells as favorites, only their IDs are saved on your device.
            </li>
            <li>This data does not leave your device and is not sent to our servers.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">1.3 Non-Personal / Technical Data</h3>
          <ul className="list-disc list-inside mb-6 text-gray-200 space-y-1">
            <li>
              The Application retrieves content from the public API {" "}
              <a
                href="https://hp-api.onrender.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF6B7A] hover:underline"
              >
                https://hp-api.onrender.com
              </a>
              .
            </li>
            <li>
              Like all internet requests, your device’s <strong>IP address</strong> is technically visible to the API server during this process. We do not control or store this information.
            </li>
            <li>
              We also use <strong>Google Fonts</strong> for text rendering. When fonts are loaded, your device may share technical information (such as IP address, browser type) with Google. Google’s use of this data is governed by their own {" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF6B7A] hover:underline"
              >
                https://policies.google.com/privacy
              </a>
              .
            </li>
          </ul>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">2. How We Use Information</h2>
          <p className="mb-2 text-gray-200">We use information only to:</p>
          <ul className="list-disc list-inside mb-6 text-gray-200 space-y-1">
            <li>Display your favorites within the Application (data remains local).</li>
            <li>Present public Harry Potter content retrieved from the external API.</li>
          </ul>
          <p className="mb-8 text-gray-200">We do not use your information for advertising, profiling, or analytics.</p>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">3. Data Sharing and Third Parties</h2>
          <ul className="list-disc list-inside mb-6 text-gray-200 space-y-1">
            <li>We do not collect, sell, or share personal data with third parties.</li>
            <li>
              Third-party services used:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>
                  <strong>HP-API</strong>: Provides content about characters and spells.
                </li>
                <li>
                  <strong>Google Fonts</strong>: Provides font styling.
                </li>
              </ul>
            </li>
          </ul>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <ul className="list-disc list-inside mb-6 text-gray-200 space-y-1">
            <li>
              Your favorites list is stored securely on your device using the operating system’s local storage mechanisms (SharedPreferences).
            </li>
            <li>We do not maintain any servers that process or store your personal data.</li>
          </ul>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">5. Children’s Privacy</h2>
          <p className="mb-2 text-gray-200">Our Application is intended for general audiences.</p>
          <ul className="list-disc list-inside mb-6 text-gray-200 space-y-1">
            <li>We do not knowingly collect personal information from children under 13.</li>
            <li>
              If you are a parent or guardian and believe your child has provided personal information, please contact us and we will take appropriate steps.
            </li>
          </ul>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">6. GDPR and CCPA Rights</h2>
          <ul className="list-disc list-inside mb-6 text-gray-200 space-y-2">
            <li>
              <strong>European Union (GDPR)</strong>: You have the right to request access, correction, or deletion of your data. In our case, all user data is stored locally on your device, and you can delete it directly by clearing the Application’s data from your device settings.
            </li>
            <li>
              <strong>California (CCPA)</strong>: We do not sell or share personal information. If you wish to confirm, request, or delete any information, you can contact us at the email below.
            </li>
          </ul>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">7. Changes to This Privacy Policy</h2>
          <p className="mb-6 text-gray-200">
            We may update this Privacy Policy from time to time. Changes will become effective once published on this page. Please check periodically for updates.
          </p>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p className="mb-2 text-gray-200">If you have any questions or concerns about this Privacy Policy, please contact us:</p>
          <ul className="list-disc list-inside mb-10 text-gray-200 space-y-1">
            <li>
              <strong>Developer</strong>: Yelbegen Software
            </li>
            <li>
              <strong>Email</strong>: <a href="mailto:yelbegensoftware@gmail.com" className="text-[#FF6B7A] hover:underline">yelbegensoftware@gmail.com</a>
            </li>
            <li>
              <strong>Website</strong>: {" "}
              <a
                href="https://ernklyc.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF6B7A] hover:underline"
              >
                https://ernklyc.dev
              </a>
            </li>
          </ul>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <Link href="/" className="hover:text-white hover:underline">← Ana Sayfa</Link>
            <span>HP Character Wiki</span>
          </div>
        </div>
      </section>
    </main>
  );
}