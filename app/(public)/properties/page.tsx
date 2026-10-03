import PropertyFilters from "@/_components/public/PropertyFilters";
import PropertyGrid from "@/_components/public/PropertyGrid";
import { getProperties } from "@/services/properties";


interface PropertiesPageProps {
  searchParams: Promise<{
    search?: string;
    location?: string;
    propertyType?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

const PropertiesPage = async ({
  searchParams,
}: PropertiesPageProps) => {

  const params = await searchParams;

  const properties = await getProperties({
    search: params.search,
    location: params.location,
    propertyType: params.propertyType,

    minPrice: params.minPrice
      ? Number(params.minPrice)
      : undefined,

    maxPrice: params.maxPrice
      ? Number(params.maxPrice)
      : undefined,
  });

  return (
    <main className="container mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-10">

        <p className="text-sm font-medium text-primary">
          RENTNEST
        </p>

        <h1 className="mt-1 text-3xl font-bold md:text-4xl">
          Browse Properties
        </h1>

        <p className="mt-2 text-muted-foreground">
          Find a rental property that matches your needs.
        </p>

      </div>
<PropertyFilters />
      {/* Result */}
      <PropertyGrid
        properties={properties}
      />

    </main>
  );
};

export default PropertiesPage;