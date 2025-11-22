import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Manager - Privacy Policy | Eren Kalaycı",
  description: "Link Manager mobile application privacy policy and personal data protection information.",
};

export default function LinkManagerPrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-[#1F2731]/60 backdrop-blur-sm rounded-2xl p-8 border border-[#2A3441]/50 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white">
              LINK MANAGER PRIVACY POLICY
            </h1>
            <p className="text-gray-400">Last Updated: 2025</p>
            <a 
              href="https://play.google.com/store/apps/details?id=com.link.manager&hl=tr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-[#FF4655] hover:text-[#FF6B7A] transition-colors"
            >
              View on Play Store →
            </a>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-gray-300 leading-relaxed">
              This Privacy Policy explains how the Link Manager mobile application (&quot;Application&quot;) collects, uses, stores, and shares your personal data. By using the Application, you agree to this policy.
            </p>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">1. DATA CONTROLLER</h2>
              <p className="text-gray-300 leading-relaxed">
                Link Manager application is the controller of your data. This policy explains the data processing activities of the application.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">2. DATA COLLECTED</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">2.1. User Content</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Web links (URLs) you add</li>
                <li>Link titles and categories</li>
                <li>Favorite bookmarks</li>
                <li>User preferences and settings</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">2.2. Device Information</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Device ID: Used to verify your subscription status and manage access to premium features.</li>
                <li>Device model and operating system information</li>
                <li>Application version</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">2.3. Usage Data</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>In-app interactions and usage statistics</li>
                <li>Error reports and crash information (Crashlytics)</li>
                <li>Performance metrics</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">2.4. Subscription Information</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Subscription status and history (via RevenueCat)</li>
                <li>Purchase transactions (processed through Google Play Store / Apple App Store)</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">3. DATA COLLECTION METHODS</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">3.1. Direct Collection</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Information you enter while using the application</li>
                <li>Application settings and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">3.2. Automatic Collection</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Firebase Analytics: Application usage statistics</li>
                <li>Firebase Crashlytics: Error reports and crash information</li>
                <li>RevenueCat: Subscription status and purchase transactions</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">4. PURPOSE OF DATA USE</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">4.1. Service Provision</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>To perform the basic functions of the application</li>
                <li>To store and organize your links</li>
                <li>To manage access to premium features</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">4.2. Subscription Management</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>To verify premium subscription status</li>
                <li>To authenticate subscription using Device ID</li>
                <li>To process purchase transactions</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">4.3. Application Improvement</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>To detect and fix errors</li>
                <li>To analyze application performance</li>
                <li>To improve user experience</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">4.4. Security</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>To ensure application security</li>
                <li>To prevent unauthorized access</li>
                <li>Fraud detection</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">5. DATA SHARING</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">5.1. Third-Party Service Providers</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Google Firebase: Analytics and Crashlytics</li>
                <li>RevenueCat: Subscription management</li>
                <li>Google Play Store / Apple App Store: Purchase transactions</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">5.2. Legal Requirements</h3>
              <p className="text-gray-300 leading-relaxed">
                Your data may be shared due to legal obligations, court orders, or legal processes.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">6. DATA SECURITY</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">6.1. Security Measures</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Data is protected with encryption technologies</li>
                <li>Secure server infrastructure is used</li>
                <li>Regular security audits are conducted</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">6.2. Data Retention</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Data is stored during the service provision period</li>
                <li>When you delete your account, data will be deleted within 30 days</li>
                <li>Some data may be retained longer due to legal obligations</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">7. DEVICE ID USAGE</h2>
              <p className="text-gray-300 leading-relaxed mb-3">Device ID is used only for:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Verifying premium subscription status</li>
                <li>Providing access to premium features</li>
                <li>Preventing subscription violations</li>
                <li>Not shared with third parties</li>
                <li>Not used for advertising or marketing</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">8. USER RIGHTS</h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                Under GDPR and similar data protection laws, you have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Right to information about collected data</li>
                <li>Right of access to your personal data</li>
                <li>Right to rectification of incorrect data</li>
                <li>Right to erasure of your data</li>
                <li>Right to object to data processing</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                To exercise your rights, contact us at: <a href="mailto:privacy@linkmanager.app" className="text-[#FF4655] hover:underline">privacy@linkmanager.app</a>
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">9. CHILDREN&apos;S PRIVACY</h2>
              <p className="text-gray-300 leading-relaxed">
                Link Manager does not knowingly collect data from children under 13. If we become aware that data from a child under 13 has been collected, we will delete it immediately.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">10. COOKIES AND SIMILAR TECHNOLOGIES</h2>
              <p className="text-gray-300 leading-relaxed">
                The application uses Firebase Analytics and Crashlytics for usage statistics and error reports.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">11. INTERNATIONAL DATA TRANSFER</h2>
              <p className="text-gray-300 leading-relaxed">
                Your data may be stored on service providers&apos; servers in the USA and other countries with appropriate security measures.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">12. POLICY CHANGES</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>We may update this Privacy Policy at any time</li>
                <li>You will be notified of significant changes</li>
                <li>Continued use means acceptance of updated policy</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">13. CONTACT</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Email: <a href="mailto:privacy@linkmanager.app" className="text-[#FF4655] hover:underline">privacy@linkmanager.app</a></li>
                <li>Play Store: <a href="https://play.google.com/store/apps/details?id=com.link.manager&hl=tr" target="_blank" rel="noopener noreferrer" className="text-[#FF4655] hover:underline">Link Manager</a></li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">14. CONSENT</h2>
              <p className="text-gray-300 leading-relaxed">
                By using the application, you confirm that you have read, understood, and accepted this Privacy Policy.
              </p>
            </section>

            <div className="mt-12 pt-6 border-t border-[#2A3441]/50 text-center text-gray-400 text-sm">
              <p>&copy; 2025 Link Manager. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
