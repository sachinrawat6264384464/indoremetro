import React from "react";
import { Card } from "@/components/ui/card";

interface QRDisplayProps {
  qrImageBase64?: string;
  qrHash?: string;
  isExpired?: boolean;
}

export function QRDisplay({ qrImageBase64, qrHash, isExpired }: QRDisplayProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-6 bg-white/95 text-slate-900 border-slate-200 shadow-xl max-w-xs mx-auto text-center">
      {isExpired ? (
        <div className="w-48 h-48 rounded-lg bg-slate-100 flex flex-col items-center justify-center border-2 border-dashed border-red-300 text-red-500 p-4">
          <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-bold text-sm">QR Code Expired</span>
        </div>
      ) : qrImageBase64 ? (
        <div className="p-2 bg-white rounded-lg shadow-inner border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrImageBase64.startsWith("data:") ? qrImageBase64 : `data:image/png;base64,${qrImageBase64}`}
            alt="Metro QR Ticket"
            className="w-48 h-48 object-contain"
          />
        </div>
      ) : (
        <div className="w-48 h-48 rounded-lg bg-slate-100 flex flex-col items-center justify-center border-2 border-slate-200 text-slate-400">
          <svg className="w-10 h-10 mb-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs font-semibold">Generating QR...</span>
        </div>
      )}

      {qrHash && (
        <p className="mt-3 text-[10px] font-mono text-slate-500 break-all max-w-[200px]">
          Hash: {qrHash.substring(0, 24)}...
        </p>
      )}
    </Card>
  );
}
