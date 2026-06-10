const FILTERS = [
  {
    label: "전체",
    value: "all",
  },
  {
    label: "진행 중",
    value: "active",
  },
  {
    label: "완료",
    value: "completed",
  },
];

function FilterTabs({ filter, onChangeFilter }) {
  return (
    <div className="mb-5 flex gap-2">
      {FILTERS.map((item) => {
        const isActive = filter === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChangeFilter(item.value)}
            className={`flex-1 rounded-full px-4 py-2.5 font-bold ${
              isActive
                ? "bg-[#672be0] text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;