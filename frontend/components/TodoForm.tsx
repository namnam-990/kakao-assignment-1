"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Todo } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

interface TodoFormProps {
  // todo가 있으면 "수정", 없으면 "생성"
  todo?: Todo;
  // 생성 시 적용할 날짜 (목록에서 선택된 날짜)
  defaultDate?: string;
}

export default function TodoForm({ todo, defaultDate }: TodoFormProps) {
  const router = useRouter();
  const isEdit = Boolean(todo);
  const targetDate = isEdit ? todo!.date : defaultDate!;

  const [text, setText] = useState(todo?.text ?? "");
  const [completed, setCompleted] = useState(todo?.completed ?? false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const backToList = () => {
    router.push(`/todos?date=${targetDate}`);
    router.refresh();
  };

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("할 일을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const url = isEdit ? `${API_URL}/todos/${todo!.id}` : `${API_URL}/todos`;
      const method = isEdit ? "PUT" : "POST";
      const payload = isEdit
        ? { text: trimmed, completed }
        : { text: trimmed, date: targetDate };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("요청 처리에 실패했습니다.");
      }

      backToList();
    } catch {
      setError("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
        placeholder="할 일을 입력하세요"
        autoComplete="off"
        autoFocus
        className="rounded-2xl border border-gray-300 px-4 py-3 text-[15px] outline-none focus:border-[#672be0]"
      />

      {isEdit && (
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="h-4 w-4 accent-[#672be0]"
          />
          완료 처리
        </label>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 rounded-2xl bg-[#672be0] px-5 py-3 font-bold text-white"
        >
          {submitting ? "저장 중..." : isEdit ? "수정 완료" : "추가하기"}
        </button>
        <button
          type="button"
          onClick={backToList}
          className="rounded-2xl bg-gray-200 px-5 py-3 font-bold text-gray-600"
        >
          취소
        </button>
      </div>
    </div>
  );
}
