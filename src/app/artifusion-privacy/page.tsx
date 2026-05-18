import { Metadata } from "next";
import BackOrHomeLink from "@/components/BackOrHomeLink";

export const metadata: Metadata = {
  title: "Artifusion - Privacy Policy | Eren Kalaycı",
  description: "Artifusion mobile application privacy policy and personal data protection information.",
  alternates: { canonical: "/artifusion-privacy" },
};

export default function ArtifusionPrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white py-20 px-4">
      <section className="container mx-auto max-w-4xl">
        <div className="bg-[#1F2731]/60 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white">
              ARTIFUSION PRIVACY POLICY
            </h1>
            <p className="text-gray-400 text-sm">Last Updated: May 18, 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-gray-300 leading-relaxed">
              This Privacy Policy explains how the Artifusion mobile application (&quot;Application&quot;) collects, uses, stores, and shares your personal data. Artifusion lets you merge your own photos with famous artworks using artificial intelligence. By using the Application, you agree to this policy.
            </p>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">1. DATA CONTROLLER</h2>
              <p className="text-gray-300 leading-relaxed">
                The Artifusion application is the controller of your data. This policy explains the data processing activities of the application.
              </p>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">2. DATA COLLECTED</h2>

              <h3 className="text-xl font-semibold mb-2 text-gray-100 mt-6">2.1. Photos and Content You Provide</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Photos you select from your device to transform</li>
                <li>AI-generated artworks created from your photos</li>
                <li>Favorite artworks and saved creations</li>
                <li>Your in-app preferences and settings</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 text-gray-100 mt-6">2.2. Device Information</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Device model and operating system version</li>
                <li>Application version</li>
                <li>Anonymous identifiers used to manage your subscription status</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 text-gray-100 mt-6">2.3. Usage Data</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>In-app interactions and usage statistics</li>
                <li>Error reports and crash information</li>
                <li>Performance metrics</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 text-gray-100 mt-6">2.4. Subscription Information</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Subscription status and history (via RevenueCat)</li>
                <li>Purchase transactions (processed through the Apple App Store)</li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">3. HOW WE PROCESS YOUR PHOTOS</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>When you choose a photo, it is transmitted securely to our AI processing provider (Replicate) to generate your stylized artwork.</li>
                <li>Your photos are used solely to produce the artwork you request. We do not use your photos to train AI models.</li>
                <li>Generated artworks and your creation history are stored locally on your device, not on our servers.</li>
                <li>Artifusion does not require you to create an account and does not maintain a server-side profile of you.</li>
                <li>Photo library access is requested only to let you pick a photo to transform and to save your creations back to your library.</li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">4. DATA COLLECTION METHODS</h2>

              <h3 className="text-xl font-semibold mb-2 text-gray-100 mt-6">4.1. Direct Collection</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Photos you select while using the application</li>
                <li>Application settings and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 text-gray-100 mt-6">4.2. Automatic Collection</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Firebase Analytics: application usage statistics</li>
                <li>RevenueCat: subscription status and purchase transactions</li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">5. PURPOSE OF DATA USE</h2>

              <h3 className="text-xl font-semibold mb-2 text-gray-100 mt-6">5.1. Service Provision</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>To perform the core function of the application: merging your photos with artworks</li>
                <li>To store and organize your creations on your device</li>
                <li>To manage access to premium features</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 text-gray-100 mt-6">5.2. Subscription Management</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>To verify premium subscription status</li>
                <li>To process and restore purchase transactions</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 text-gray-100 mt-6">5.3. Application Improvement</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>To detect and fix errors</li>
                <li>To analyze application performance</li>
                <li>To improve user experience</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 text-gray-100 mt-6">5.4. Security</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>To ensure application security</li>
                <li>To prevent unauthorized access and fraud</li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">6. DATA SHARING</h2>

              <h3 className="text-xl font-semibold mb-2 text-gray-100 mt-6">6.1. Third-Party Service Providers</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Replicate: AI image processing to generate your artworks</li>
                <li>Google Firebase: analytics and remote configuration</li>
                <li>RevenueCat: subscription management</li>
                <li>Apple App Store: purchase transactions</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 text-gray-100 mt-6">6.2. Legal Requirements</h3>
              <p className="text-gray-300 leading-relaxed">
                Your data may be shared due to legal obligations, court orders, or legal processes.
              </p>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">7. DATA SECURITY</h2>

              <h3 className="text-xl font-semibold mb-2 text-gray-100 mt-6">7.1. Security Measures</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Data is transmitted over encrypted connections</li>
                <li>Reputable, secure service providers are used</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 text-gray-100 mt-6">7.2. Data Retention</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Generated artworks and creation history are stored only on your device</li>
                <li>You can delete your creations at any time within the application</li>
                <li>Uninstalling the application removes the data stored on your device</li>
                <li>Photos sent for processing are used transiently to generate your result</li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">8. USER RIGHTS</h2>
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
                To exercise your rights, contact us at: <a href="mailto:ernklycdev@icloud.com" className="text-[#FF4655] hover:text-[#FF6B7A] transition-colors">ernklycdev@icloud.com</a>
              </p>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">9. CHILDREN&apos;S PRIVACY</h2>
              <p className="text-gray-300 leading-relaxed">
                Artifusion does not knowingly collect data from children under 13. If we become aware that data from a child under 13 has been collected, we will delete it immediately.
              </p>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">10. INTERNATIONAL DATA TRANSFER</h2>
              <p className="text-gray-300 leading-relaxed">
                Your data may be processed on service providers&apos; servers located in the USA and other countries with appropriate security measures.
              </p>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">11. POLICY CHANGES</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>We may update this Privacy Policy at any time</li>
                <li>You will be notified of significant changes</li>
                <li>Continued use means acceptance of the updated policy</li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">12. CONTACT</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Email: <a href="mailto:ernklycdev@icloud.com" className="text-[#FF4655] hover:text-[#FF6B7A] transition-colors">ernklycdev@icloud.com</a></li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">13. CONSENT</h2>
              <p className="text-gray-300 leading-relaxed">
                By using the application, you confirm that you have read, understood, and accepted this Privacy Policy.
              </p>
            </section>

            <div className="mt-12 pt-6 border-t border-white/10 text-center">
              <BackOrHomeLink className="text-gray-400 hover:text-white text-sm transition-colors">
                ← Geri dön
              </BackOrHomeLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
