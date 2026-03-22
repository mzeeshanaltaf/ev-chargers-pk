"use client";

export function CardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-border bg-surface-raised animate-pulse space-y-3">
      <div className="flex justify-between">
        <div className="h-5 w-20 bg-border rounded" />
        <div className="flex gap-1.5">
          <div className="h-5 w-12 bg-border rounded" />
          <div className="h-5 w-14 bg-border rounded" />
        </div>
      </div>
      <div className="h-4 w-full bg-border rounded" />
      <div className="h-4 w-3/4 bg-border rounded" />
      <div className="flex justify-between">
        <div className="h-4 w-24 bg-border rounded" />
        <div className="h-5 w-16 bg-border rounded" />
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-3 px-4 py-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
