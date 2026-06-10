function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatWeekTitle(weekDates) {
  const firstDate = parseDate(weekDates[0]);
  const lastDate = parseDate(weekDates[6]);

  return `${firstDate.getMonth() + 1}월 ${firstDate.getDate()}일 ~ ${
    lastDate.getMonth() + 1
  }월 ${lastDate.getDate()}일`;
}

function WeekNavigator({
  today,
  weekDates,
  selectedDate,
  onSelectDate,
  onMoveWeek,
  countTodosByDate,
}) {
  const dayNames = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <section className="mb-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onMoveWeek(-1)}
          className="rounded-xl bg-[#672be0] px-3 py-2 text-sm font-bold text-white"
        >
          이전 주
        </button>

        <h2 className="text-center text-base font-bold sm:text-lg">
          {formatWeekTitle(weekDates)}
        </h2>

        <button
          type="button"
          onClick={() => onMoveWeek(1)}
          className="rounded-xl bg-[#672be0] px-3 py-2 text-sm font-bold text-white"
        >
          다음 주
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {weekDates.map((dateString, index) => {
          const date = parseDate(dateString);
          const isSelected = dateString === selectedDate;
          const isToday = dateString === today;
          const todoCount = countTodosByDate(dateString);

          return (
            <button
              key={dateString}
              type="button"
              onClick={() => onSelectDate(dateString)}
              className={`rounded-2xl px-1 py-3 text-center ${
                isSelected
                  ? "bg-[#672be0] text-white"
                  : "bg-[#f1ecff] text-gray-600"
              } ${isToday && !isSelected ? "border-2 border-[#672be0]" : ""}`}
            >
              <div className="text-xs font-bold">{dayNames[index]}</div>
              <div className="my-1 text-base font-bold sm:text-lg">
                {date.getDate()}
              </div>
              <div className="text-[11px] sm:text-xs">{todoCount}개</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default WeekNavigator;