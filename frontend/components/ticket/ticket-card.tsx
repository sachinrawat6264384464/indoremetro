import React from "react";
import Link from "next/link";
import { Ticket } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="success">Confirmed</Badge>;
      case "USED":
        return <Badge variant="info">Used</Badge>;
      case "PENDING_PAYMENT":
        return <Badge variant="warning">Pending Payment</Badge>;
      case "CANCELLED":
      case "EXPIRED":
        return <Badge variant="danger">{status}</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <Card className="hover:border-amber-500/40 transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <span className="text-xs font-mono text-amber-400 font-bold">
            {ticket.ticket_number}
          </span>
          <CardTitle className="text-base mt-0.5">
            {ticket.source_station?.name || "Source"} &rarr; {ticket.dest_station?.name || "Destination"}
          </CardTitle>
        </div>
        {getStatusBadge(ticket.status)}
      </CardHeader>

      <CardContent className="pt-2 space-y-3">
        <div className="flex justify-between text-xs text-slate-300">
          <div>
            <span className="text-slate-400 block">Journey Date</span>
            <span className="font-semibold">{formatDate(ticket.journey_date)}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Passengers</span>
            <span className="font-semibold">{ticket.passenger_count} Person(s)</span>
          </div>
          <div>
            <span className="text-slate-400 block">Total Fare</span>
            <span className="font-bold text-amber-400">{formatCurrency(ticket.total_fare)}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400">
            Booked: {formatDate(ticket.created_at)}
          </span>
          <Link
            href={`/ticket/${ticket.id}`}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-semibold transition-colors"
          >
            View E-Ticket &rarr;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
