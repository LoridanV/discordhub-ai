"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare, Shield, BarChart3, Ticket } from "lucide-react";
import Link from "next/link";

const PERKS = [
  { icon: Shield, text: "AI-powered moderation" },
  { icon: BarChart3, text: "Advanced server analytics" },
  { icon: Ticket, text: "Full ticket management system" },
  { icon: MessageSquare, text: "Intelligent AI insights" },
];

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn("discord", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="liquid-glass rounded-2xl p-10 flex flex-col justify-between"
        >
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-12">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                   style={{ background: "linear-gradient(135deg, #6D213C 0%, #4B1026 100%)" }}>
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-bold text-[#1A0D12] text-lg tracking-tight">DiscordHub AI</span>
            </Link>

            <h1 className="text-3xl font-bold text-[#1A0D12] mb-3 tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Manage your server<br />smarter, not harder.
            </h1>
            <p className="text-[#5C4A52] text-sm leading-relaxed mb-10">
              Connect your Discord account to access your dashboard, analytics, moderation tools, and more.
            </p>

            <div className="space-y-3">
              {PERKS.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                       style={{ background: "rgba(109,33,60,0.08)" }}>
                    <p.icon size={15} style={{ color: "#6D213C" }} />
                  </div>
                  <span className="text-sm text-[#5C4A52]">{p.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-xs text-[#9B8EA0] mt-10">
            50,000+ servers trust DiscordHub AI for their community management.
          </p>
        </motion.div>

        {/* Right panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-10 flex flex-col items-center justify-center"
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg"
               style={{ background: "linear-gradient(135deg, #6D213C 0%, #4B1026 100%)" }}>
            <Sparkles size={28} className="text-white" />
          </div>

          <h2 className="text-2xl font-bold text-[#1A0D12] mb-2 text-center"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Welcome back
          </h2>
          <p className="text-sm text-[#9B8EA0] mb-10 text-center">
            Sign in with your Discord account to continue
          </p>

          <button
            onClick={handleSignIn}
            disabled={loading || status === "loading"}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: loading ? "rgba(88,101,242,0.7)" : "linear-gradient(135deg, #5865F2 0%, #4752c4 100%)",
              boxShadow: "0 8px 24px rgba(88,101,242,0.35)",
            }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
            )}
            {loading ? "Connecting…" : "Continue with Discord"}
          </button>

          <div className="mt-8 space-y-2 text-center">
            <p className="text-xs text-[#9B8EA0]">
              By signing in, you agree to our{" "}
              <a href="#" className="text-[#6D213C] hover:underline">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="text-[#6D213C] hover:underline">Privacy Policy</a>.
            </p>
            <p className="text-xs text-[#9B8EA0]">
              We only request read access to your guild list.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[rgba(109,33,60,0.08)] w-full text-center">
            <p className="text-xs text-[#9B8EA0]">
              Don&apos;t have a server?{" "}
              <a href="https://discord.com/servers" target="_blank" rel="noreferrer" className="text-[#6D213C] hover:underline">
                Create one on Discord
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
