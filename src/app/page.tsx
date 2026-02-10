// src/app/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Code,
  Sparkles,
  Download,
  Palette,
  Save,
  Moon,
  ArrowRight,
  ArrowDown,
  Check,
  Clock,
  Zap,
  Layers,
} from "lucide-react";
import { FadeInOnScroll, GradientText } from "@/components/landing/animated";
import { Magnetic } from "@/components/landing/magnetic";
import { LiveCanvas } from "@/components/landing/live-canvas";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden page-enter">

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
        {/* Single subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-500/8 rounded-full blur-[150px] glow-pulse" />
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="max-w-[1400px] mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">D2D</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/auth/sign-in"
              className="text-sm hover:opacity-60 transition-opacity"
            >
              Sign In
            </Link>
            <Magnetic strength={0.4}>
              <Link href="/auth/sign-up">
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-white/90 rounded-full px-5 h-9 text-sm"
                >
                  Start Free
                </Button>
              </Link>
            </Magnetic>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="min-h-screen relative flex items-center">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 px-8 lg:px-16 pt-32 pb-20 lg:py-0">
          <div className="max-w-xl">
            <p className="text-sm text-gray-500 mb-6 tracking-widest uppercase animate-fade-in">
              Design Tool for Developers
            </p>

            <h1 className="animate-fade-in-delay-1">
              <span className="block text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.85]">
                Sketch
              </span>
              <span className="block text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.85] text-gray-600">
                to
              </span>
              <span className="block text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.85]">
                <GradientText>Code</GradientText>
              </span>
            </h1>

            <p className="mt-8 text-lg text-gray-400 leading-relaxed max-w-md animate-fade-in-delay-2">
              Draw wireframes. AI transforms them into production-ready React
              components. That simple.
            </p>

            <div className="mt-10 flex items-center gap-4 animate-fade-in-delay-3">
              <Magnetic strength={0.3}>
                <Link href="/auth/sign-up">
                  <div className="glow-border rounded-full">
                    <Button className="h-12 px-8 bg-black text-white hover:bg-black/90 rounded-full text-base font-medium relative z-10 border-0">
                      Start Creating
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </Link>
              </Magnetic>
              <span className="text-sm text-gray-600">Free forever</span>
            </div>
          </div>
        </div>

        {/* Right Side - Canvas Preview */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[55%]">
          <div className="absolute inset-0 bg-gradient-to-l from-violet-500/5 via-transparent to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <span className="absolute -top-6 left-0 text-xs text-gray-600 font-mono">
                Frame 1
              </span>

              <div className="w-80 h-96 border border-dashed border-gray-700 rounded-lg relative">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #333 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                <div className="absolute top-6 left-4 right-4 h-10 bg-white/5 rounded border border-white/10 flex items-center px-3">
                  <div className="w-20 h-2 bg-white/20 rounded" />
                </div>

                <div className="absolute top-20 left-4 w-36 h-3 bg-white/10 rounded" />
                <div className="absolute top-26 left-4 w-48 h-3 bg-white/5 rounded" />

                <div className="absolute top-36 left-4 w-24 h-9 bg-violet-500/20 rounded border border-violet-500/30 flex items-center justify-center">
                  <span className="text-xs text-violet-400">Button</span>
                </div>

                <div className="absolute bottom-16 left-4 right-4 h-12 bg-white/5 rounded border border-white/10" />
              </div>

              <div className="absolute -right-4 top-32 w-4 h-4 rotate-[-15deg]">
                <svg
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-full h-full"
                >
                  <path d="M4 4l16 8-8 3-3 8z" />
                </svg>
              </div>

              <div className="absolute -right-24 top-48 text-[10px] font-mono text-gray-600 leading-relaxed">
                <div className="text-violet-400">{"<Button>"}</div>
                <div className="pl-2 text-white/40">Submit</div>
                <div className="text-violet-400">{"</Button>"}</div>
              </div>
            </div>
          </div>

          <div className="absolute top-1/3 right-0 w-px h-32 bg-gradient-to-b from-transparent via-gray-800 to-transparent" />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-8 lg:left-16 flex items-center gap-2 text-gray-600 text-sm animate-fade-in-delay-4">
          <ArrowDown className="h-4 w-4 animate-bounce" />
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <section className="py-20 border-t border-gray-900 overflow-hidden">
        <div className="flex whitespace-nowrap animate-scroll">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-8 px-8 text-7xl md:text-8xl font-bold text-gray-900 tracking-tighter select-none"
            >
              <span>Draw</span>
              <span className="text-violet-500">•</span>
              <span>Generate</span>
              <span className="text-cyan-500">•</span>
              <span>Ship</span>
              <span className="text-pink-500">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== LIVE CANVAS DEMO ===== */}
      <section className="py-32 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text */}
            <FadeInOnScroll>
              <div>
                <p className="text-sm text-gray-500 mb-4 tracking-widest uppercase">
                  Try it yourself
                </p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
                  See how it
                  <br />
                  <GradientText>feels to draw</GradientText>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
                  This is a tiny preview of the canvas. In the real app you get
                  10 tools, infinite space, zoom, frames, and auto-save.
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-violet-500" />
                    Click and drag to draw
                  </div>
                  <span className="text-gray-800">•</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-cyan-500" />
                    Pick a color
                  </div>
                </div>
              </div>
            </FadeInOnScroll>

            {/* Right - Live Canvas */}
            <FadeInOnScroll delay={0.15}>
              <LiveCanvas />
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <FadeInOnScroll>
            <div className="max-w-2xl mb-24">
              <p className="text-sm text-gray-500 mb-4 tracking-widest uppercase">
                What you get
              </p>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                Tools that get out of your way
              </h2>
            </div>
          </FadeInOnScroll>

          <div className="space-y-0">
            <FadeInOnScroll>
              <FeatureRow
                number="01"
                title="Infinite Canvas"
                description="10 drawing tools. Zoom infinitely. Pan freely. Organize with frames. Your ideas have no boundaries."
                icon={<Layers className="h-5 w-5" />}
              />
            </FadeInOnScroll>

            <FadeInOnScroll>
              <FeatureRow
                number="02"
                title="AI Code Generation"
                description="YOLO + OCR detects buttons, inputs, text. Generates clean React + Tailwind. Copy, paste, done."
                icon={<Sparkles className="h-5 w-5" />}
                comingSoon
              />
            </FadeInOnScroll>

            <FadeInOnScroll>
              <FeatureRow
                number="03"
                title="Frame Export"
                description="Export any frame as PNG. Share with your team or feed into AI generation."
                icon={<Download className="h-5 w-5" />}
              />
            </FadeInOnScroll>

            <FadeInOnScroll>
              <FeatureRow
                number="04"
                title="Style Guide"
                description="Set your colors, fonts, upload mood boards. AI matches your brand automatically."
                icon={<Palette className="h-5 w-5" />}
              />
            </FadeInOnScroll>

            <FadeInOnScroll>
              <FeatureRow
                number="05"
                title="Auto Save"
                description="Your work saves every 30 seconds. Retry logic. Nothing is ever lost."
                icon={<Save className="h-5 w-5" />}
              />
            </FadeInOnScroll>

            <FadeInOnScroll>
              <FeatureRow
                number="06"
                title="Dark Mode"
                description="Easy on the eyes. Day or night."
                icon={<Moon className="h-5 w-5" />}
              />
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="line-glow" />
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <FadeInOnScroll>
            <div className="text-center mb-20">
              <p className="text-sm text-gray-500 mb-4 tracking-widest uppercase">
                Process
              </p>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                Stupidly simple
              </h2>
            </div>
          </FadeInOnScroll>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-cyan-500/50 to-pink-500/50 hidden md:block" />

            <FadeInOnScroll>
              <ProcessStep
                number="1"
                title="Draw your idea"
                description="Use rectangles, text, frames. Sketch rough. It doesn't need to be pretty."
                position="left"
                color="violet"
              />
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.15}>
              <ProcessStep
                number="2"
                title="Let AI analyze"
                description="Our AI sees buttons, inputs, cards. Understands hierarchy and layout."
                position="right"
                color="cyan"
                comingSoon
              />
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.3}>
              <ProcessStep
                number="3"
                title="Get your code"
                description="Clean React + Tailwind. Production ready. Copy into your project."
                position="left"
                color="pink"
                comingSoon
              />
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="line-glow" />
      </div>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <FadeInOnScroll>
            <div className="max-w-2xl mb-20">
              <p className="text-sm text-gray-500 mb-4 tracking-widest uppercase">
                Pricing
              </p>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                Start free.
                <br />
                <span className="text-gray-600">Upgrade when ready.</span>
              </h2>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll>
            <div className="border-t border-gray-800">
              <PricingRow
                name="Free"
                price="₹0"
                features={[
                  "5 AI generations/mo",
                  "3 projects",
                  "All tools",
                  "Auto save",
                ]}
                buttonText="Start Free"
                buttonLink="/auth/sign-up"
              />

              <PricingRow
                name="Pro Monthly"
                price="₹499/mo"
                features={[
                  "100 generations/mo",
                  "Unlimited projects",
                  "Priority support",
                  "Style guide AI",
                ]}
                highlighted
                comingSoon
              />

              <PricingRow
                name="Pro Yearly"
                price="₹4,999/yr"
                features={[
                  "1200 generations/yr",
                  "Unlimited projects",
                  "Priority support",
                  "Style guide AI",
                ]}
                badge="Save 17%"
                comingSoon
              />
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-violet-500/5 via-transparent to-transparent" />

        <FadeInOnScroll>
          <div className="relative max-w-[1400px] mx-auto px-8 text-center">
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8">
              Ready?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-md mx-auto">
              Your next design is one sketch away.
            </p>
            <Magnetic strength={0.3}>
              <Link href="/auth/sign-up" className="inline-block">
                <div className="glow-border rounded-full">
                  <Button className="h-14 px-10 bg-black text-white hover:bg-black/90 rounded-full text-lg font-medium relative z-10 border-0">
                    Start Creating
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </Link>
            </Magnetic>
          </div>
        </FadeInOnScroll>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-8 border-t border-gray-900">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold">D2D</span>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="hover:text-white cursor-pointer transition-colors">
              About
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Terms
            </span>
          </div>
          <span className="text-sm text-gray-600">
            © {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ============================================================
   COMPONENTS
   ============================================================ */

function FeatureRow({
  number,
  title,
  description,
  icon,
  comingSoon = false,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}) {
  return (
    <div className="group border-t border-gray-800 py-8 md:py-12 grid md:grid-cols-12 gap-6 items-start hover:bg-white/[0.015] transition-colors px-4 -mx-4 rounded-lg">
      <div className="md:col-span-1 text-sm text-gray-600 font-mono">
        {number}
      </div>

      <div className="md:col-span-4 flex items-center gap-3">
        <div className="text-gray-500 group-hover:text-white transition-colors">
          {icon}
        </div>
        <h3 className="text-xl md:text-2xl font-medium group-hover:text-white transition-colors">
          {title}
        </h3>
        {comingSoon && (
          <Badge className="text-[10px] py-0 px-2 bg-violet-500/10 text-violet-400 border-violet-500/20">
            Soon
          </Badge>
        )}
      </div>

      <div className="md:col-span-7">
        <p className="text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function ProcessStep({
  number,
  title,
  description,
  position,
  color,
  comingSoon = false,
}: {
  number: string;
  title: string;
  description: string;
  position: "left" | "right";
  color: "violet" | "cyan" | "pink";
  comingSoon?: boolean;
}) {
  const colors = {
    violet: "text-violet-500 bg-violet-500",
    cyan: "text-cyan-500 bg-cyan-500",
    pink: "text-pink-500 bg-pink-500",
  };

  return (
    <div
      className={`relative py-12 md:py-16 flex ${position === "right" ? "md:flex-row-reverse" : ""}`}
    >
      <div
        className={`flex-1 ${position === "right" ? "md:pl-20 md:text-right" : "md:pr-20"}`}
      >
        <div
          className={`flex items-center gap-3 mb-4 ${position === "right" ? "md:justify-end" : ""}`}
        >
          {position === "right" && comingSoon && (
            <Badge className="text-[10px] py-0 px-2 bg-violet-500/10 text-violet-400 border-violet-500/20">
              Coming Soon
            </Badge>
          )}
          <span className={`text-4xl font-bold ${colors[color].split(" ")[0]}`}>
            {number}
          </span>
          {position === "left" && comingSoon && (
            <Badge className="text-[10px] py-0 px-2 bg-violet-500/10 text-violet-400 border-violet-500/20">
              Coming Soon
            </Badge>
          )}
        </div>
        <h3 className="text-2xl md:text-3xl font-bold mb-3">{title}</h3>
        <p className="text-gray-500 max-w-md leading-relaxed">{description}</p>
      </div>

      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className={`w-4 h-4 rounded-full ${colors[color].split(" ")[1]}`}
        />
      </div>

      <div className="hidden md:block flex-1" />
    </div>
  );
}

function PricingRow({
  name,
  price,
  features,
  highlighted = false,
  badge,
  buttonText,
  buttonLink,
  comingSoon = false,
}: {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  buttonText?: string;
  buttonLink?: string;
  comingSoon?: boolean;
}) {
  return (
    <div
      className={`border-b border-gray-800 py-8 grid md:grid-cols-12 gap-6 items-center ${highlighted ? "bg-white/[0.015]" : ""} px-4 -mx-4 rounded-lg`}
    >
      <div className="md:col-span-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">{name}</span>
          {badge && (
            <Badge className="text-[10px] py-0 px-2 bg-violet-500 text-white border-0">
              {badge}
            </Badge>
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <span className="text-2xl font-bold">{price}</span>
      </div>

      <div className="md:col-span-5">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
          {features.map((f, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-violet-400" />
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="md:col-span-3 flex md:justify-end">
        {comingSoon ? (
          <Button
            disabled
            variant="outline"
            size="sm"
            className="rounded-full border-gray-800 text-gray-600"
          >
            <Clock className="h-3 w-3 mr-2" />
            Coming Soon
          </Button>
        ) : buttonLink ? (
          <Magnetic strength={0.3}>
            <Link href={buttonLink}>
              <Button
                size="sm"
                className="bg-white text-black hover:bg-white/90 rounded-full px-6"
              >
                {buttonText}
                <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </Link>
          </Magnetic>
        ) : null}
      </div>
    </div>
  );
}