export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f4f1ff] px-5 py-12">
      <section className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-6 shadow-[0_20px_50px_rgba(103,43,224,0.15)] sm:p-8">
        <div className="mb-6 h-9 w-40 animate-pulse rounded-lg bg-gray-200" />
        <div className="mb-4 h-12 animate-pulse rounded-2xl bg-gray-100" />
        <div className="space-y-2.5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-14 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
