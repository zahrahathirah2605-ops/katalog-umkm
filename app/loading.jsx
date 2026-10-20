export default function Loading() {
  return (
    <div className="flex flex-col gap-8 py-10">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-permukaan" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar"
          >
            <div className="aspect-square w-full animate-pulse bg-permukaan" />
            <div className="flex flex-col gap-2 p-3">
              <div className="h-3 w-16 animate-pulse rounded bg-permukaan" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-permukaan" />
              <div className="mt-2 h-5 w-20 animate-pulse rounded bg-permukaan" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
