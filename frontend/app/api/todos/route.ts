import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

/**
 * route.ts = FastAPI로 요청을 전달하는 "프록시"
 * 클라이언트(브라우저)는 FastAPI(8000)로 직접 요청하지 않고
 * 같은 출처의 /api/todos 로 요청 → 여기서 백엔드로 중계한다. (CORS 회피)
 */

// 목록 조회 프록시 (filter, search 쿼리 그대로 전달)
export async function GET(request: NextRequest) {
  const { search } = new URL(request.url);
  const res = await fetch(`${BACKEND_URL}/todos${search}`, {
    cache: "no-store",
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// 새 Todo 생성 프록시
export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
