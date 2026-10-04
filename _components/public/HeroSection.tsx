import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Building2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

const STATS = [
  { value: "1,200+", label: "Properties Listed" },
  { value: "25+", label: "Cities Covered" },
  { value: "8,000+", label: "Happy Tenants" },
];

const POPULAR_CITIES = ["Dhaka", "Chattogram", "Sylhet", "Khulna"];

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: "Verified Listings" },
  { icon: Star, label: "4.9/5 Tenant Rating" },
  { icon: Building2, label: "Zero Brokerage" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b">
      {/* ---------- Background layers ---------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* soft gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent" />

        {/* grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />

        {/* glow */}
        <div className="absolute -top-48 left-1/2 h-[28rem] w-[56rem] max-w-full -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />
      </div>

      <div className="container relative mx-auto px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* ---------- Badge ---------- */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur">
            Find a place you can call home
          </div>

          {/* ---------- Heading ---------- */}
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            Find Your{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Perfect Rental Home
            </span>
          </h1>

          {/* ---------- Subtitle ---------- */}
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
            Discover comfortable, affordable and convenient rental properties
            with RentNest — verified listings, trusted landlords, zero hassle.
          </p>

          {/* ---------- Search bar ---------- */}
          <form
            action="/properties"
            className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border bg-background p-1.5 shadow-lg shadow-black/[0.04]"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 pl-4">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Search city, area or property..."
                className="h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
              />
            </div>
            <Button size="lg" type="submit" className="shrink-0 rounded-full px-6">
              Search
            </Button>
          </form>

          {/* ---------- Popular cities ---------- */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Popular:
            </span>
            {POPULAR_CITIES.map((city) => (
              <Link
                key={city}
                href={`/properties?city=${city.toLowerCase()}`}
                className="rounded-full border px-3 py-1 transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground"
              >
                {city}
              </Link>
            ))}
          </div>

          {/* ---------- CTAs ---------- */}
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="group">
              <Link href="/properties">
                Browse Properties
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/register">List Your Property</Link>
            </Button>
          </div>

          {/* ---------- Trust highlights ---------- */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </span>
            ))}
          </div>

          {/* ---------- Stats ---------- */}
          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4 border-t pt-10 sm:gap-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold tracking-tight md:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;