import { MOVIE_LIBRARY_OWNER_UID } from "@/features/movies/config";

type FirebaseLookupResponse = {
  users?: { localId?: string }[];
  error?: { message?: string };
};

export async function isMovieOwnerRequest(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) return false;
  const token = authorization.slice("Bearer ".length).trim();
  if (!token) return false;

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return false;

  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken: token }),
      cache: "no-store",
    });
    if (!response.ok) return false;
    const body = (await response.json()) as FirebaseLookupResponse;
    return body.users?.some((user) => user.localId === MOVIE_LIBRARY_OWNER_UID) ?? false;
  } catch {
    return false;
  }
}
