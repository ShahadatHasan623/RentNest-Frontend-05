import Link from "next/link";

import { Button } from "@/components/ui/button";
import PropertyList from "./_components/property/PropertyList";

;

export default function HomePage() {
  return (
    <main>
      {/* Hero */}

      <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-3xl">
            <p className="mb-4 font-medium text-primary">
              Welcome to RentNest
            </p>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Find a place you’ll love
              to call home.
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              Discover comfortable and affordable
              rental properties in your favorite
              locations.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/properties">
                  Explore Properties
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
              >
                <Link href="/auth/register">
                  List Your Property
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="font-medium text-primary">
                Featured
              </p>

              <h2 className="text-3xl font-bold">
                Featured Properties
              </h2>

              <p className="mt-2 text-muted-foreground">
                Explore some of our latest rental
                listings.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
            >
              <Link href="/properties">
                View All
              </Link>
            </Button>
          </div>

          <PropertyList/>
        </div>
      </section>

      {/* How it works */}

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold">
              How RentNest Works
            </h2>

            <p className="mt-3 text-muted-foreground">
              Renting your next home is simple.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Find a Property",
                text: "Search and filter properties based on your needs.",
              },
              {
                number: "02",
                title: "Send a Request",
                text: "Submit a rental request directly to the landlord.",
              },
              {
                number: "03",
                title: "Move In",
                text: "After approval, complete payment and start your rental.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-2xl border p-8"
              >
                <span className="text-4xl font-bold text-primary">
                  {item.number}
                </span>

                <h3 className="mt-5 text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-3 text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}