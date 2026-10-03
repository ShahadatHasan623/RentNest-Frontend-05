import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentCancelPage = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">
            Payment Cancelled
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your payment was cancelled. You can try again from your approved
            rental request.
          </p>

          <Button asChild className="w-full">
            <Link href="/dashboard/tenant/requests">
              Back to My Requests
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelPage;