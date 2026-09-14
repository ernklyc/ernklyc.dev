export type MediaType = "movie" | "tv";

export type MediaSnapshot = {
  title: string;
  originalTitle: string;
  year: number | null;
  posterPath: string | null;
  genres: string[];
};

export type LibraryItem = {
  id: string;
  tmdbId: number;
  imdbId: string | null;
  mediaType: MediaType;
  favorite: boolean;
  isPublic: boolean;
  snapshot: MediaSnapshot;
  addedAt?: unknown;
  updatedAt?: unknown;
};

export type TmdbSearchItem = {
  tmdbId: number;
  imdbId: string | null;
  mediaType: MediaType;
  title: string;
  originalTitle: string;
  year: number | null;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  genreIds: number[];
  genres: string[];
};

export const mediaDocumentId = (mediaType: MediaType, tmdbId: number) =>
  `${mediaType}_${tmdbId}`;
