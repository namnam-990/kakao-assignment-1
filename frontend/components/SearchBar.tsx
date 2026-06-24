"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("search") ?? "");

  // 입력이 멈춘 뒤(300ms) 한 번만 URL을 갱신 → 요청 수 절감(디바운스)
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = value.trim();

      if (trimmed) {
        params.set("search", trimmed);
      } else {
        params.delete("search");
      }

      const query = params.toString();
      const next = query ? `${pathname}?${query}` : pathname;
      router.replace(next);
    }, 300);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="할 일 검색..."
        className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-[15px] outline-none focus:border-[#672be0]"
      />
    </div>
  );
}
