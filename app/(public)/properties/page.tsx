import { getProperties } from "@/services/properties";
import Image from "next/image";

const HomePage = async () => {
  const properties = await getProperties();

  const featuredProperties =
    properties.slice(0, 6);

  return (
    <main className="container mx-auto px-4 py-10">

      <section className="mb-12">
        <h1 className="text-4xl font-bold">
          Find Your Perfect Rental Home
        </h1>

        <p className="mt-3 text-muted-foreground">
          Discover comfortable and affordable
          rental properties with RentNest.
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">
          Featured Properties
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {featuredProperties.map(
            (property) => (
              <div
                key={property.id}
                className="rounded-xl border p-5"
              >
                <Image
                unoptimized
                  src={property.images[0]}
                  alt={property.title}
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
                <h3 className="text-xl font-semibold">
                  {property.title}
                </h3>
                
                <p className="mt-2">
                  {property.location}
                </p>

                <p className="mt-2 font-bold">
                  ${property.rent}/month
                </p>
              </div>
            )
          )}

        </div>
      </section>

    </main>
  );
};

export default HomePage;