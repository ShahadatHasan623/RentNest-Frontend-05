const PropertyDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  // getPropertyById(id)

  return <div>Property Details</div>;
};

export default PropertyDetailsPage;