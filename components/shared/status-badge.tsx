import { Badge } from "@/components/ui/badge";
import { getStatusTone } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const tone = getStatusTone(status);
  const variant =
    tone === "success"
      ? "success"
      : tone === "warning"
        ? "warning"
        : tone === "destructive"
          ? "destructive"
          : "default";

  return <Badge variant={variant}>{status}</Badge>;
}
