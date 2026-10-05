import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Eye,
  Globe,
  Heart,
  Home,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/* ---------- data ---------- */

const STATS = [
  {
    value: "10,000+",
    label: "Active Users",
    icon: Users,
  },
  {
    value: "5,000+",
    label: "Listed Properties",
    icon: Building2,
  },
  {
    value: "64",
    label: "Districts Covered",
    icon: Globe,
  },
  {
    value: "4.8/5",
    label: "Average Rating",
    icon: Star,
  },
];

const FEATURES = [
  {
    icon: Search,
    title: "Smart Property Search",
    description:
      "Filter by location, budget, bedrooms and amenities to find a place that actually fits your life.",
  },
  {
    icon: ClipboardCheck,
    title: "Hassle-Free Requests",
    description:
      "Send rental requests in a few clicks and track approval status in real time — no phone tag, no agents.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Pay your rent through trusted payment providers with encrypted, transparent transactions.",
  },
  {
    icon: Eye,
    title: "Verified Listings",
    description:
      "Every property goes through moderation before going live, so what you see is what you get.",
  },
  {
    icon: MessageSquare,
    title: "Real Reviews",
    description:
      "Only verified tenants can leave reviews — honest feedback from people who actually lived there.",
  },
  {
    icon: Wallet,
    title: "Fair & Transparent",
    description:
      "No hidden fees, no broker commissions. Landlords list free and tenants pay exactly the rent.",
  },
];

const TENANT_STEPS = [
  {
    icon: Search,
    title: "Browse Properties",
    description:
      "Search thousands of verified listings across the country with detailed photos and information.",
  },
  {
    icon: ClipboardCheck,
    title: "Send a Request",
    description:
      "Found your match? Send a rental request with your move-in date and preferred duration.",
  },
  {
    icon: CreditCard,
    title: "Get Approved & Pay",
    description:
      "Once the landlord approves, complete your payment securely and get the keys.",
  },
  {
    icon: KeyRound,
    title: "Move In & Review",
    description:
      "Settle into your new home and share your experience to help future tenants.",
  },
];

const LANDLORD_STEPS = [
  {
    icon: Building2,
    title: "List Your Property",
    description:
      "Add photos, rent, amenities and location details — listing is completely free.",
  },
  {
    icon: MessageSquare,
    title: "Receive Requests",
    description:
      "Get notified when tenants apply and review their details from your dashboard.",
  },
  {
    icon: BadgeCheck,
    title: "Approve the Best Fit",
    description:
      "Accept or reject requests with a single click and manage everything in one place.",
  },
  {
    icon: Wallet,
    title: "Get Paid Securely",
    description:
      "Receive rent payments directly with full transaction tracking and records.",
  },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Trust First",
    description:
      "Verified listings, moderated content and real reviews — trust is our foundation.",
  },
  {
    icon: Heart,
    title: "User Obsessed",
    description:
      "Every feature starts with a simple question: does this make renting easier?",
  },
  {
    icon: Zap,
    title: "Keep It Simple",
    description:
      "Renting is complicated enough. Our platform is built to remove friction, not add it.",
  },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "No brokers" },
  { icon: Wallet, label: "No hidden fees" },
  { icon: Eye, label: "Verified listings" },
  { icon: Lock, label: "Secure payments" },
];

const CONTACTS = [
  {
    icon: Mail,
    label: "Email",
    value: "support@rentnest.com",
    href: "mailto:support@rentnest.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 1XXX-XXXXXX",
    href: "tel:+8801XXXXXXXXX",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Dhaka, Bangladesh",
    href: "#",
  },
];

/* ---------- small components ---------- */

