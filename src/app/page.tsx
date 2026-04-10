import Link from "next/link";
import EmailCapture from "@/components/EmailCapture";
import FeatureRow from "@/components/FeatureRow";

const features = [
  {
    eyebrow: "Step 01 — Lock",
    title: "Lock the apps that own you.",
    body: "TikTok, Instagram, YouTube — pick the apps that swallow your day. BeforeScroll holds them shut until your body moves. No willpower required, just a hard line your thumb can't cross.",
    image: "/screenshots/01-lock-tiktok.png",
    alt: "Lock screen showing apps blocked until you walk",
  },
  {
    eyebrow: "Step 02 — Budget",
    title: "Set a daily budget you'll actually keep.",
    body: "Decide how much screen time you deserve each day. Watch it tick down as you scroll. Your weekly chart tells the truth — no nags, no guilt, just the number staring back at you.",
    image: "/screenshots/02-set-daily-limits.png",
    alt: "Daily time budget and weekly screen time chart",
  },
  {
    eyebrow: "Step 03 — Streak",
    title: "Build a streak worth keeping.",
    body: "Every step counts. Every day stacks. Hit your goal, watch the streak grow. Miss a day, start again. Real momentum — not another notification screaming for attention.",
    image: "/screenshots/03-build-streaks.png",
    alt: "Streak counter and weekly activity chart",
  },
  {
    eyebrow: "Step 04 — Try",
    title: "Try it free for 7 days.",
    body: "No credit card. No subscription trap. Lock your apps, walk for a week, and decide for yourself. If it doesn't change how you scroll, walk away — literally.",
    image: "/screenshots/04-try-free.png",
    alt: "App selection screen with WhatsApp, YouTube, Chrome",
  },
  {
    eyebrow: "Step 05 — Earn",
    title: "Earn every minute on your feet.",
    body: "Set your daily step goal and your screen time target. Walk 100 steps, unlock 1 minute. Your phone, your rules — the lazier you get, the longer the lock.",
    image: "/screenshots/05-earn-screen-time.png",
    alt: "Settings showing step goal and screen time target",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero + screenshots — single unified section */}
      <section className="relative flex flex-col items-center px-6 pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(196,168,130,0.15)_0%,_transparent_60%)]" />
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="animate-fade-in">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="BeforeScroll"
              width={72}
              height={72}
              className="rounded-2xl mb-6 shadow-lg"
            />
          </div>
          <div className="animate-fade-in animate-delay-100">
            <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">
              BeforeScroll
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Before you scroll,
              <br />
              <span className="text-accent">do something real.</span>
            </h1>
            <p className="text-muted text-lg md:text-xl max-w-xl mx-auto mb-10">
              BeforeScroll locks addictive apps until you hit your daily step
              goal. No willpower needed — just walk.
            </p>
          </div>
          <div className="animate-fade-in animate-delay-200 w-full max-w-md">
            <EmailCapture />
          </div>
        </div>
      </section>

      {/* Features — one screen per scroll, alternating sides */}
      <section className="px-6 pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto flex flex-col gap-28 md:gap-40">
          {features.map((feature, i) => (
            <FeatureRow
              key={feature.image}
              index={i}
              eyebrow={feature.eyebrow}
              title={feature.title}
              body={feature.body}
              image={feature.image}
              alt={feature.alt}
              reverse={i % 2 === 1}
            />
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 pb-24 md:pb-32">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
            Ready to walk before you scroll?
          </h2>
          <p className="text-muted text-lg md:text-xl mb-10">
            Join the waitlist. We'll ping you the moment BeforeScroll lands on
            your phone.
          </p>
          <div className="max-w-md mx-auto">
            <EmailCapture />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>&copy; 2026 BeforeScroll</p>
          <div className="flex gap-6">
            <Link
              href="/feedback"
              className="hover:text-foreground transition-colors"
            >
              Feature Requests
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
