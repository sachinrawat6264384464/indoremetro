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
    <Card className={cn("relative overflow-hidden border-slate-200 shadow-sm", className)}>
      <div className="flex items-center justify-between pb-2">
        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <div className="text-3xl font-black text-slate-900 tracking-tight">
        {value}
      </div>

      {(description || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs font-semibold">
          {trend && (
            <span
              className={cn(
                "font-extrabold px-2 py-0.5 rounded-md",
                trend.isPositive
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-rose-100 text-rose-800 border border-rose-200"
              )}
            >
              {trend.isPositive ? "+" : ""}{trend.value}
            </span>
          )}
          {description && (
            <span className="text-slate-500 font-medium">{description}</span>
          )}
        </div>
      )}
    </Card>
  );
}
