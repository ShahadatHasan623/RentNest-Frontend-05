import { Suspense } from "react";
import PropertyFilters from "../_components/property/PropertyFilters";
import PropertiesContent from "../_components/property/PropertiesContent";




export default function PropertiesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Find Your Perfect Rental
          </h1>

          <p className="mt-2 text-muted-foreground">
            Browse available properties and find
            your next home.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filter */}

          <aside>
            <PropertyFilters />
          </aside>

          {/* Properties */}

          <section>
            <Suspense
              fallback={
                <p>Loading properties...</p>
              }
            >
              <PropertiesContent />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}