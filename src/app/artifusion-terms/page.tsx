import { Metadata } from "next";
import BackOrHomeLink from "@/components/BackOrHomeLink";

export const metadata: Metadata = {
  title: "Artifusion - Terms of Service | Eren Kalaycı",
  description: "Artifusion mobile application terms of service and conditions.",
  alternates: { canonical: "/artifusion-terms" },
};

export default function ArtifusionTermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white py-20 px-4">
      <section className="container mx-auto max-w-4xl">
        <div className="bg-[#1F2731]/60 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white">
              ARTIFUSION TERMS OF SERVICE
            </h1>
            <p className="text-gray-400 text-sm">Last Updated: May 18, 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-gray-300 leading-relaxed">
              These Terms of Service (&quot;Terms&quot;) govern your use of the Artifusion mobile application (&quot;Application&quot;). By downloading, installing, or using the Application, you agree to these Terms. Please read carefully.
            </p>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">1. ACCEPTANCE AND APPLICABILITY</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms apply to all users of the Artifusion application. By using the Application, you agree to these Terms. If you do not agree, please do not use the Application.
              </p>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">2. APPLICATION DESCRIPTION</h2>
              <p className="text-gray-300 leading-relaxed">
                Artifusion is a mobile application that merges your photos with famous artworks using artificial intelligence to create stylized images. The Application offers both free and premium (paid) features.
              </p>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">3. ELIGIBILITY</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>You must be at least 13 years old to use the Application</li>
                <li>You are responsible for all activity that occurs through your device</li>
                <li>The Application does not require account registration</li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">4. PAID SERVICES AND SUBSCRIPTIONS</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Artifusion offers free and premium (paid) features</li>
                <li>Premium access is offered through auto-renewable subscriptions (for example, weekly and yearly plans)</li>
                <li>Subscription prices are displayed in the in-app purchase screen before you confirm</li>
                <li>Payment is charged to your Apple ID account upon confirmation of purchase</li>
                <li>Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period</li>
                <li>Your account is charged for renewal within 24 hours prior to the end of the current period</li>
                <li>You can manage or cancel subscriptions in your Apple ID account settings after purchase</li>
                <li>Subscriptions are processed through the Apple App Store and managed via the RevenueCat service</li>
                <li>Payments are non-refundable except where required by applicable law; your statutory rights are reserved</li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">5. USER CONTENT</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>You are responsible for the photos and content you upload to the Application</li>
                <li>You must own or have the necessary rights to any photo you use</li>
                <li>Do not upload illegal, harmful, offensive, or rights-violating content</li>
                <li>Do not upload photos of other people without their consent</li>
                <li>Do not use the Application for any unlawful purpose</li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">6. AI-GENERATED CONTENT</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Artworks are generated automatically by artificial intelligence and results may vary</li>
                <li>We do not guarantee that any generated result will meet your expectations</li>
                <li>You are responsible for how you use and share the artworks you generate</li>
                <li>Generated artworks reference the styles of famous artworks for transformation purposes only</li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">7. INTELLECTUAL PROPERTY RIGHTS</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>The Application and all its content are protected by copyright and intellectual property laws</li>
                <li>You may use the Application only for personal purposes</li>
                <li>You may not copy, modify, distribute, or reverse engineer any part of the Application</li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">8. SERVICE INTERRUPTIONS AND CHANGES</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>The Application may be temporarily unavailable due to maintenance, updates, or technical issues</li>
                <li>We reserve the right to change features, pricing, or services without prior notice</li>
                <li>We reserve the right to discontinue or terminate the Application at any time</li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">9. LIMITATION OF LIABILITY</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>The Application is provided &quot;as is&quot;. We do not guarantee it will be uninterrupted, error-free, or secure</li>
                <li>We are not liable for direct or indirect damages arising from use of the Application</li>
                <li>We are not responsible for how AI-generated content is used or shared by you</li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">10. DATA SECURITY</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Your data security is important to us. See our Privacy Policy for details</li>
                <li>By using the Application, you agree to the collection and processing of data as described in the Privacy Policy</li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">11. CHANGES</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>We may update these Terms at any time</li>
                <li>Significant changes will be communicated through the Application</li>
                <li>Continuing to use the Application after changes means you accept the updated Terms</li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">12. LEGAL APPLICABILITY</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>These Terms are subject to applicable laws</li>
                <li>Any disputes arising from these Terms will be resolved in appropriate courts</li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">13. CONTACT</h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                For questions or complaints, you can contact us:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Email: <a href="mailto:ernklycdev@icloud.com" className="text-[#FF4655] hover:text-[#FF6B7A] transition-colors">ernklycdev@icloud.com</a></li>
              </ul>
            </section>

            <hr className="border-white/10 mb-8" />
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">14. GENERAL PROVISIONS</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>If any provision of these Terms is held invalid, the remaining provisions shall remain in effect</li>
                <li>These Terms constitute the entire agreement regarding use of the Application</li>
              </ul>
            </section>

            <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-gray-300 leading-relaxed">
                By accepting these Terms of Service, you may begin using the Artifusion application.
              </p>
            </div>

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
