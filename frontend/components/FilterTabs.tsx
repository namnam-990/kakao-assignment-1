"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const FILTERS = [
  { label: "전체", value: "all" },
  { label: "진행 중", value: "active" },
  { label: "완료", value: "completed" },
];

export default function FilterTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("filter") ?? "all";

  const handleClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("filter");
    } else {
      params.set("filter", value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="mb-4 flex gap-2">
      {FILTERS.map((item) => {
        const isActive = current === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => handleClick(item.value)}
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
