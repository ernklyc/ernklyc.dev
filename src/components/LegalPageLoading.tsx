import BlurHashLoading from "@/components/BlurHashLoading";

type LegalPageLoadingProps = {
  accent?: "red" | "blue";
};

export default function LegalPageLoading({
  accent = "red",
}: LegalPageLoadingProps) {
  return <BlurHashLoading accent={accent} minHeightClass="min-h-screen" />;
}
