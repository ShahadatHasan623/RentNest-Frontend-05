import { notFound } from "next/navigation";

import { getPropertyById } from "@/services/properties";
import EditPropertyForm from "@/_components/landlord/EditPropertyForm";

interface EditPropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditPropertyPage = async ({
  params,
}: EditPropertyPageProps) => {
  const { id } = await params;

  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Edit Property
        </h1>

        <p className="text-muted-foreground">
          Update your property information
        </p>
      </div>

      <EditPropertyForm
        property={property}
      />
    </div>
  );
};

export default EditPropertyPage;