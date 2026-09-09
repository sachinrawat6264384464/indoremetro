"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-amber-400">Forgot Password</CardTitle>
          <p className="text-sm text-slate-400 mt-1">
            Enter your registered email address to receive password recovery instructions.
          </p>
        </CardHeader>

        <CardContent>
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl">
                ✓
              </div>
              <h3 className="font-bold text-slate-100">Recovery Email Sent</h3>
              <p className="text-xs text-slate-400">
                We have sent instructions to <strong>{email}</strong>. Please check your inbox.
              </p>
              <Link href="/login" className="inline-block mt-2 text-sm text-amber-400 hover:underline">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button type="submit" isLoading={loading} className="w-full">
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link href="/login" className="text-xs text-slate-400 hover:text-amber-400 transition-colors">
                  Remember password? Log in
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
