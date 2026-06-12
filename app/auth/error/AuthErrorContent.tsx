"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, AlertCircle } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "There is a server-side configuration issue. Please contact support.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or was already used.",
  Default: "An unexpected authentication error occurred. Please try again.",
};

export default function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "Default";
  const message = ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default;

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex items-center justify-center p-6">
      <div className="glass-card p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={26} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-[#1A0D12] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Authentication Error
        </h1>
        <p className="text-sm text-[#5C4A52] mb-2">{message}</p>
        <p className="text-xs text-[#9B8EA0] mb-8">Error code: <code className="font-mono bg-cream-200 px-1.5 py-0.5 rounded">{error}</code></p>
        <div className="flex flex-col gap-3">
          <Link href="/auth/login" className="btn-burgundy w-full justify-center text-sm py-3">Try again</Link>
          <Link href="/" className="btn-ghost w-full justify-center text-sm py-3">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
