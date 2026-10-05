"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Bath,
  BedDouble,
  Building2,
  ChevronDown,
  ImagePlus,
  Images,
  Info,
  Loader2,
  MapPin,
  Plus,
  Ruler,
  Sparkles,
  Trash2,
  Wallet,
  X,
} from "lucide-react";

import { createPropertyAction } from "@/app/dashboard/landlord/properties/_actions/createProperty";
import { getCategoriesAction } from "@/app/dashboard/landlord/properties/_actions/getCategories";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface Category {
  id: string;
  name: string;
}

/* ---------- reusable field wrapper ---------- */

interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

const Field = ({ label, htmlFor, required, hint, children, className }: FieldProps) => (
  <div className={className}>
    <Label htmlFor={htmlFor} className="mb-1.5 block text-sm">
      {label}

      {required && <span className="ml-0.5 text-destructive">*</span>}
    </Label>

    {children}

    {hint && (
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    )}
  </div>
);

/* ---------- section header ---------- */

const SectionHeader = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
      <Icon className="size-4 text-primary" />
    </div>

    <div>
      <h3 className="text-sm font-semibold">{title}</h3>

      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </div>
);

/* ---------- main component ---------- */

const PropertyForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    address: "",
    city: "",
    area: "",
    rent: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    categoryId: "",
    available: true,
  });

  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState("");

  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategoriesAction();
        setCategories(data);
      } catch (error) {
        console.error("CATEGORY LOAD ERROR:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------- amenities chip handlers ---------- */

  const addAmenity = () => {
    const value = amenityInput.trim();

    if (!value) return;

    if (amenities.some((item) => item.toLowerCase() === value.toLowerCase())) {
      toast.info("This amenity is already added");
      return;
    }

    setAmenities((prev) => [...prev, value]);
    setAmenityInput("");
  };

  const removeAmenity = (value: string) => {
    setAmenities((prev) => prev.filter((item) => item !== value));
  };

  /* ---------- image handlers ---------- */

  const addImage = () => {
    const value = imageInput.trim();

    if (!value) return;

    if (images.includes(value)) {
      toast.info("This image is already added");
      return;
    }

    setImages((prev) => [...prev, value]);
    setImageInput("");
  };

  const removeImage = (value: string) => {
    setImages((prev) => prev.filter((item) => item !== value));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.categoryId) {
      toast.error("Please select a category");
      return;
    }

    startTransition(async () => {
      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        address: form.address,
        city: form.city,
        area: form.area,

        rent: Number(form.rent),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        size: Number(form.size),

        categoryId: form.categoryId,

        amenities,
        images,

        available: form.available,
      };

      console.log("CREATE PROPERTY PAYLOAD:", payload);

      const result = await createPropertyAction(payload);

      if (!result?.success) {
        toast.error(result?.message || "Failed to create property");
        return;
      }

      toast.success("Property created successfully");

      router.push("/dashboard/landlord/properties");
      router.refresh();
    });
  };

  const inputBase = "h-11 bg-background";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ================= Basic Information ================= */}
      <Card className="rounded-2xl border-border/70 py-0">
        <CardHeader className="border-b px-6 py-5">
          <SectionHeader
            icon={Info}
            title="Basic Information"
            description="Give your property a clear title and category"
          />
        </CardHeader>

        <CardContent className="space-y-5 p-6">
          <Field label="Property Title" htmlFor="title" required>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Spacious 2BHK Apartment in Dhanmondi"
              value={form.title}
              onChange={handleChange}
              className={inputBase}
              required
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Category" required>
              <div className="relative">
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                  disabled={loadingCategories}
                  className={`${inputBase} w-full cursor-pointer appearance-none rounded-md border border-input px-3 pr-9 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select category"}
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </Field>

            <Field label="Monthly Rent (৳)" htmlFor="rent" required>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                  ৳
                </span>

                <Input
                  id="rent"
                  name="rent"
                  type="number"
                  min="0"
                  placeholder="25,000"
                  value={form.rent}
                  onChange={handleChange}
                  className={`${inputBase} pl-8`}
                  required
                />
              </div>
            </Field>
          </div>

          <Field
            label="Description"
            htmlFor="description"
            hint="Describe the space, rules, nearby landmarks — tenants love details."
          >
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your property..."
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="resize-none bg-background"
            />
          </Field>
        </CardContent>
      </Card>

      {/* ================= Location ================= */}
      <Card className="rounded-2xl border-border/70 py-0">
        <CardHeader className="border-b px-6 py-5">
          <SectionHeader
            icon={MapPin}
            title="Location"
            description="Where is your property located?"
          />
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="City">
              <Input
                name="city"
                placeholder="e.g. Dhaka"
                value={form.city}
                onChange={handleChange}
                className={inputBase}
              />
            </Field>

            <Field label="Area">
              <Input
                name="area"
                placeholder="e.g. Dhanmondi"
                value={form.area}
                onChange={handleChange}
                className={inputBase}
              />
            </Field>

            <Field label="Location (short)">
              <Input
                name="location"
                placeholder="e.g. Dhanmondi, Dhaka"
                value={form.location}
                onChange={handleChange}
                className={inputBase}
              />
            </Field>

            <Field label="Full Address">
              <Input
                name="address"
                placeholder="House, road, floor..."
                value={form.address}
                onChange={handleChange}
                className={inputBase}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* ================= Property Details ================= */}
      <Card className="rounded-2xl border-border/70 py-0">
        <CardHeader className="border-b px-6 py-5">
          <SectionHeader
            icon={Building2}
            title="Property Details"
            description="Rooms, bathrooms and size"
          />
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Bedrooms">
              <div className="relative">
                <BedDouble className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  name="bedrooms"
                  type="number"
                  min="0"
                  placeholder="2"
                  value={form.bedrooms}
                  onChange={handleChange}
                  className={`${inputBase} pl-9`}
                />
              </div>
            </Field>

            <Field label="Bathrooms">
              <div className="relative">
                <Bath className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  name="bathrooms"
                  type="number"
                  min="0"
                  placeholder="2"
                  value={form.bathrooms}
                  onChange={handleChange}
                  className={`${inputBase} pl-9`}
                />
              </div>
            </Field>

            <Field label="Size (sqft)">
              <div className="relative">
                <Ruler className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  name="size"
                  type="number"
                  min="0"
                  placeholder="1200"
                  value={form.size}
                  onChange={handleChange}
                  className={`${inputBase} pl-9`}
                  required
                />
              </div>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* ================= Amenities ================= */}
      <Card className="rounded-2xl border-border/70 py-0">
        <CardHeader className="border-b px-6 py-5">
          <SectionHeader
            icon={Sparkles}
            title="Amenities"
            description="Add facilities — press Enter or click Add after each one"
          />
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          <div className="flex gap-2">
            <Input
              placeholder="e.g. WiFi, Parking, Lift, Generator"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAmenity();
                }
              }}
              className={inputBase}
            />

            <Button
              type="button"
              onClick={addAmenity}
              className="h-11 shrink-0 gap-1.5"
            >
              <Plus className="size-4" />
              Add
            </Button>
          </div>

          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-muted/60 py-1.5 pl-3.5 pr-1.5 text-sm font-medium"
                >
                  {amenity}

                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Remove ${amenity}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= Images ================= */}
      <Card className="rounded-2xl border-border/70 py-0">
        <CardHeader className="border-b px-6 py-5">
          <SectionHeader
            icon={Images}
            title="Images"
            description="Paste image URLs — first image will be the cover photo"
          />
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/image.jpg"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImage();
                }
              }}
              className={inputBase}
            />

            <Button
              type="button"
              onClick={addImage}
              className="h-11 shrink-0 gap-1.5"
              disabled={!imageInput.trim()}
            >
              <ImagePlus className="size-4" />
              Add
            </Button>
          </div>

          {images.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {images.map((url, index) => (
                <div
                  key={url}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl border"
                >
                  <Image
                    unoptimized
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />

                  {/* remove button */}
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-red-500"
                    aria-label="Remove image"
                  >
                    <Trash2 className="size-3.5" />
                  </button>

                  {/* cover badge */}
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 rounded-xl border border-dashed bg-muted/30 px-4 py-8 text-center">
              <Images className="size-6 text-muted-foreground" />

              <p className="text-sm text-muted-foreground">
                No images added yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= Availability + Submit ================= */}
      <Card className="rounded-2xl border-border/70 py-0">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="available" className="text-sm font-semibold">
                Available for Rent
              </Label>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Turn off if this property is currently rented out
              </p>
            </div>

            <Switch
              id="available"
              checked={form.available}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, available: checked }))
              }
            />
          </div>

          <Separator />

          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <Button
              type="submit"
              disabled={isPending || loadingCategories}
              className="h-11 flex-1 gap-2 sm:flex-none sm:px-8"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Create Property
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 sm:flex-none"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default PropertyForm;