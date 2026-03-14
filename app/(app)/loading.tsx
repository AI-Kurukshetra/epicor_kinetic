import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-28 w-full rounded-[28px]" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36 w-full rounded-[28px]" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <Skeleton className="h-[360px] w-full rounded-[28px]" />
        <Skeleton className="h-[360px] w-full rounded-[28px]" />
      </div>
    </div>
  );
}
