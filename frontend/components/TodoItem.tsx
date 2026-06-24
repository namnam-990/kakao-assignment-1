"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Todo } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export default function TodoItem({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("이 할 일을 삭제할까요?")) return;
    setLoading(true);
    try {
      await fetch(`${API_URL}/todos/${todo.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200 p-3 sm:flex-nowrap">
      <span
        className={`min-w-0 flex-1 break-all ${
          todo.completed ? "text-gray-400 line-through" : ""
        }`}
      >
        {todo.text}
      </span>

      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className="rounded-xl bg-[#2f9e44] px-3 py-2 text-sm text-white"
      >
        {todo.completed ? "취소" : "완료"}
      </button>

      <Link
        href={`/todos/${todo.id}`}
        className="rounded-xl bg-[#1971c2] px-3 py-2 text-sm text-white"
      >
        수정
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="rounded-xl bg-[#e03131] px-3 py-2 text-sm text-white"
      >
        삭제
      </button>
    </li>
  );
}
