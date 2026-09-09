import React from "react";
import { Route } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RouteMapProps {
  route: Route;
}

export function RouteMap({ route }: RouteMapProps) {
  const stations = route.route_stations || [];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full inline-block"
                style={{ backgroundColor: route.line_color || "#F59E0B" }}
              />
              <CardTitle>{route.name}</CardTitle>
            </div>
            <p className="text-sm text-slate-400 mt-1">{route.direction}</p>
          </div>
          <Badge variant="success">{route.status}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-1 before:bg-amber-500/40">
          {stations.length > 0 ? (
            stations.map((rs, idx) => (
              <div key={rs.id || idx} className="relative flex items-center justify-between group">
                <div
                  className="absolute -left-[19px] w-4 h-4 rounded-full border-2 border-amber-500 bg-slate-900 group-hover:bg-amber-500 transition-colors"
                />
                <div>
                  <h4 className="font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">
                    {rs.station?.name || `Station ${rs.station_order}`}
                  </h4>
                  <span className="text-xs text-slate-400">
                    Code: {rs.station?.code || "N/A"}
                  </span>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <p>{rs.distance_from_start_km} km</p>
                  <p>{rs.travel_time_mins} mins</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">No stations listed for this route.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
