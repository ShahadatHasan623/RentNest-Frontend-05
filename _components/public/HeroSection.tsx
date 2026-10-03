import Link from "next/link";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="border-b">
      <div className="container mx-auto px-4 py-20 md:py-28">

        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-4 inline-flex rounded-full border px-4 py-2 text-sm text-muted-foreground">
            🏠 Find a place you can call home
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Find Your
            <span className="text-primary">
              {" "}Perfect Rental Home
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Discover comfortable, affordable and
            convenient rental properties with RentNest.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
            >
              <Link href="/properties">
                Browse Properties
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
            >
              <Link href="/auth/register">
                List Your Property
              </Link>
            </Button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;