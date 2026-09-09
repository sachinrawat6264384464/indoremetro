import React from "react";
import Link from "next/link";
import { Station } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StationCardProps {
  station: Station;
}

export function StationCard({ station }: StationCardProps) {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "danger";
      case "UNDER_CONSTRUCTION":
        return "warning";
      default:
        return "neutral";
    }
  };

  return (
    <Card className="hover:border-amber-500/50 transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-400 group-hover:scale-105 transition-transform">
            {station.code}
          </div>
          <div>
            <CardTitle className="text-lg group-hover:text-amber-400 transition-colors">
              {station.name}
            </CardTitle>
            <p className="text-xs text-slate-400">{station.line_name}</p>
          </div>
        </div>
        <Badge variant={getBadgeVariant(station.status)}>
          {station.status.replace("_", " ")}
        </Badge>
      </CardHeader>

      <CardContent className="pt-3 space-y-3">
        {station.amenities && station.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {station.amenities.map((amenity, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 font-medium"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        <div className="pt-2 flex justify-between items-center border-t border-slate-800 text-xs">
          <span className="text-slate-400">
            {station.latitude && station.longitude
              ? `${station.latitude.toFixed(4)}, ${station.longitude.toFixed(4)}`
              : "Location map ready"}
          </span>
          <Link
            href={`/stations/${station.id}`}
            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            Details &rarr;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
