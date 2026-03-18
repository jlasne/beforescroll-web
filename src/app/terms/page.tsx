import Link from "next/link";

export const metadata = {
  title: "Terms of Service — BeforeScroll",
};

export default function Terms() {
  return (
    <main className="min-h-screen px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-accent text-sm font-medium hover:underline"
        >
          &larr; Back to home
        </Link>
        <h1 className="text-3xl font-bold mt-8 mb-8">Terms of Service</h1>
        <div className="text-muted space-y-4 text-sm leading-relaxed">
          <p>Last updated: January 2025</p>
          <p>
            By using BeforeScroll, you agree to these Terms of Service. Please
            read them carefully.
          </p>
          <h2 className="text-foreground text-lg font-semibold pt-4">
            Use of Service
          </h2>
          <p>
            BeforeScroll is a screen time management app. You must be at least
            13 years old to use the service. You agree to use the app in
            compliance with all applicable laws.
          </p>
          <h2 className="text-foreground text-lg font-semibold pt-4">
            Subscriptions & Payments
          </h2>
          <p>
            BeforeScroll offers a free trial and a paid subscription at
            $6.99/week. Subscriptions are billed through the Apple App Store and
            are subject to Apple&apos;s terms. You can cancel anytime through your
            App Store settings.
          </p>
          <h2 className="text-foreground text-lg font-semibold pt-4">
            Limitation of Liability
          </h2>
          <p>
            BeforeScroll is provided &quot;as is&quot; without warranties of any
            kind. We are not liable for any damages arising from your use of the
            app.
          </p>
          <h2 className="text-foreground text-lg font-semibold pt-4">
            Changes to Terms
          </h2>
          <p>
            We may update these terms from time to time. Continued use of the
            app constitutes acceptance of any changes.
          </p>
          <h2 className="text-foreground text-lg font-semibold pt-4">
            Contact
          </h2>
          <p>
            Questions? Contact us at support@beforescroll.app.
          </p>
        </div>
      </div>
    </main>
  );
}
