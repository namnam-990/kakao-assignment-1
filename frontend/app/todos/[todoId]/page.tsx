import Link from "next/link";
import { getTodo } from "@/app/actions";
import TodoForm from "@/components/TodoForm";

interface EditPageProps {
  params: Promise<{ todoId: string }>;
}

export default async function EditTodoPage({ params }: EditPageProps) {
  const { todoId } = await params;
  const todo = await getTodo(Number(todoId));

  return (
    <main className="min-h-screen bg-[#f4f1ff] px-5 py-12">
      <section className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-6 shadow-[0_20px_50px_rgba(103,43,224,0.15)] sm:p-8">
        <Link href={`/todos?date=${todo.date}`} className="text-sm text-[#672be0]">
          ← 목록으로
        </Link>
        <h1 className="mb-1 mt-2 text-2xl font-bold text-[#672be0]">Todo 수정</h1>
        <p className="mb-6 text-sm text-gray-500">{todo.date}</p>
        <TodoForm todo={todo} />
      </section>
    </main>
  );
}
