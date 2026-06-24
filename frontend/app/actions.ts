import { Todo } from "@/lib/types";

// 서버에서만 사용하는 백엔드 주소 (NEXT_PUBLIC_ 아님)
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

/**
 * Todo 목록 조회는 actions.ts에서 FastAPI를 "직접" 호출한다.
 * (Server Component에서만 실행됨 → BACKEND_URL 접근 가능)
 * 날짜/필터/검색은 모두 서버(FastAPI)에서 처리된다.
 */
export async function getTodos(
  date: string,
  filter?: string,
  search?: string
): Promise<Todo[]> {
  const params = new URLSearchParams();
  params.set("date", date);
  if (filter && filter !== "all") params.set("filter", filter);
  if (search) params.set("search", search);

  const res = await fetch(`${BACKEND_URL}/todos?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Todo 목록을 불러오지 못했습니다.");
  }
  return res.json();
}

/** 주간 네비게이터용 날짜별 개수 ( { "YYYY-MM-DD": number } ) */
export async function getCounts(
  start: string,
  end: string
): Promise<Record<string, number>> {
  const params = new URLSearchParams({ start, end });
  const res = await fetch(`${BACKEND_URL}/todos/counts?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("개수를 불러오지 못했습니다.");
  }
  return res.json();
}

/** 단일 Todo 조회 (수정 페이지에서 사용) */
export async function getTodo(id: number): Promise<Todo> {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("해당 Todo를 찾을 수 없습니다.");
  }
  return res.json();
}
