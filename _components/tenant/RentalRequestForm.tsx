
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { createRentalRequestAction } from "@/app/(public)/properties/_actions/rentalRequest";



interface RentalRequestFormProps {
   propertyId: string;
}

const RentalRequestForm = ({
   propertyId,
}: RentalRequestFormProps) => {
   const router = useRouter();

   const [message, setMessage] = useState("");
   const [moveInDate, setMoveInDate] = useState("");
   const [duration, setDuration] = useState("");

   const [isPending, startTransition] = useTransition();

   const handleSubmit = (
      e: React.FormEvent<HTMLFormElement>
   ) => {
      e.preventDefault();

      if (!moveInDate) {
         toast.error("Please select move-in date");
         return;
      }

      if (!duration || Number(duration) <= 0) {
         toast.error("Please enter a valid duration");
         return;
      }

      if (!message.trim()) {
         toast.error("Please write a message");
         return;
      }

    

      startTransition(async () => {
         const result = await createRentalRequestAction(
            propertyId,
            moveInDate,
            Number(duration)
         );


         if (!result?.success) {
            toast.error(
               result?.message || "Failed to submit request"
            );
            return;
         }

         toast.success(
            "Rental request submitted successfully"
         );

         setMessage("");
         setMoveInDate("");
         setDuration("");

         router.refresh();
      });
   };

   return (
      <form
         onSubmit={handleSubmit}
         className="space-y-4"
      >
         {/* Move In Date */}
         <div className="space-y-2">
            <label className="text-sm font-medium">
               Move-in Date
            </label>

            <Input
               type="date"
               value={moveInDate}
               onChange={(e) =>
                  setMoveInDate(e.target.value)
               }
               disabled={isPending}
            />
         </div>

         {/* Duration */}
         <div className="space-y-2">
            <label className="text-sm font-medium">
               Duration (Months)
            </label>

            <Input
               type="number"
               min="1"
               placeholder="e.g. 12"
               value={duration}
               onChange={(e) =>
                  setDuration(e.target.value)
               }
               disabled={isPending}
            />
         </div>

         {/* Message */}
         <div className="space-y-2">
            <label className="text-sm font-medium">
               Message
            </label>

            <Textarea
               placeholder="Write a message to the landlord..."
               value={message}
               onChange={(e) =>
                  setMessage(e.target.value)
               }
               rows={5}
               disabled={isPending}
            />
         </div>

         <Button
            type="submit"
            className="w-full"
            disabled={isPending}
         >
            {isPending
               ? "Submitting..."
               : "Request to Rent"}
         </Button>
      </form>
   );
};

export default RentalRequestForm;
