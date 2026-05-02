import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — BeforeScroll",
};

export default function Privacy() {
  return (
    <main className="min-h-screen px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-accent text-sm font-medium hover:underline"
        >
          &larr; Back to home
        </Link>
        <h1 className="text-3xl font-bold mt-8 mb-8">Privacy Policy</h1>
        <div className="text-muted space-y-4 text-sm leading-relaxed">
          <p>Last updated: April 2026</p>
          <p>
            BeforeScroll (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
            respects your privacy. This Privacy Policy explains how we collect,
            use, and protect your information when you use our mobile application.
          </p>
          <h2 className="text-foreground text-lg font-semibold pt-4">
            Information We Collect
          </h2>
          <p>
            We collect minimal information necessary to provide our service,
            including device health data (step counts) and basic usage analytics.
            All health data is processed locally on your device and never leaves
            it.
          </p>
          <h2 className="text-foreground text-lg font-semibold pt-4">
            How We Use Your Information
          </h2>
          <p>
            Your data is used solely to provide and improve the BeforeScroll
            experience. We do not sell your personal data to third parties.
          </p>
          <h2 className="text-foreground text-lg font-semibold pt-4">
            Data Storage & Security
          </h2>
          <p>
            Most data is stored locally on your device. We use
            industry-standard security measures to protect any data transmitted
            to our servers.
          </p>
          <h2 className="text-foreground text-lg font-semibold pt-4">
            Data Retention
          </h2>
          <p>
            Health data (step counts) is processed locally on your device and is
            never transmitted to or stored on our servers. Account data (email
            address, sign-in information) is retained for as long as your account
            is active. Analytics data is retained for up to 12 months.
          </p>
          <h2 className="text-foreground text-lg font-semibold pt-4">
            Data Deletion
          </h2>
          <p>
            You can request deletion of your account and all associated data at any
            time by emailing us at [support@beforescroll.app](mailto:support@beforescroll.app) with the subject
            &quot;Delete my account.&quot; We will process your request within 30
            days. You can also delete your account directly from the app in
            Settings → Account → Delete Account.
          </p>
          <h2 className="text-foreground text-lg font-semibold pt-4">
            Contact
          </h2>
          <p>
            If you have questions about this Privacy Policy, please contact us
            at support@beforescroll.app.
          </p>
        </div>
      </div>
    </main>
  );
}
