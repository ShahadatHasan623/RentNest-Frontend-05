import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Home,
  Lock,
  MapPin,
  Receipt,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getRentalById } from "@/services/rentals";

import PaymentButton from "@/_components/tenant/PaymentButton";

interface PaymentPageProps {
  params: Promise<{
    id: string;
  }>;
}

/* ---------- helpers ---------- */

const formatCurrency = (value: number | string | null | undefined) =>
  `৳${Number(value ?? 0).toLocaleString("en-US")}`;

const formatDate = (value?: string | Date | null) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/* ---------- main component ---------- */

const PaymentPage = async ({ params }: PaymentPageProps) => {
  const { id } = await params;

  const rental = await getRentalById(id);

  if (!rental) {
    notFound();
  }

  // Only approved requests can be paid
  if (rental.status !== "APPROVED") {
    redirect(`/dashboard/tenant/requests/${id}`);
  }

  const rent = Number(rental.property?.rent ?? 0);
  const duration = Number(rental.duration ?? 0);

  const isAlreadyPaid = rental.payment?.status === "COMPLETED";

  const image = rental.property?.images?.[0];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* ================= Back Link ================= */}
      <Link
        href={`/dashboard/tenant/requests/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Request
      </Link>

      {/* ================= Header ================= */}
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <CreditCard className="size-5 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Complete Payment
          </h1>

          <p className="text-sm text-muted-foreground">
            Confirm your details and pay securely to activate your rental.
          </p>
        </div>
      </div>

      {/* ================= Property Summary ================= */}
      <Card className="overflow-hidden rounded-2xl border-border/70 py-0">
        <div className="flex items-center gap-4 p-4">
          {/* thumbnail */}
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border sm:size-20">
            {image ? (
              <Image
                unoptimized
                src={image}
                alt={rental.property?.title || "Property"}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <Home className="size-6 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* info */}
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold tracking-tight">
              {rental.property?.title || "Rental Property"}
            </p>

            <p className="mt-0.5 flex items-center gap-1 truncate text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              {rental.property?.location || "Location unavailable"}
            </p>

            <div className="mt-1.5 flex items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-full border-blue-500/25 bg-blue-500/10 px-2.5 text-[11px] font-medium text-blue-600 dark:text-blue-400"
              >
                Approved
              </Badge>

              <Badge
                variant="secondary"
                className="rounded-full px-2.5 text-[11px] font-normal"
              >
                {duration} months
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* ================= Payment Summary (Receipt) ================= */}
      <Card className="overflow-hidden rounded-2xl border-border/70 py-0">
        {/* receipt header */}
        <div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Receipt className="size-4 text-muted-foreground" />

            <p className="text-sm font-semibold">Payment Summary</p>
          </div>

          <p className="text-xs text-muted-foreground">
            Request #{rental.id?.slice(0, 8) ?? id.slice(0, 8)}
          </p>
        </div>

        <CardContent className="space-y-5 p-6">
          {/* line items */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Wallet className="size-4 shrink-0" />
                Monthly Rent
              </span>

              <span className="font-medium">
                {formatCurrency(rent)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="size-4 shrink-0" />
                Move-in Date
              </span>

              <span className="font-medium">
                {formatDate(rental.moveInDate)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rental Duration</span>

              <span className="font-medium">
                {rental.duration ?? "N/A"} months
              </span>
            </div>
          </div>

          <Separator className="border-dashed" />

          {/* total */}
          <div className="flex items-end justify-between rounded-xl bg-muted/50 px-4 py-3.5">
            <div>
              <p className="text-sm font-medium">Amount Due</p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Initial rental payment
              </p>
            </div>

            <p className="text-3xl font-bold leading-none tracking-tight text-primary">
              {formatCurrency(rent)}
            </p>
          </div>

          {/* already paid notice */}
          {isAlreadyPaid ? (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3.5">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

              <div>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Payment already completed
                </p>

                <p className="mt-0.5 text-sm text-emerald-700/80 dark:text-emerald-400/80">
                  This rental has been paid. No further action is needed.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* secure notice */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="size-3.5" />
                Payments are secure and encrypted
              </div>

              {/* pay button */}
              <PaymentButton rentalRequestId={rental.id} />
            </>
          )}

          <Button asChild variant="outline" className="w-full">
            <Link href={`/dashboard/tenant/requests/${id}`}>
              Back to Request
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* ================= Trust Badges ================= */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: ShieldCheck, label: "Secure Payment" },
          { icon: CheckCircle2, label: "Instant Confirmation" },
          { icon: Wallet, label: "No Hidden Fees" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 rounded-xl border bg-muted/30 px-3 py-4 text-center"
          >
            <Icon className="size-4 text-primary" />

            <p className="text-[11px] font-medium leading-tight text-muted-foreground">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentPage;