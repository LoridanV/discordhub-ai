"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Zap, ArrowRight } from "lucide-react";

const PLANS = [
  {
    id: "FREE",
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "For small servers just getting started.",
    icon: Zap,
    iconColor: "#9B8EA0",
    iconBg: "rgba(155,142,160,0.1)",
    features: [
      "1 Discord server",
      "Basic AI moderation",
      "Core analytics (7-day history)",
      "Standard ticket system",
      "Up to 100 tickets/month",
      "Community support",
    ],
    cta: "Get started free",
    ctaHref: "/auth/login",
    highlighted: false,
  },
  {
    id: "PRO",
    name: "Pro",
    price: { monthly: 15, yearly: 12 },
    description: "For growing communities that need more power.",
    icon: Crown,
    iconColor: "#6D213C",
    iconBg: "rgba(109,33,60,0.1)",
    features: [
      "Unlimited Discord servers",
      "Advanced AI moderation",
      "Full analytics (90-day history)",
      "Priority ticket routing",
      "Unlimited tickets",
      "AI Insights weekly reports",
      "Custom moderation rules",
      "Email support",
    ],
    cta: "Start Pro",
    ctaHref: "/auth/login",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    price: { monthly: null, yearly: null },
    description: "For large-scale communities with custom needs.",
    icon: Sparkles,
    iconColor: "#4B1026",
    iconBg: "rgba(75,16,38,0.1)",
    features: [
      "Everything in Pro",
      "Custom AI model fine-tuning",
      "Advanced retention analytics",
      "SLA & uptime guarantee",
      "Priority 24/7 support",
      "Custom integrations",
      "Dedicated account manager",
      "On-premise deployment option",
    ],
    cta: "Contact sales",
    ctaHref: "mailto:sales@discordhub.ai",
    highlighted: false,
  },
];

const FAQ = [
  { q: "Can I switch plans anytime?", a: "Yes. Upgrade or downgrade at any time. Changes take effect on your next billing cycle." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex) and PayPal through Stripe." },
  { q: "Is there a free trial for Pro?", a: "Yes — new accounts get a 14-day free trial of Pro with no credit card required." },
  { q: "What happens when I exceed my ticket limit on Free?", a: "You'll be prompted to upgrade. Existing tickets remain accessible." },
  { q: "Do you offer discounts for non-profits?", a: "Yes, contact us at support@discordhub.ai for our non-profit discount program." },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-[rgba(247,243,238,0.88)] backdrop-blur-xl border-b border-[rgba(109,33,60,0.08)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6D213C 0%, #4B1026 100%)" }}>
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-bold text-[#1A0D12]">DiscordHub AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#5C4A52]">
            <Link href="/features" className="hover:text-[#6D213C] transition-colors">Features</Link>
            <Link href="/pricing" className="text-[#6D213C] font-medium">Pricing</Link>
            <Link href="/docs" className="hover:text-[#6D213C] transition-colors">Docs</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm py-2 px-4">Sign in</Link>
            <Link href="/auth/login" className="btn-burgundy text-sm py-2 px-4">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-eyebrow mb-5 mx-auto w-fit"><Crown size={12} /> Simple, transparent pricing</div>
          <h1 className="text-5xl font-bold text-[#1A0D12] tracking-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Choose your plan
          </h1>
          <p className="text-[#5C4A52] max-w-xl mx-auto mb-8">
            Start free. Scale when you're ready. No hidden fees, no surprises.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-cream-200/60 rounded-full p-1.5 border border-[rgba(109,33,60,0.1)]">
            <button onClick={() => setYearly(false)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!yearly ? "bg-white text-[#1A0D12] shadow-sm" : "text-[#9B8EA0]"}`}>
              Monthly
            </button>
            <button onClick={() => setYearly(true)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${yearly ? "bg-white text-[#1A0D12] shadow-sm" : "text-[#9B8EA0]"}`}>
              Yearly <span className="text-xs text-emerald-600 font-semibold ml-1">–20%</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlighted
                  ? "border-2 border-[#6D213C] shadow-[0_8px_40px_rgba(109,33,60,0.2)]"
                  : "glass-card"
              }`}
              style={plan.highlighted ? { background: "linear-gradient(180deg, rgba(252,250,248,0.95) 0%, rgba(247,243,238,0.95) 100%)" } : {}}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-md"
                        style={{ background: "linear-gradient(135deg, #6D213C, #4B1026)" }}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: plan.iconBg }}>
                  <plan.icon size={20} style={{ color: plan.iconColor }} />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A0D12]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{plan.name}</h3>
                  <p className="text-xs text-[#9B8EA0]">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                {plan.price.monthly === null ? (
                  <div>
                    <p className="text-3xl font-bold text-[#1A0D12]">Custom</p>
                    <p className="text-xs text-[#9B8EA0] mt-1">Contact us for pricing</p>
                  </div>
                ) : plan.price.monthly === 0 ? (
                  <div>
                    <p className="text-3xl font-bold text-[#1A0D12]">Free</p>
                    <p className="text-xs text-[#9B8EA0] mt-1">Forever</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold text-[#1A0D12]">
                        €{yearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span className="text-[#9B8EA0] text-sm mb-1">/mo</span>
                    </div>
                    {yearly && (
                      <p className="text-xs text-emerald-600 font-medium mt-1">
                        Billed annually · save €{(plan.price.monthly! - plan.price.yearly!) * 12}/yr
                      </p>
                    )}
                  </div>
                )}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-[#5C4A52]">
                    <Check size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={`w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-medium text-sm transition-all ${
                  plan.highlighted
                    ? "btn-burgundy"
                    : "btn-ghost"
                }`}
              >
                {plan.cta} <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Feature comparison note */}
        <p className="text-center text-sm text-[#9B8EA0] mt-8">
          All plans include SSL encryption, GDPR compliance, and 99.9% uptime SLA.
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1A0D12] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Frequently asked questions
          </h2>
        </div>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-medium text-[#1A0D12]">{item.q}</span>
                <span className={`text-[#9B8EA0] transition-transform duration-200 text-lg leading-none ${openFaq === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-4"
                >
                  <p className="text-sm text-[#5C4A52] leading-relaxed">{item.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(109,33,60,0.08)] bg-[rgba(252,250,248,0.6)]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#9B8EA0]">
          <div className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: "#6D213C" }} />
            <span className="font-semibold text-[#1A0D12]">DiscordHub AI</span>
          </div>
          <div className="flex gap-6">
            <Link href="/features" className="hover:text-[#6D213C] transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-[#6D213C] transition-colors">Pricing</Link>
            <Link href="/docs" className="hover:text-[#6D213C] transition-colors">Docs</Link>
          </div>
          <p>Made with ❤️ by <a href="https://github.com/LoridanV" target="_blank" rel="noreferrer" className="text-[#6D213C] hover:underline">Loridan Varta</a></p>
        </div>
      </footer>
    </div>
  );
}
