import { Metadata } from "next";
import BackOrHomeLink from "@/components/BackOrHomeLink";

export const metadata: Metadata = {
  title: "Artifusion Support | Eren Kalaycı",
  description: "Need help with Artifusion? Contact us for app support, subscriptions, billing, restore purchases, or technical issues.",
  alternates: { canonical: "/artifusion-support" },
};

export default function ArtifusionSupportPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white py-20 px-4">
      <section className="container mx-auto max-w-4xl">
        <div className="bg-[#1F2731]/60 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white">
              Artifusion Support
            </h1>
            <p className="text-gray-300 leading-relaxed">
              Need help with Artifusion? Contact us for app support, subscriptions, billing, restore purchases, or technical issues.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                For any support request, reach us by email:
              </p>
              <p className="mt-3">
                <a
                  href="mailto:ernklycdev@icloud.com"
                  className="text-[#FF4655] hover:text-[#FF6B7A] transition-colors font-medium"
                >
                  ernklycdev@icloud.com
                </a>
              </p>
              <p className="text-gray-400 text-sm mt-2">
                We typically respond within 1–2 business days.
              </p>
            </section>

            <hr className="border-white/10" />

            {/* Subscriptions & Purchases */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">Subscriptions &amp; Purchases</h2>
              <ul className="list-disc list-inside space-y-3 text-gray-300 ml-4">
                <li>
                  Subscriptions are managed through your <strong className="text-white">Apple ID</strong> and the App Store. To cancel or modify your subscription, go to <strong className="text-white">Settings → [Your Name] → Subscriptions</strong> on your iPhone or iPad.
                </li>
                <li>
                  To <strong className="text-white">restore a previous purchase</strong>, open Artifusion and use the <strong className="text-white">Restore Purchases</strong> option available in the app.
                </li>
                <li>
                  Billing and refund requests are handled by Apple. Please contact{" "}
                  <a
                    href="https://reportaproblem.apple.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF4655] hover:text-[#FF6B7A] transition-colors"
                  >
                    Apple Support
                  </a>{" "}
                  for refund inquiries.
                </li>
              </ul>
            </section>

            <hr className="border-white/10" />

            {/* Privacy & Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">Privacy &amp; Terms</h2>
              <ul className="list-disc list-inside space-y-3 text-gray-300 ml-4">
                <li>
                  <a
                    href="/artifusion-privacy"
                    className="text-[#FF4655] hover:text-[#FF6B7A] transition-colors"
                  >
                    Privacy Policy
                  </a>{" "}
                  — How we handle your data.
                </li>
                <li>
                  <a
                    href="/artifusion-terms"
                    className="text-[#FF4655] hover:text-[#FF6B7A] transition-colors"
                  >
                    Terms of Use
                  </a>{" "}
                  — The terms governing your use of Artifusion.
                </li>
              </ul>
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
