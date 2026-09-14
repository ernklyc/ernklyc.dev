import { notFound } from "next/navigation";
import StandaloneMediaDetail from "./standalone-media-detail";

type PageProps = { params: Promise<{ mediaType: string; tmdbId: string }> };

export default async function MediaDetailPage({ params }: PageProps) {
  const { mediaType, tmdbId } = await params;
  const id = Number(tmdbId);
  if ((mediaType !== "movie" && mediaType !== "tv") || !Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  return <StandaloneMediaDetail mediaType={mediaType} tmdbId={id} />;
}