const SectionHeading = ({
  badge,
  badgeIcon: BadgeIcon,
  title,
  description,
}: {
  badge: string;
  badgeIcon?: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="mx-auto max-w-2xl space-y-3 text-center">
    <Badge
      variant="secondary"
      className="gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium"
    >
      {BadgeIcon && <BadgeIcon className="size-3.5 text-primary" />}
      {badge}
    </Badge>

    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>

    <p className="text-muted-foreground">{description}</p>
  </div>
);

/* ---------- main component ---------- */

const AboutPage = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-8 text-primary-foreground md:p-14">
        <div className="relative z-10 mx-auto max-w-2xl space-y-5 text-center">
          <Badge className="gap-1.5 rounded-full border-transparent bg-white/15 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Home className="size-3.5" />
            About RentNest
          </Badge>

          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Finding your next home,
            <br />
            made simple.
          </h1>

          <p className="mx-auto max-w-xl text-sm leading-relaxed text-primary-foreground/85 md:text-base">
            RentNest is Bangladesh&apos;s modern rental marketplace —
            connecting tenants and landlords directly, with verified listings,
            secure payments and zero broker hassle.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button asChild variant="secondary" size="lg" className="gap-1.5">
              <Link href="/properties">
                <Search className="size-4" />
                Browse Properties
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="gap-1.5 border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <Link href="/dashboard">
                <Building2 className="size-4" />
                List Your Property
              </Link>
            </Button>
          </div>
        </div>

        {/* decorative circles */}
        <div className="pointer-events-none absolute -left-16 -top-20 size-64 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 size-72 rounded-full bg-white/10" />
      </section>

      {/* ================= Stats ================= */}
      <section className="mx-auto -mt-14 max-w-5xl px-4 md:px-0">
        <div className="grid gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-lg shadow-black/5 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>

                <p className="text-2xl font-bold tracking-tight">
                  {stat.value}
                </p>

                <p className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= Mission ================= */}
      <section className="mx-auto max-w-6xl px-4 md:px-0">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium"
            >
              <Target className="size-3.5 text-primary" />
              Our Mission
            </Badge>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Renting in Bangladesh,
              <br />
              <span className="text-primary">reimagined.</span>
            </h2>

            <p className="leading-relaxed text-muted-foreground">
              Finding a rental home has long meant endless phone calls, broker
              fees and guesswork. Landlords struggle to find reliable tenants,
              while tenants struggle to find honest listings.
            </p>

            <p className="leading-relaxed text-muted-foreground">
              RentNest changes that. We built a single platform where tenants
              discover verified homes, send requests directly, and pay securely
              — while landlords manage listings, applications and payments from
              one clean dashboard.
            </p>

            {/* trust badges with icons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <Badge
                  key={label}
                  variant="outline"
                  className="gap-1.5 rounded-full px-3 py-1.5 font-normal"
                >
                  <Icon className="size-3.5 text-primary" />
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          {/* mission cards */}
          <div className="grid gap-4">
            {[
              {
                icon: KeyRound,
                title: "For Tenants",
                description:
                  "A transparent way to find, request and rent your next home — with everything tracked in one place.",
              },
              {
                icon: Building2,
                title: "For Landlords",
                description:
                  "Free listings, qualified tenant requests and secure rent collection — without the middlemen.",
              },
              {
                icon: ShieldCheck,
                title: "For Everyone",
                description:
                  "A moderated, review-driven marketplace where trust is built in — not bolted on.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.title}
                  className="rounded-2xl border-border/70 py-0 transition-colors hover:border-primary/40"
                >
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>

                    <div>
                      <p className="font-semibold">{item.title}</p>

                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= Features ================= */}
      <section className="mx-auto max-w-6xl space-y-10 px-4 md:px-0">
        <SectionHeading
          badge="Why RentNest"
          badgeIcon={Sparkles}
          title="Everything you need, in one place"
          description="From discovery to move-in — we've built the tools that make renting effortless for both sides."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="group rounded-2xl border-border/70 py-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-black/5"
              >
                <CardContent className="space-y-3 p-6">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="font-semibold tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ================= How It Works ================= */}
      <section className="mx-auto max-w-6xl space-y-10 px-4 md:px-0">
        <SectionHeading
          badge="How It Works"
          badgeIcon={TrendingUp}
          title="From search to keys in 4 steps"
          description="Whether you're renting out or moving in — the process is simple."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* tenants */}
          <Card className="rounded-2xl border-border/70 py-0">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <KeyRound className="size-5" />
                </div>

                <h3 className="text-lg font-semibold">For Tenants</h3>
              </div>

              {TENANT_STEPS.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.title} className="flex gap-4">
                    {/* icon step */}
                    <div className="flex flex-col items-center">
                      <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-primary">
                        <Icon className="size-4" />

                        <span className="absolute -right-1 -top-1 flex size-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                          {index + 1}
                        </span>
                      </div>

                      {index < TENANT_STEPS.length - 1 && (
                        <div className="mt-1 w-px flex-1 bg-border" />
                      )}
                    </div>

                    <div className="pb-2">
                      <p className="font-semibold">{step.title}</p>

                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* landlords */}
          <Card className="rounded-2xl border-border/70 py-0">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="size-5" />
                </div>

                <h3 className="text-lg font-semibold">For Landlords</h3>
              </div>

              {LANDLORD_STEPS.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.title} className="flex gap-4">
                    {/* icon step */}
                    <div className="flex flex-col items-center">
                      <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-primary">
                        <Icon className="size-4" />

                        <span className="absolute -right-1 -top-1 flex size-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                          {index + 1}
                        </span>
                      </div>

                      {index < LANDLORD_STEPS.length - 1 && (
                        <div className="mt-1 w-px flex-1 bg-border" />
                      )}
                    </div>

                    <div className="pb-2">
                      <p className="font-semibold">{step.title}</p>

                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ================= Values ================= */}
      <section className="mx-auto max-w-6xl space-y-10 px-4 md:px-0">
        <SectionHeading
          badge="Our Values"
          badgeIcon={Heart}
          title="What we stand for"
          description="Three principles guide every decision we make."
        />

        <div className="grid gap-5 sm:grid-cols-3">
          {VALUES.map((value) => {
            const Icon = value.icon;

            return (
              <Card
                key={value.title}
                className="rounded-2xl border-border/70 py-0 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <CardContent className="space-y-3 p-6">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="font-semibold">{value.title}</h3>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ================= Contact Strip ================= */}
      <section className="mx-auto max-w-6xl space-y-10 px-4 md:px-0">
        <SectionHeading
          badge="Get in Touch"
          badgeIcon={Mail}
          title="Questions? We're here to help"
          description="Reach out to our team anytime — we usually respond within 24 hours."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {CONTACTS.map((contact) => {
            const Icon = contact.icon;

            return (
              <a
                key={contact.label}
                href={contact.href}
                className="group flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {contact.label}
                  </p>

                  <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
                    {contact.value}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-6xl px-4 md:px-0">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-8 text-center text-primary-foreground md:p-12">
          <div className="relative z-10 mx-auto max-w-xl space-y-5">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <KeyRound className="size-5" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Ready to find your nest?
            </h2>

            <p className="text-sm text-primary-foreground/85 md:text-base">
              Join thousands of tenants and landlords already using RentNest to
              make renting simple, safe and transparent.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 pt-1 sm:flex-row">
              <Button asChild variant="secondary" size="lg" className="gap-1.5">
                <Link href="/properties">
                  <Search className="size-4" />
                  Explore Properties
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                className="gap-1.5 border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Link href="/auth/register">
                  <Sparkles className="size-4" />
                  Create Free Account
                </Link>
              </Button>
            </div>
          </div>

          {/* decorative circles */}
          <div className="pointer-events-none absolute -left-12 -top-16 size-52 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-20 -right-14 size-60 rounded-full bg-white/10" />
        </div>
      </section>
    </div>
  );
};

export default AboutPage;