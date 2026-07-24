"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import ImageUpload from "@/components/ui/ImageUpload";
import ColorThemePicker from "@/components/ui/ColorThemePicker";
import { Store, Save, Loader2, Palette } from "lucide-react";
import { useRestaurant } from "../_hooks/useRestaurant";
import { useColorTheme } from "@/hooks/useColorTheme";

// ─── Yup Schema ────────────────────────────────────────────────────────────────
const generalSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Restaurant name is required")
    .min(2, "Name must be at least 2 characters"),

  description: yup.string().trim().optional(),

  contactEmail: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .optional()
    .transform((v) => v || undefined),

  contactPhone: yup.string().trim().optional(),

  logo: yup.mixed<File | string>().nullable().optional(),

  removeLogo: yup.boolean().optional(),
}).required();

type GeneralFormData = yup.InferType<typeof generalSchema>;

// ─── Page ───────────────────────────────────────────────────────────────────────
export default function GeneralPage() {
  const { restaurant, isLoading, updateRestaurantMutation } = useRestaurant();
  const { themeId, currentTheme, setTheme, themes } = useColorTheme();

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(generalSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      description: "",
      contactEmail: "",
      contactPhone: "",
      logo: null,
      removeLogo: false,
    },
  });

  // Populate form once restaurant data loads
  useEffect(() => {
    if (restaurant) {
      reset({
        name: restaurant.name ?? "",
        description: restaurant.description ?? "",
        contactEmail: restaurant.contactEmail ?? "",
        contactPhone: restaurant.contactPhone ?? "",
        logo: restaurant.logo ?? null,
        removeLogo: false,
      });
    }
  }, [restaurant, reset]);

  const onSubmit = (data: GeneralFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description ?? "");
    formData.append("contactEmail", data.contactEmail ?? "");
    formData.append("contactPhone", data.contactPhone ?? "");

    if (data.logo instanceof File) {
      formData.append("logo", data.logo);
    } else if (data.removeLogo) {
      formData.append("removeLogo", "true");
    }

    updateRestaurantMutation.mutate(formData);
  };

  const isSaving = updateRestaurantMutation.isPending;

  if (isLoading) {
    return (
      <div className="max-w-5xl flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cayenne-red-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-carbon-black-900">General Settings</h1>
        <p className="text-carbon-black-500 mt-1">
          Manage your restaurant's global settings and application preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* ── Restaurant Details ── */}
        <Section className="space-y-4">
          <div className="flex items-center gap-3 mb-4 border-b border-carbon-black-100 pb-2">
            <Store className="w-5 h-5 text-cayenne-red-500" />
            <h2 className="text-lg font-semibold text-carbon-black-900">Restaurant Details</h2>
          </div>

          {/* Logo Upload */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-carbon-black-700">Restaurant Logo</label>
            <Controller
              name="logo"
              control={control}
              render={({ field: { value, onChange } }) => (
                <ImageUpload
                  value={value as File | string | null}
                  onChange={(file) => {
                    onChange(file);
                    // If user removed the logo, flag it
                    setValue("removeLogo", file === null);
                  }}
                  className="max-w-sm"
                />
              )}
            />
            <p className="text-xs text-carbon-black-400">PNG, JPG, JPEG up to 2MB</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Restaurant Name */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="restaurant-name" className="text-sm font-medium text-carbon-black-700">
                Restaurant Name
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="restaurant-name"
                    type="text"
                    placeholder="Enter restaurant name"
                    className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors shadow-sm ${
                      errors.name
                        ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                        : "border-carbon-black-200 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500"
                    }`}
                  />
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="restaurant-description" className="text-sm font-medium text-carbon-black-700">
                Description
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="restaurant-description"
                    rows={3}
                    placeholder="Brief description of your restaurant"
                    className="w-full px-4 py-2.5 bg-white border border-carbon-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500 transition-colors shadow-sm resize-none"
                  />
                )}
              />
            </div>

            {/* Contact Email */}
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-sm font-medium text-carbon-black-700">
                Contact Email
              </label>
              <Controller
                name="contactEmail"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="contact-email"
                    type="email"
                    placeholder="contact@restaurant.com"
                    className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors shadow-sm ${
                      errors.contactEmail
                        ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                        : "border-carbon-black-200 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500"
                    }`}
                  />
                )}
              />
              {errors.contactEmail && (
                <p className="text-sm text-red-500">{errors.contactEmail.message}</p>
              )}
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label htmlFor="contact-phone" className="text-sm font-medium text-carbon-black-700">
                Contact Phone
              </label>
              <Controller
                name="contactPhone"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="contact-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 bg-white border border-carbon-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500 transition-colors shadow-sm"
                  />
                )}
              />
            </div>

          </div>
        </Section>

        <div className="flex justify-end pt-6 border-t border-carbon-black-100">
          <Button
            type="submit"
            isLoading={isSaving}
            leftIcon={!isSaving && <Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </form>

      {/* ── Appearance / Color Theme ── */}
      <div className="mt-10">
        <Section className="space-y-5">
          <div className="flex items-start justify-between gap-4 border-b border-carbon-black-100 pb-4">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                style={{ backgroundColor: `${currentTheme.swatch}18` }}
              >
                <Palette className="w-5 h-5" style={{ color: currentTheme.swatch }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-carbon-black-900">Appearance</h2>
                <p className="text-sm text-carbon-black-400 mt-0.5">
                  Choose a color theme for the admin interface.
                </p>
              </div>
            </div>
            {/* Active theme badge */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 mt-1"
              style={{
                backgroundColor: `${currentTheme.swatch}15`,
                color: currentTheme.swatch,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentTheme.swatch }}
              />
              {currentTheme.name}
            </div>
          </div>

          <ColorThemePicker
            themes={themes}
            selectedId={themeId}
            onSelect={setTheme}
          />

          <p className="text-xs text-carbon-black-400">
            Theme changes apply instantly and are saved to your browser. No save required.
          </p>
        </Section>
      </div>
    </div>
  );
}