import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Manager - Terms of Service | Eren Kalaycı",
  description: "Link Manager mobile application terms of service and conditions.",
};

export default function LinkManagerTermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-[#1F2731]/60 backdrop-blur-sm rounded-2xl p-8 border border-[#2A3441]/50 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white">
              LINK MANAGER TERMS OF SERVICE
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
              These Terms of Service (&quot;Terms&quot;) govern your use of the Link Manager mobile application (&quot;Application&quot;). By downloading, installing, or using the Application, you agree to these Terms. Please read carefully.
            </p>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">1. ACCEPTANCE AND APPLICABILITY</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms apply to all users of the Link Manager application. By using the Application, you agree to these Terms. If you do not agree to these Terms, please do not use the Application.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">2. APPLICATION DESCRIPTION</h2>
              <p className="text-gray-300 leading-relaxed">
                Link Manager is a mobile application that allows users to organize, store, and manage web links. The Application offers both free and premium (paid) features.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">3. USER ACCOUNTS AND REGISTRATION</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>You may need to create an account to use the Application</li>
                <li>You are responsible for the accuracy and currency of your account information</li>
                <li>You are responsible for account security. Do not share your password</li>
                <li>You must immediately notify us of unauthorized use of your account</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">4. PAID SERVICES AND SUBSCRIPTIONS</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Link Manager offers free and premium (paid) features</li>
                <li>Access to premium features can be purchased via monthly/yearly subscription or one-time payment</li>
                <li>Subscriptions are managed through Google Play Store or Apple App Store via RevenueCat service</li>
                <li>Subscription fees are displayed in the in-app purchase screen</li>
                <li>Subscriptions automatically renew unless canceled</li>
                <li>You can cancel subscriptions from Google Play Store or Apple App Store settings</li>
                <li>Cancellation takes effect at the end of current subscription period</li>
                <li>Payments are non-refundable, but your legal rights are reserved</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">5. USER CONTENT</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>You are responsible for all links and content you add to the Application</li>
                <li>Do not add illegal, harmful, threatening, harassing, offensive, or rights-violating content</li>
                <li>Do not add content that infringes copyright, trademark, or intellectual property rights</li>
                <li>Do not use the Application for spam, malware distribution, or illegal activities</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">6. INTELLECTUAL PROPERTY RIGHTS</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>The Application and all its content are protected by copyright and intellectual property laws</li>
                <li>You may use the Application only for personal, non-commercial purposes</li>
                <li>You may not copy, modify, distribute, or commercially use any part of the Application</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">7. SERVICE INTERRUPTIONS AND CHANGES</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>The Application may be temporarily unavailable due to maintenance, updates, or technical issues</li>
                <li>We reserve the right to change features, pricing, or services without prior notice</li>
                <li>We reserve the right to discontinue or terminate the Application at any time</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">8. LIMITATION OF LIABILITY</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>The Application is provided &quot;as is&quot;. We do not guarantee it will be uninterrupted, error-free, or secure</li>
                <li>We are not liable for direct or indirect damages arising from use of the Application</li>
                <li>We are not responsible for the security or accessibility of links you add</li>
                <li>We are not responsible for the content or security of third-party websites</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">9. DATA SECURITY</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Your data security is important to us. See our Privacy Policy for details</li>
                <li>By using the Application, you agree to the collection, processing, and storage of your data</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">10. TERMINATION</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>We reserve the right to suspend or terminate your account if you violate these Terms</li>
                <li>Upon termination, your access to the Application and premium features will end</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">11. CHANGES</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>We may update these Terms at any time</li>
                <li>In case of significant changes, you will be notified via in-app notification or email</li>
                <li>Continuing to use the Application after changes means you accept the updated Terms</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">12. LEGAL APPLICABILITY</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>These Terms are subject to applicable laws</li>
                <li>Any disputes arising from these Terms will be resolved in appropriate courts</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">13. CONTACT</h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                For questions or complaints, you can contact us:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Email: <a href="mailto:support@linkmanager.app" className="text-[#FF4655] hover:underline">support@linkmanager.app</a></li>
                <li>Play Store: <a href="https://play.google.com/store/apps/details?id=com.link.manager&hl=tr" target="_blank" rel="noopener noreferrer" className="text-[#FF4655] hover:underline">Link Manager</a></li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">14. GENERAL PROVISIONS</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>If any provision of these Terms is held invalid, the remaining provisions shall remain in effect</li>
                <li>These Terms constitute the entire agreement regarding use of the Application</li>
              </ul>
            </section>

            <div className="mt-8 p-4 bg-[#FF4655]/10 border border-[#FF4655]/30 rounded-lg">
              <p className="text-gray-300 leading-relaxed">
                By accepting these Terms of Service, you may begin using the Link Manager application.
              </p>
            </div>

            <div className="mt-12 pt-6 border-t border-[#2A3441]/50 text-center text-gray-400 text-sm">
              <p>&copy; 2025 Link Manager. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
