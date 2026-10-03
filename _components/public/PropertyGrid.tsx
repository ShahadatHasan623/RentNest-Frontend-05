import { Property } from "@/types/property";
import PropertyCard from "./PropertyCard";
import EmptyProperties from "./EmptyProperties";


interface PropertyGridProps {
  properties: Property[];
}

const PropertyGrid = ({
  properties,
}: PropertyGridProps) => {

  if (!properties?.length) {
    return <EmptyProperties />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;