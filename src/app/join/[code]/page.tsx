import type { Metadata } from "next";
import JoinRedirect from "./JoinRedirect";

export const metadata: Metadata = {
  title: "Ironlog'a Katıl",
  description: "Bu bağlantı seni Ironlog uygulamasındaki bir topluluğa davet ediyor.",
  alternates: { canonical: "/join" },
};

interface JoinPageProps {
  params: Promise<{ code: string }>;
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { code } = await params;
  return <JoinRedirect code={code} />;
}
