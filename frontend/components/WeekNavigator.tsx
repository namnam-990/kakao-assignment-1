"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  parseDate,
  addDays,
  getMonday,
  formatDateText,
  formatWeekTitle,
} from "@/lib/date";

const DAY_NAMES = ["월", "화", "수", "목", "금", "토", "일"];

interface WeekNavigatorProps {
  today: string;
  selectedDate: string;
  weekDates: string[];
  counts: Record<string, number>;
}

export default function WeekNavigator({
  today,
  selectedDate,
  weekDates,
  counts,
}: WeekNavigatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // filter/search 등 다른 파라미터는 보존하고 date만 교체
  const goToDate = (date: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", date);
    router.push(`${pathname}?${params.toString()}`);
  };

  const moveDate = (amount: number) => goToDate(addDays(selectedDate, amount));

  // 주 이동: 해당 주의 월요일로 선택일도 이동 (2차 과제와 동일 동작)
  const moveWeek = (amount: number) => {
    const nextWeekStart = addDays(getMonday(selectedDate), amount * 7);
    goToDate(nextWeekStart);
  };

  return (
    <section className="mb-5">
      {/* 주 이동 */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => moveWeek(-1)}
          className="rounded-xl bg-[#672be0] px-3 py-2 text-sm font-bold text-white"
        >
          이전 주
        </button>
        <h2 className="text-center text-base font-bold sm:text-lg">
          {formatWeekTitle(weekDates)}
        </h2>
        <button
          type="button"
          onClick={() => moveWeek(1)}
          className="rounded-xl bg-[#672be0] px-3 py-2 text-sm font-bold text-white"
        >
          다음 주
        </button>
      </div>

      {/* 요일 그리드 */}
      <div className="mb-5 grid grid-cols-7 gap-1.5 sm:gap-2">
        {weekDates.map((dateString, index) => {
          const date = parseDate(dateString);
          const isSelected = dateString === selectedDate;
          const isToday = dateString === today;
          const count = counts[dateString] ?? 0;

          return (
            <button
              key={dateString}
              type="button"
              onClick={() => goToDate(dateString)}
              className={`rounded-2xl px-1 py-3 text-center ${
                isSelected
                  ? "bg-[#672be0] text-white"
                  : "bg-[#f1ecff] text-gray-600"
              } ${
                isToday && !isSelected ? "border-2 border-[#672be0]" : ""
              }`}
            >
              <div className="text-xs font-bold">{DAY_NAMES[index]}</div>
              <div className="my-1 text-base font-bold sm:text-lg">
                {date.getDate()}
              </div>
              <div className="text-[11px] sm:text-xs">{count}개</div>
            </button>
          );
        })}
      </div>

      {/* 선택된 날짜 이동 */}
      <div className="flex items-center justify-between rounded-2xl bg-[#f7f4ff] p-4">
        <button
          type="button"
          onClick={() => moveDate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#672be0] text-3xl text-white"
          aria-label="이전 날짜"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="mb-1 text-xs text-gray-500">선택된 날짜</p>
          <h2 className="text-lg font-bold sm:text-xl">
            {formatDateText(selectedDate)}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => moveDate(1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#672be0] text-3xl text-white"
          aria-label="다음 날짜"
        >
          ›
        </button>
      </div>
    </section>
  );
}
