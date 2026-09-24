import { NextResponse } from "next/server";
import { DDD_MONTHLY_LIMIT, readDddUsage } from "@/features/movies/server/api-usage";
import { isMovieOwnerRequest } from "@/features/movies/server/firebase-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isMovieOwnerRequest(request))) {
    return NextResponse.json({ error: "Bu işlem için giriş yapmalısın." }, { status: 401 });
  }

  const token = (request.headers.get("authorization") ?? "").slice("Bearer ".length).trim();
  try {
    const { month, used } = await readDddUsage(token);
    return NextResponse.json(
      {
        month,
        ddd: {
          name: "DoesTheDogDie (ebeveyn rehberi)",
          used,
          limit: DDD_MONTHLY_LIMIT,
          remaining: Math.max(0, DDD_MONTHLY_LIMIT - used),
          note: "Yalnızca bu uygulamanın sunucusunun yaptığı istekler sayılır; önbellekten dönenler de sayılabildiği için gerçek kullanım bundan düşük olabilir.",
        },
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("API usage read failed", error);
    return NextResponse.json({ error: "Kullanım bilgisi alınamadı." }, { status: 502 });
  }
}
