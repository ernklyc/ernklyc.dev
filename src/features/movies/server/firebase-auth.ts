import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { MOVIE_LIBRARY_OWNER_UID } from "@/features/movies/config";

const adminApp =
  getApps()[0] ?? initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "ernklyc-dev" });

export async function isMovieOwnerRequest(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) return false;
  const token = authorization.slice("Bearer ".length).trim();
  if (!token) return false;

  try {
    const decoded = await getAuth(adminApp).verifyIdToken(token);
    return decoded.uid === MOVIE_LIBRARY_OWNER_UID;
  } catch {
    return false;
  }
}
