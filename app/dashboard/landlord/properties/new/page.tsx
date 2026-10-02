/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCreateProperty } from "@/src/hooks/useLandlordProperties";
import { useCategories } from "@/src/hooks/useCategories";




const propertySchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  location: z
    .string()
    .min(2, "Location is required"),

  address: z
    .string()
    .min(2, "Address is required"),

  city: z
    .string()
    .min(2, "City is required"),

  area: z
    .string()
    .min(2, "Area is required"),

  rent: z.coerce
    .number()
    .positive("Rent must be greater than 0"),

  size: z.coerce
    .number()
    .positive("Size must be greater than 0"),

  categoryId: z
    .string()
    .min(1, "Please select a category"),

  bedrooms: z.coerce
    .number()
    .int()
    .min(0)
    .optional(),

  bathrooms: z.coerce
    .number()
    .int()
    .min(0)
    .optional(),

  amenities: z.string().optional(),

  available: z.boolean(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

const CreatePropertyPage = () => {
  const router = useRouter();

  const createMutation = useCreateProperty();

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  const [images, setImages] = useState<string[]>([""]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),

    defaultValues: {
      title: "",
      description: "",
      location: "",
      address: "",
      city: "",
      area: "",
      rent: 0,
      size: 0,
      categoryId: "",
      bedrooms: 0,
      bathrooms: 0,
      amenities: "",
      available: true,
    },
  });

  const available = watch("available");

  const addImageField = () => {
    setImages((prev) => [...prev, ""]);
  };

  const removeImageField = (index: number) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const updateImage = (
    index: number,
    value: string
  ) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const onSubmit = (values: PropertyFormValues) => {
    const imageUrls = images
      .map((image) => image.trim())
      .filter(Boolean);

    if (imageUrls.length === 0) {
      toast.error("Please add at least one image URL");
      return;
    }

    if (!values.categoryId) {
      toast.error("Please select a category");
      return;
    }

    const amenities = values.amenities
      ? values.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    const payload = {
      title: values.title,
      description: values.description,
      location: values.location,
      address: values.address,
      city: values.city,
      area: values.area,

      rent: Number(values.rent),
      size: Number(values.size),

      categoryId: values.categoryId,

      bedrooms: Number(values.bedrooms),
      bathrooms: Number(values.bathrooms),

      amenities,

      images: imageUrls,

      available: values.available,
    };

    console.log("CREATE PROPERTY PAYLOAD:", payload);

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Property created successfully");

        router.push(
          "/dashboard/landlord/properties"
        );

        router.refresh();
      },

      onError: (error: any) => {
        console.error(
          "CREATE PROPERTY ERROR:",
          error?.response?.data || error
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to create property"
        );
      },
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Add New Property
        </h1>

        <p className="text-sm text-muted-foreground">
          Create a new rental property listing.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              Basic Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Property Title
              </Label>

              <Input
                id="title"
                placeholder="Modern 2 Bedroom Apartment"
                {...register("title")}
              />

              {errors.title && (
                <p className="text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description
              </Label>

              <Textarea
                id="description"
                placeholder="Describe your property..."
                rows={5}
                {...register("description")}
              />

              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">
                Location
              </Label>

              <Input
                id="location"
                placeholder="Dhanmondi, Dhaka"
                {...register("location")}
              />

              {errors.location && (
                <p className="text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">
                Address
              </Label>

              <Input
                id="address"
                placeholder="House 12, Road 5"
                {...register("address")}
              />

              {errors.address && (
                <p className="text-sm text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* City & Area */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">
                  City
                </Label>

                <Input
                  id="city"
                  placeholder="Dhaka"
                  {...register("city")}
                />

                {errors.city && (
                  <p className="text-sm text-red-500">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">
                  Area
                </Label>

                <Input
                  id="area"
                  placeholder="Dhanmondi"
                  {...register("area")}
                />

                {errors.area && (
                  <p className="text-sm text-red-500">
                    {errors.area.message}
                  </p>
                )}
              </div>
            </div>

            {/* Rent & Size */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rent">
                  Monthly Rent
                </Label>

                <Input
                  id="rent"
                  type="number"
                  placeholder="15000"
                  {...register("rent")}
                />

                {errors.rent && (
                  <p className="text-sm text-red-500">
                    {errors.rent.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">
                  Property Size (sq ft)
                </Label>

                <Input
                  id="size"
                  type="number"
                  placeholder="1200"
                  {...register("size")}
                />

                {errors.size && (
                  <p className="text-sm text-red-500">
                    {errors.size.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              Property Details
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5 md:grid-cols-3">
            {/* Category */}
            <div className="space-y-2">
              <Label>
                Category
              </Label>

              <Select
                value={watch("categoryId")}
                onValueChange={(value) =>
                  setValue("categoryId", value, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {categoriesLoading && (
                    <SelectItem
                      value="loading"
                      disabled
                    >
                      Loading categories...
                    </SelectItem>
                  )}

                  {categoriesError && (
                    <SelectItem
                      value="error"
                      disabled
                    >
                      Failed to load categories
                    </SelectItem>
                  )}

                  {!categoriesLoading &&
                    !categoriesError &&
                    categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {errors.categoryId && (
                <p className="text-sm text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* Bedrooms */}
            <div className="space-y-2">
              <Label htmlFor="bedrooms">
                Bedrooms
              </Label>

              <Input
                id="bedrooms"
                type="number"
                min="0"
                {...register("bedrooms")}
              />

              {errors.bedrooms && (
                <p className="text-sm text-red-500">
                  {errors.bedrooms.message}
                </p>
              )}
            </div>

            {/* Bathrooms */}
            <div className="space-y-2">
              <Label htmlFor="bathrooms">
                Bathrooms
              </Label>

              <Input
                id="bathrooms"
                type="number"
                min="0"
                {...register("bathrooms")}
              />

              {errors.bathrooms && (
                <p className="text-sm text-red-500">
                  {errors.bathrooms.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>
              Amenities
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Input
              placeholder="WiFi, Parking, AC, Lift, Security"
              {...register("amenities")}
            />

            <p className="mt-2 text-xs text-muted-foreground">
              Separate amenities with commas.
            </p>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Property Images
              </CardTitle>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImageField}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Image
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex gap-2"
              >
                <Input
                  placeholder="https://example.com/property.jpg"
                  value={image}
                  onChange={(event) =>
                    updateImage(
                      index,
                      event.target.value
                    )
                  }
                />

                {images.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      removeImageField(index)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader>
            <CardTitle>
              Availability
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">
                  Property Availability
                </p>

                <p className="text-sm text-muted-foreground">
                  {available
                    ? "Tenants can request this property."
                    : "This property is currently unavailable."}
                </p>
              </div>

              <Button
                type="button"
                variant={
                  available
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setValue(
                    "available",
                    !available
                  )
                }
              >
                {available
                  ? "Available"
                  : "Unavailable"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push(
                "/dashboard/landlord/properties"
              )
            }
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={
              createMutation.isPending ||
              categoriesLoading
            }
          >
            {createMutation.isPending
              ? "Creating..."
              : "Create Property"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePropertyPage;