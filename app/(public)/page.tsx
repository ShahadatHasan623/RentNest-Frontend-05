import Link from "next/link";

import { getProperties } from "@/services/properties";
import HeroSection from "@/_components/public/HeroSection";
import PropertyGrid from "@/_components/public/PropertyGrid";

const HomePage = async () => {
  const properties = await getProperties();

  const featuredProperties = properties.slice(0, 6);

  return (
    <>
      <HeroSection />

      <section className="container mx-auto px-4 py-16">

        <div className="mb-8 flex items-end justify-between gap-4">

          <div>
            <p className="text-sm font-medium text-primary">
              EXPLORE
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              Featured Properties
            </h2>

            <p className="mt-2 text-muted-foreground">
              Explore some of our latest rental properties.
            </p>
          </div>

          <Link
            href="/properties"
            className="hidden text-sm font-medium text-primary hover:underline sm:block"
          >
            View all →
          </Link>

        </div>

        <PropertyGrid
          properties={featuredProperties}
        />

      </section>
    </>
  );
};

export default HomePage;