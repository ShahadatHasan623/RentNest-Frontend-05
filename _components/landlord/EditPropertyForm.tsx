"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updatePropertyAction } from "@/app/dashboard/landlord/properties/_actions/propertyActions";
import { getCategoriesAction } from "@/app/dashboard/landlord/properties/_actions/getCategories";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import type { Property } from "@/types/property";

interface Category {
  id: string;
  name: string;
}

interface EditPropertyFormProps {
  property: Property;
}

const EditPropertyForm = ({
  property,
}: EditPropertyFormProps) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [form, setForm] = useState({
    title: property.title || "",
    description: property.description || "",
    location: property.location || "",
    address: property.address || "",
    city: property.city || "",
    area: property.area || "",
    rent: property.rent?.toString() || "",
    bedrooms: property.bedrooms?.toString() || "",
    bathrooms: property.bathrooms?.toString() || "",
    size: property.size?.toString() || "",
    categoryId: property.categoryId || "",
    amenities: property.amenities?.join(", ") || "",
    images: property.images?.join("\n") || "",
    available: property.available,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategoriesAction();

        setCategories(data);
      } catch (error) {
        console.error(
          "CATEGORY LOAD ERROR:",
          error
        );

        toast.error(
          "Failed to load categories"
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
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

        amenities: form.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        images: form.images
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        available: form.available,
      };

      console.log(
        "UPDATE PROPERTY PAYLOAD:",
        payload
      );

      const result =
        await updatePropertyAction(
          property.id,
          payload
        );

      if (!result?.success) {
        toast.error(
          result?.message ||
            "Failed to update property"
        );

        return;
      }

      toast.success(
        "Property updated successfully"
      );

      router.push(
        "/dashboard/landlord/properties"
      );

      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Edit Property Information
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {/* Title */}
            <Input
              name="title"
              placeholder="Property title"
              value={form.title}
              onChange={handleChange}
              required
            />

            {/* Category */}
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
              disabled={loadingCategories}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : "Select Category"}
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                )
              )}
            </select>

            {/* Location */}
            <Input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
            />

            {/* Address */}
            <Input
              name="address"
              placeholder="Full address"
              value={form.address}
              onChange={handleChange}
            />

            {/* City */}
            <Input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />

            {/* Area */}
            <Input
              name="area"
              placeholder="Area"
              value={form.area}
              onChange={handleChange}
            />

            {/* Rent */}
            <Input
              name="rent"
              type="number"
              placeholder="Monthly rent"
              value={form.rent}
              onChange={handleChange}
              required
            />

            {/* Size */}
            <Input
              name="size"
              type="number"
              placeholder="Size (sqft)"
              value={form.size}
              onChange={handleChange}
              required
            />

            {/* Bedrooms */}
            <Input
              name="bedrooms"
              type="number"
              placeholder="Bedrooms"
              value={form.bedrooms}
              onChange={handleChange}
            />

            {/* Bathrooms */}
            <Input
              name="bathrooms"
              type="number"
              placeholder="Bathrooms"
              value={form.bathrooms}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <Textarea
            name="description"
            placeholder="Property description"
            value={form.description}
            onChange={handleChange}
            rows={5}
          />

          {/* Amenities */}
          <Input
            name="amenities"
            placeholder="Amenities: WiFi, Parking, Lift"
            value={form.amenities}
            onChange={handleChange}
          />

          {/* Images */}
          <Textarea
            name="images"
            placeholder="Image URLs — one URL per line"
            value={form.images}
            onChange={handleChange}
            rows={4}
          />

          {/* Availability */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  available:
                    e.target.checked,
                }))
              }
              className="h-4 w-4"
            />

            <span className="text-sm">
              Property is available
            </span>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={
              isPending ||
              loadingCategories
            }
            className="w-full"
          >
            {isPending
              ? "Updating..."
              : "Update Property"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditPropertyForm;