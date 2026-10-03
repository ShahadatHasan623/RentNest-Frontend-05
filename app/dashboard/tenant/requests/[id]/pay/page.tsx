
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getRentalById } from "@/services/rentals";

import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PaymentButton from "@/_components/tenant/PaymentButton";

interface PaymentPageProps {
   params: Promise<{
      id: string;
   }>;
}

const PaymentPage = async ({
   params,
}: PaymentPageProps) => {
   const { id } = await params;

   const rental = await getRentalById(id);

   if (!rental) {
      notFound();
   }

   // Only approved requests can be paid
   if (rental.status !== "APPROVED") {
      redirect(`/dashboard/tenant/requests/${id}`);
   }

   const rent = rental.property?.rent ?? 0;

   return (
      <div className="mx-auto max-w-2xl space-y-6 p-6">
         <div>
            <h1 className="text-2xl font-bold">
               Payment
            </h1>

            <p className="text-muted-foreground">
               Complete your rental payment.
            </p>
         </div>

         <Card>
            <CardHeader>
               <div className="flex items-center justify-between">
                  <CardTitle>
                     {rental.property?.title ||
                        "Rental Property"}
                  </CardTitle>

                  <Badge>
                     {rental.status}
                  </Badge>
               </div>
            </CardHeader>

            <CardContent className="space-y-5">
               <div className="flex justify-between border-b pb-3">
                  <span className="text-muted-foreground">
                     Monthly Rent
                  </span>

                  <span className="font-semibold">
                     ৳{rent}
                  </span>
               </div>

               <div className="flex justify-between border-b pb-3">
                  <span className="text-muted-foreground">
                     Duration
                  </span>

                  <span>
                     {rental.duration} months
                  </span>
               </div>

               <div className="flex justify-between border-b pb-3">
                  <span className="text-muted-foreground">
                     Move-in Date
                  </span>

                  <span>
                     {new Date(
                        rental.moveInDate
                     ).toLocaleDateString()}
                  </span>
               </div>

               <div className="rounded-lg border p-4">
                  <div className="flex justify-between">
                     <span className="font-medium">
                        Payment Amount
                     </span>

                     <span className="text-xl font-bold">
                        ৳{rent}
                     </span>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                     Initial rental payment
                  </p>
               </div>

               <PaymentButton
                  rentalRequestId={rental.id}
               />

               <Button
                  asChild
                  variant="outline"
                  className="w-full"
               >
                  <Link
                     href={`/dashboard/tenant/requests/${id}`}
                  >
                     Back to Request
                  </Link>
               </Button>
            </CardContent>
         </Card>
      </div>
   );
};

export default PaymentPage;
