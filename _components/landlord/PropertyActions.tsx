"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
   deletePropertyAction,
   togglePropertyAvailabilityAction,
} from "@/app/dashboard/landlord/properties/_actions/propertyActions";

interface PropertyActionsProps {
   id: string;
   available: boolean;
}

const PropertyActions = ({
   id,
   available,
}: PropertyActionsProps) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const handleDelete = () => {
      const confirmed = window.confirm(
         "Are you sure you want to delete this property?"
      );

      if (!confirmed) return;

      startTransition(async () => {
         const result = await deletePropertyAction(id);

         if (!result?.success) {
            toast.error(
               result?.message || "Failed to delete property"
            );
            return;
         }

         toast.success("Property deleted successfully");
         router.refresh();
      });
   };

   const handleAvailability = () => {
      startTransition(async () => {
         const result =
            await togglePropertyAvailabilityAction(
               id,
               !available
            );

         if (!result?.success) {
            toast.error(
               result?.message ||
               "Failed to update availability"
            );
            return;
         }

         toast.success(
            !available
               ? "Property is now available"
               : "Property marked unavailable"
         );

         router.refresh();
      });
   };

   return (
      <div className="flex gap-2">
         <Button
            variant="outline"
            size="sm"
            onClick={handleAvailability}
            disabled={isPending}
         >
            {available ? "Unavailable" : "Available"}
         </Button>

         <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
         >
            Delete
         </Button>
         <Button
            variant="outline"
            size="sm"
            onClick={() =>
               router.push(
                  `/dashboard/landlord/properties/edit/${id}`
               )
            }
            disabled={isPending}
         >
            Edit
         </Button>
      </div>
   );
};

export default PropertyActions;