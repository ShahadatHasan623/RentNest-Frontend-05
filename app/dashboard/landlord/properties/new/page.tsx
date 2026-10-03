import PropertyForm from "@/_components/landlord/PropertyForm";


const NewPropertyPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Add New Property
        </h1>

        <p className="text-muted-foreground">
          Add your property information below.
        </p>
      </div>

      <PropertyForm />
    </div>
  );
};

export default NewPropertyPage;