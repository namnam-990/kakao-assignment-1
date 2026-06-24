import { Suspense } from "react";
import Link from "next/link";
import { getTodos, getCounts } from "@/app/actions";
import { getTodayString, getMonday, getWeekDates } from "@/lib/date";
import TodoItem from "@/components/TodoItem";
import FilterTabs from "@/components/FilterTabs";
import SearchBar from "@/components/SearchBar";
import WeekNavigator from "@/components/WeekNavigator";

interface TodosPageProps {
  searchParams: Promise<{ date?: string; filter?: string; search?: string }>;
}

export default async function TodosPage({ searchParams }: TodosPageProps) {
  const sp = await searchParams;
  const today = getTodayString();
  const selectedDate = sp.date ?? today;
  const filter = sp.filter ?? "all";
  const search = sp.search ?? "";

  const weekDates = getWeekDates(getMonday(selectedDate));

  // 서버에서 FastAPI를 직접 호출 (날짜/필터/검색 + 주간 개수)
  const [todos, counts] = await Promise.all([
    getTodos(selectedDate, filter, search),
    getCounts(weekDates[0], weekDates[6]),
  ]);

  return (
    <main className="min-h-screen bg-[#f4f1ff] px-5 py-12">
      <section className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-6 shadow-[0_20px_50px_rgba(103,43,224,0.15)] sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-[#672be0]">Todo List</h1>
            <p className="text-gray-500">날짜별 할 일을 깔끔하게 관리해보세요.</p>
          </div>
          <Link
            href={`/todos/new?date=${selectedDate}`}
            className="shrink-0 rounded-2xl bg-[#672be0] px-5 py-3 font-bold text-white"
          >
            + 추가
          </Link>
        </div>

        {/* useSearchParams 사용 컴포넌트들은 Suspense로 감싼다 */}
        <Suspense fallback={<div className="mb-5 h-72" />}>
          <WeekNavigator
            today={today}
            selectedDate={selectedDate}
            weekDates={weekDates}
            counts={counts}
          />
          <SearchBar />
          <FilterTabs />
        </Suspense>

        {todos.length === 0 ? (
          <p className="py-12 text-center text-gray-400">
            {search
              ? `"${search}"에 해당하는 Todo가 없습니다.`
              : "등록된 Todo가 없습니다."}
          </p>
        ) : (
          <ul className="space-y-2.5">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
