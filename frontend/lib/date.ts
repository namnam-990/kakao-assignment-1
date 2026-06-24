// 날짜는 항상 "YYYY-MM-DD" 문자열로 다뤄 타임존 문제를 피한다.

/** KST(Asia/Seoul) 기준 오늘 날짜 — 서버 타임존과 무관하게 일관됨 */
export function getTodayString(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function getDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(dateString: string, amount: number): string {
  const date = parseDate(dateString);
  date.setDate(date.getDate() + amount);
  return getDateString(date);
}

/** 해당 날짜가 속한 주의 월요일 */
export function getMonday(dateString: string): string {
  const date = parseDate(dateString);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return getDateString(date);
}

/** 월요일 시작 기준 그 주의 7일 */
export function getWeekDates(weekStart: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export function formatDateText(dateString: string): string {
  return parseDate(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export function formatWeekTitle(weekDates: string[]): string {
  const first = parseDate(weekDates[0]);
  const last = parseDate(weekDates[6]);
  return `${first.getMonth() + 1}월 ${first.getDate()}일 ~ ${
    last.getMonth() + 1
  }월 ${last.getDate()}일`;
}
