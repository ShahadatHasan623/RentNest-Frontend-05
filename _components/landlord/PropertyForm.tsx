"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createPropertyAction } from "@/app/dashboard/landlord/properties/_actions/createProperty";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProperty } from "@/services/landlordProperties";

const PropertyForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
    amenities: "",
    images: "",
    available: true,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
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

      const result = await createPropertyAction(payload);

      if (!result?.success) {
        toast.error(
          result?.message || "Failed to create property"
        );
        return;
      }

      toast.success("Property created successfully");

      router.push("/dashboard/landlord/properties");
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Information</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="title"
              placeholder="Property title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <Input
              name="categoryId"
              placeholder="Category ID"
              value={form.categoryId}
              onChange={handleChange}
              required
            />

            <Input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
            />

            <Input
              name="address"
              placeholder="Full address"
              value={form.address}
              onChange={handleChange}
            />

            <Input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />

            <Input
              name="area"
              placeholder="Area"
              value={form.area}
              onChange={handleChange}
            />

            <Input
              name="rent"
              type="number"
              placeholder="Monthly rent"
              value={form.rent}
              onChange={handleChange}
              required
            />

            <Input
              name="size"
              type="number"
              placeholder="Size (sqft)"
              value={form.size}
              onChange={handleChange}
              required
            />

            <Input
              name="bedrooms"
              type="number"
              placeholder="Bedrooms"
              value={form.bedrooms}
              onChange={handleChange}
            />

            <Input
              name="bathrooms"
              type="number"
              placeholder="Bathrooms"
              value={form.bathrooms}
              onChange={handleChange}
            />
          </div>

          <Textarea
            name="description"
            placeholder="Property description"
            value={form.description}
            onChange={handleChange}
            rows={5}
          />

          <Input
            name="amenities"
            placeholder="Amenities: WiFi, Parking, Lift"
            value={form.amenities}
            onChange={handleChange}
          />

          <Textarea
            name="images"
            placeholder={`Image URLs — one URL per line`}
            value={form.images}
            onChange={handleChange}
            rows={4}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full"
          >
            {isPending
              ? "Creating..."
              : "Create Property"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyForm;