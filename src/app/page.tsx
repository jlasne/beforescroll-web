import Link from "next/link";

const APPSTORE_URL = "https://apps.apple.com/app/beforescroll";

const modes = [
  {
    emoji: "🚶",
    name: "Walk to Unlock",
    desc: "Hit your daily step goal before you can open any locked app.",
  },
  {
    emoji: "✝️",
    name: "Bible Reading",
    desc: "Read a daily verse and reflect before earning your scroll time.",
  },
  {
    emoji: "🌍",
    name: "Geopolitics Quiz",
    desc: "Answer a world events question to prove you're paying attention.",
  },
  {
    emoji: "💪",
    name: "Pushups",
    desc: "Do AI-verified pushups using your camera. No cheating.",
  },
];

const steps = [
  {
    num: "01",
    title: "Pick your challenge",
    desc: "Choose how you want to earn your screen time.",
  },
  {
    num: "02",
    title: "Lock your apps",
    desc: "Select which apps to lock — TikTok, Instagram, YouTube, and more.",
  },
  {
    num: "03",
    title: "Earn your scroll time",
    desc: "Complete the challenge. Only then do your apps unlock.",
  },
];

function AppStoreButton() {
  return (
    <a
      href={APPSTORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-xl bg-foreground px-6 py-3.5 text-background font-semibold text-base transition-all hover:scale-105 hover:shadow-lg active:scale-95"
    >
      <svg
        width="20"
        height="24"
        viewBox="0 0 814 1000"
        fill="currentColor"
      >
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.8-82.8-106.7-211.3-106.7-334.8 0-191.5 124.5-293.1 247.2-293.1 65.2 0 119.5 42.8 160.3 42.8 39.5 0 101.1-45.4 176.3-45.4 28.5 0 130.9 2.6 198.3 99.9zm-234-184.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 103.7-30.4 135.5-71.3z" />
      </svg>
      Download on the App Store
    </a>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
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
              BeforeScroll locks addictive apps and makes you complete a
              challenge before you can open them.
            </p>
          </div>
          <div className="animate-fade-in animate-delay-200 mb-16">
            <AppStoreButton />
          </div>
          <div className="animate-fade-in animate-delay-300">
            <div className="phone-frame" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`animate-fade-in ${
                  i === 0
                    ? "animate-delay-100"
                    : i === 1
                      ? "animate-delay-200"
                      : "animate-delay-300"
                } text-center md:text-left`}
              >
                <span className="text-accent font-mono text-sm font-bold">
                  {step.num}
                </span>
                <h3 className="text-xl font-semibold mt-2 mb-2 font-[family-name:var(--font-dm-serif)]">
                  {step.title}
                </h3>
                <p className="text-muted text-base">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unlock Modes */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Unlock Modes
          </h2>
          <p className="text-muted text-center text-lg mb-16 max-w-lg mx-auto">
            Choose your challenge. Make it yours.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {modes.map((mode, i) => (
              <div
                key={mode.name}
                className={`animate-fade-in ${
                  i === 0
                    ? "animate-delay-100"
                    : i === 1
                      ? "animate-delay-200"
                      : i === 2
                        ? "animate-delay-300"
                        : "animate-delay-400"
                } rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-md`}
              >
                <span className="text-3xl">{mode.emoji}</span>
                <h3 className="text-lg font-semibold mt-3 mb-1 font-[family-name:var(--font-dm-serif)]">
                  {mode.name}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {mode.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          <p className="text-2xl md:text-3xl font-bold leading-snug">
            Join thousands breaking
            <br />
            their phone addiction.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Take back your time.
          </h2>
          <p className="text-muted text-lg mb-2">
            Free to try.{" "}
            <span className="text-foreground font-semibold">$6.99/week.</span>
          </p>
          <p className="text-muted text-sm mb-10">Cancel anytime.</p>
          <AppStoreButton />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>&copy; 2025 BeforeScroll</p>
          <div className="flex gap-6">
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
