"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#f4f1ff] px-5 py-12">
      <section className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-8 text-center shadow-[0_20px_50px_rgba(103,43,224,0.15)]">
        <h2 className="mb-2 text-xl font-bold text-red-600">
          문제가 발생했습니다
        </h2>
        <p className="mb-6 text-gray-500">
          {error.message || "데이터를 불러오는 중 오류가 발생했습니다."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-2xl bg-[#672be0] px-6 py-3 font-bold text-white"
        >
          다시 시도
        </button>
      </section>
    </main>
  );
}
