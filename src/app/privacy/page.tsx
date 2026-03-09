import Link from "next/link";
import { ArrowLeft, Binary } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 border-b border-gray-900">
        <div className="max-w-3xl mx-auto px-8 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Binary className="h-4 w-4 text-violet-400" />
            <span className="font-bold">D2D</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-8 py-20">
        <p className="text-sm text-violet-400 font-mono mb-4">/privacy</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-600 mb-12">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="prose prose-invert prose-gray max-w-none space-y-8 text-gray-400 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              The Short Version
            </h2>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-300/90 text-sm leading-relaxed">
              <p>
                D2D&apos;s code generation runs{" "}
                <strong>entirely in your browser</strong>. Your wireframes are
                never sent to any AI service. We store your project data
                (shapes, style guide) in our database for persistence only. We
                don&apos;t sell your data. We don&apos;t train models on your
                designs.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              1. What We Collect
            </h2>
            <p className="mb-3">We collect the minimum data necessary to provide the Service:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-gray-300">Account information:</strong>{" "}
                Name, email, profile picture (from Google OAuth)
              </li>
              <li>
                <strong className="text-gray-300">Project data:</strong>{" "}
                Canvas shapes, style guide configurations, viewport state — stored
                for auto-save and project persistence
              </li>
              <li>
                <strong className="text-gray-300">Subscription data:</strong>{" "}
                Plan type, payment status (via Razorpay)
              </li>
              <li>
                <strong className="text-gray-300">Moodboard images:</strong>{" "}
                Images you upload to your project&apos;s moodboard
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              2. What We Do NOT Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                We do <strong className="text-white">not</strong> send your
                wireframe shapes to any external AI/ML service
              </li>
              <li>
                We do <strong className="text-white">not</strong> collect
                analytics on your drawing behavior
              </li>
              <li>
                We do <strong className="text-white">not</strong> track which
                shapes or tools you use
              </li>
              <li>
                We do <strong className="text-white">not</strong> store
                generated code on our servers — it exists only in your browser
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              3. Code Generation Privacy
            </h2>
            <p>
              The D2D design engine pipeline — all 6 phases, all 19 TypeScript
              files — runs entirely in your browser&apos;s JavaScript runtime.
              Your shapes are processed client-side. The generated React +
              Tailwind code is produced client-side. No canvas data leaves your
              device during generation. This is a fundamental architectural
              decision, not a feature toggle.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              4. Data Storage
            </h2>
            <p>
              Project data is stored in Convex (our real-time database provider)
              for the purpose of project persistence and auto-save. Convex
              operates SOC 2 compliant infrastructure. Data is transmitted via
              encrypted WebSocket connections.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              5. Third-Party Services
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-gray-300">Convex:</strong> Real-time
                database and authentication
              </li>
              <li>
                <strong className="text-gray-300">Google OAuth:</strong>{" "}
                Authentication provider
              </li>
              <li>
                <strong className="text-gray-300">Razorpay:</strong> Payment
                processing
              </li>
              <li>
                <strong className="text-gray-300">Inngest:</strong> Background
                job processing (auto-save queue)
              </li>
            </ul>
            <p className="mt-3">
              None of these services receive your wireframe data or generated code.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              6. Data Deletion
            </h2>
            <p>
              You may delete your projects at any time from the dashboard.
              Deleted projects and their associated data (shapes, style guide,
              moodboard images) are permanently removed. To delete your account
              entirely, please contact us via GitHub.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              7. Open Source Transparency
            </h2>
            <p>
              D2D is open source. You can verify every claim in this privacy
              policy by reading the source code at{" "}
              <Link
                href="https://github.com/mevirajsheoran/d2d-compiler"
                target="_blank"
                className="text-violet-400 hover:text-violet-300 underline"
              >
                github.com/mevirajsheoran/d2d-compiler
              </Link>
              . The pipeline code is in{" "}
              <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded font-mono">
                src/lib/design-engine-pipeline/
              </code>{" "}
              — you can confirm it makes zero network calls.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              8. Contact
            </h2>
            <p>
              For privacy questions, open an issue on our{" "}
              <Link
                href="https://github.com/mevirajsheoran/d2d-compiler/issues"
                target="_blank"
                className="text-violet-400 hover:text-violet-300 underline"
              >
                GitHub repository
              </Link>
              .
            </p>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-gray-900">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to D2D
          </Link>
        </div>
      </main>
    </div>
  );
}