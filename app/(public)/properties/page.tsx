import { getProperties } from "@/services/properties";

const HomePage = async () => {
  const properties = await getProperties();

  const featuredProperties = properties.slice(0, 6);

  return (
    <main>
      <section>
        <h1>Find Your Perfect Rental Home</h1>
        <p>
          Discover comfortable and affordable properties with RentNest.
        </p>
      </section>

      <section>
        <h2>Featured Properties</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property) => (
            <div key={property.id}>
              {property.title}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;