const EmptyProperties = () => {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">

      <div className="text-4xl">
        🏠
      </div>

      <h3 className="mt-4 text-lg font-semibold">
        No properties found
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        Try changing your search or filter options.
      </p>

    </div>
  );
};

export default EmptyProperties;