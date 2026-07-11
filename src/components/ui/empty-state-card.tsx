import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyStateCard({
  title,
  description,
  icon,
  action,
  minHeightClassName = "min-h-[400px]",
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  minHeightClassName?: string;
}) {
  return (
    <Card className="glass-card">
      <CardContent className={`flex ${minHeightClassName} flex-col items-center justify-center text-center`}>
        {icon}
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        {description ? (
          <p className="mb-4 text-muted-foreground">{description}</p>
        ) : null}
        {action}
      </CardContent>
    </Card>
  );
}

