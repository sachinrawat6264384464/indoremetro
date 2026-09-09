"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface TicketDownloadProps {
  ticketNumber: string;
}

export function TicketDownload({ ticketNumber }: TicketDownloadProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    // Simulate window print / PDF save
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 400);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      isLoading={downloading}
      className="flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span>Download E-Ticket</span>
    </Button>
  );
}
