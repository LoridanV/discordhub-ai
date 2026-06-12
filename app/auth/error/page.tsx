import { Suspense } from "react";
import AuthErrorContent from "./AuthErrorContent";

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F3EE] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[rgba(109,33,60,0.2)] border-t-[#6D213C] rounded-full animate-spin" /></div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
