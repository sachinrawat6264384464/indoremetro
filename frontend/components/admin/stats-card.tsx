import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="flex items-center justify-between pb-2">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <div className="text-2xl font-bold text-slate-100 tracking-tight">
        {value}
      </div>

      {(description || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                "font-semibold px-1.5 py-0.5 rounded",
                trend.isPositive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              )}
            >
              {trend.isPositive ? "+" : ""}{trend.value}
            </span>
          )}
          {description && (
            <span className="text-slate-400">{description}</span>
          )}
        </div>
      )}
    </Card>
  );
}
