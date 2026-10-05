import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Clock,
  CreditCard,
  FileText,
  Home,
  KeyRound,
  MapPin,
  Star,
  Wallet,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getRentalById } from "@/services/rentals";

interface RentalDetailsPageProps {
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

const STATUS_STYLES: Record<string, string> = {
  PENDING:
    "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  APPROVED:
    "border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  ACTIVE:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  COMPLETED:
    "border-violet-500/25 bg-violet-500/10 text-violet-600 dark:text-violet-400",
  REJECTED: "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
};

const StatusBadge = ({ status }: { status: string }) => (
  <Badge
    variant="outline"
    className={`gap-1 rounded-full px-3 py-1 text-xs font-medium ${
      STATUS_STYLES[status] ?? "border-border bg-muted text-muted-foreground"
    }`}
  >
    {STATUS_LABELS[status] ?? status}
  </Badge>
);

/* ---------- status stepper ---------- */

const TIMELINE_STEPS = [
  { key: "PENDING", label: "Requested", icon: FileText },
  { key: "APPROVED", label: "Approved", icon: CheckCircle2 },
  { key: "ACTIVE", label: "Active", icon: KeyRound },
  { key: "COMPLETED", label: "Completed", icon: Home },
];

const StatusTimeline = ({ status }: { status: string }) => {
  const currentIndex = TIMELINE_STEPS.findIndex(
    (step) => step.key === status,
  );

  return (
    <div className="flex items-start">
      {TIMELINE_STEPS.map((step, index) => {
        const Icon = step.icon;

        const isDone = currentIndex >= 0 && index < currentIndex;
        const isActive = currentIndex === index;

        return (
          <div key={step.key} className="flex flex-1 items-start last:flex-none">
            {/* step */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : isDone
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="size-4" />
              </div>

              <p
                className={`whitespace-nowrap text-[11px] font-medium ${
                  isActive
                    ? "text-foreground"
                    : isDone
                      ? "text-primary"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </p>
            </div>

            {/* connector */}
            {index < TIMELINE_STEPS.length - 1 && (
              <div
                className={`mt-5 h-0.5 flex-1 rounded-full ${
                  isDone || isActive ? "bg-primary/40" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ---------- main component ---------- */

const RentalDetailsPage = async ({ params }: RentalDetailsPageProps) => {
  const { id } = await params;

  const rental = await getRentalById(id);

  if (!rental) {
    notFound();
  }

  const image = rental.property?.images?.[0];

  const rent = Number(rental.property?.rent ?? 0);
  const duration = Number(rental.duration ?? 0);
  const totalCost = rent * duration;

  const isPaymentCompleted = rental.payment?.status === "COMPLETED";
  const needsPayment = rental.status === "APPROVED" && !isPaymentCompleted;
  const isRejected = rental.status === "REJECTED";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* ================= Back Link ================= */}
      <Link
        href="/dashboard/tenant/requests"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Requests
      </Link>

      {/* ================= Property Hero ================= */}
      <Card className="group overflow-hidden rounded-2xl border-border/70 py-0">
        <div className="flex flex-col sm:flex-row">
          {/* image */}
          <div className="relative h-44 shrink-0 overflow-hidden sm:h-auto sm:w-64">
            {image ? (
              <Image
                unoptimized
                src={image}
                alt={rental.property?.title || "Property"}
                fill
                sizes="(max-width: 640px) 100vw, 256px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <Home className="size-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* info */}
          <CardContent className="flex-1 space-y-3 p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="line-clamp-1 text-xl font-bold tracking-tight md:text-2xl">
                  Rental Request Details
                </h1>

                <p className="mt-1 line-clamp-1 flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                  {rental.property?.title || "Rental Property"}
                </p>
              </div>

              <StatusBadge status={rental.status} />
            </div>

            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              {rental.property?.location || "Location unavailable"}
            </p>

            <div className="flex items-end justify-between pt-1">
              <div>
                <p className="text-xs text-muted-foreground">Monthly Rent</p>

                <p className="text-2xl font-bold tracking-tight text-primary">
                  {formatCurrency(rent)}
                  <span className="text-sm font-medium text-muted-foreground">
                    /month
                  </span>
                </p>
              </div>

              {rental.payment && (
                <Badge
                  variant="outline"
                  className={`gap-1 rounded-full ${
                    isPaymentCompleted
                      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  <Wallet className="size-3" />
                  {isPaymentCompleted ? "Payment Complete" : "Payment Pending"}
                </Badge>
              )}
            </div>
          </CardContent>
        </div>
      </Card>

      {/* ================= Status Timeline ================= */}
      {isRejected ? (
        /* rejected notice */
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-5 py-4">
          <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />

          <div>
            <p className="font-semibold text-destructive">
              Request Rejected
            </p>

            <p className="mt-0.5 text-sm text-destructive/80">
              Unfortunately, your rental request was not approved. You can
              browse other properties and try again.
            </p>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="mt-3 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Link href="/properties">Browse Properties</Link>
            </Button>
          </div>
        </div>
      ) : (
        <Card className="rounded-2xl border-border/70 py-0">
          <CardContent className="p-6">
            <p className="mb-6 text-sm font-semibold">Request Progress</p>

            <StatusTimeline status={rental.status} />
          </CardContent>
        </Card>
      )}

      {/* ================= Details Grid ================= */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* rental info */}
        <Card className="rounded-2xl border-border/70 py-0">
          <CardContent className="space-y-5 p-6">
            <p className="text-sm font-semibold">Rental Information</p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CalendarDays className="size-4 text-primary" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Move-in Date</p>

                  <p className="text-sm font-semibold">
                    {formatDate(rental.moveInDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="size-4 text-primary" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>

                  <p className="text-sm font-semibold">
                    {rental.duration ?? "N/A"} months
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="size-4 text-primary" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Requested On</p>

                  <p className="text-sm font-semibold">
                    {formatDate(rental.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* cost summary */}
        <Card className="rounded-2xl border-border/70 py-0">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm font-semibold">Cost Summary</p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Monthly Rent
                </span>

                <span className="font-medium">
                  {formatCurrency(rent)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duration</span>

                <span className="font-medium">
                  {rental.duration ?? 0} months
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Amount</span>

                <span className="text-lg font-bold tracking-tight text-primary">
                  {formatCurrency(totalCost)}
                </span>
              </div>
            </div>

            {rental.payment && (
              <div
                className={`flex items-center justify-between rounded-xl border px-3.5 py-3 text-sm ${
                  isPaymentCompleted
                    ? "border-emerald-500/25 bg-emerald-500/10"
                    : "border-amber-500/25 bg-amber-500/10"
                }`}
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <CreditCard className="size-4" />
                  Payment Status
                </span>

                <span
                  className={`font-semibold ${
                    isPaymentCompleted
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {isPaymentCompleted ? "✓ Paid" : "Pending"}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ================= Actions ================= */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {needsPayment ? (
          <Button className="flex-1 gap-1.5" size="lg" asChild>
            <Link href={`/dashboard/tenant/requests/${rental.id}/pay`}>
              <CreditCard className="size-4" />
              Pay Now — {formatCurrency(totalCost)}
            </Link>
          </Button>
        ) : (
          isPaymentCompleted &&
          rental.propertyId && (
            <Button className="flex-1 gap-1.5" size="lg" variant="secondary" asChild>
              <Link href={`/dashboard/tenant/reviews/${rental.propertyId}`}>
                <Star className="size-4 fill-amber-400 text-amber-400" />
                Leave a Review
              </Link>
            </Button>
          )
        )}

        <Button
          asChild
          variant="outline"
          size="lg"
          className="flex-1 gap-1.5"
        >
          <Link href={`/properties/${rental.propertyId ?? ""}`}>
            View Property
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RentalDetailsPage;