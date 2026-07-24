"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import { Save, Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { useProfile } from "../_hooks/useProfile";

// ─── Yup Schema ────────────────────────────────────────────────────────────────
const profileSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),

  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),

  currentPassword: yup.string().when("newPassword", {
    is: (val: string) => !!val,
    then: (s) => s.required("Current password is required to change password"),
    otherwise: (s) => s.optional(),
  }),

  newPassword: yup
    .string()
    .optional()
    .test("min-if-filled", "Password must be at least 6 characters", (val) =>
      val ? val.length >= 6 : true
    ),

  confirmPassword: yup
    .string()
    .optional()
    .oneOf([yup.ref("newPassword"), ""], "Passwords do not match"),
}).required();

type ProfileFormData = yup.InferType<typeof profileSchema>;

// ─── Password Input ─────────────────────────────────────────────────────────────
function PasswordInput({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  hasError,
}: {
  id: string;
  value: string;
  onChange: (...e: any[]) => void;
  onBlur: () => void;
  placeholder?: string;
  hasError?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete="off"
        placeholder={placeholder ?? "••••••••"}
        className={`w-full px-4 py-2.5 pr-11 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors shadow-sm ${
          hasError
            ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
            : "border-carbon-black-200 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500"
        }`}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 right-3 flex items-center text-carbon-black-400 hover:text-carbon-black-700 transition-colors"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { profile, isLoading, updateProfileMutation } = useProfile();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(profileSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Populate form once profile loads
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? "",
        email: profile.email ?? "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: ProfileFormData) => {
    const payload: Record<string, string> = {
      name: data.name,
      email: data.email,
    };

    if (data.newPassword) {
      payload.currentPassword = data.currentPassword ?? "";
      payload.newPassword = data.newPassword;
      payload.confirmPassword = data.confirmPassword ?? "";
    }

    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        reset({
          name: data.name,
          email: data.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      },
    });
  };

  const isSaving = updateProfileMutation.isPending;

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
        <h1 className="text-2xl font-bold text-carbon-black-900">Profile Settings</h1>
        <p className="text-carbon-black-500 mt-1">
          Manage your personal information and security preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* ── Personal Information ── */}
        <Section className="space-y-4">
          <div className="flex items-center gap-3 mb-4 border-b border-carbon-black-100 pb-2">
            <h2 className="text-lg font-semibold text-carbon-black-900">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="profile-name" className="text-sm font-medium text-carbon-black-700">
                Full Name
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="profile-name"
                    type="text"
                    placeholder="Enter your full name"
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

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="profile-email" className="text-sm font-medium text-carbon-black-700">
                Email Address
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="profile-email"
                    type="email"
                    placeholder="Enter email address"
                    className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors shadow-sm ${
                      errors.email
                        ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                        : "border-carbon-black-200 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500"
                    }`}
                  />
                )}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Role badge — read-only */}
            {profile?.role && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-carbon-black-700">Role</label>
                <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-cayenne-red-50 border border-cayenne-red-200 text-cayenne-red-700 text-sm font-medium capitalize">
                  {profile.role}
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* ── Change Password ── */}
        <Section className="space-y-4">
          <div className="flex items-center gap-3 mb-2 border-b border-carbon-black-100 pb-2">
            <Shield className="w-5 h-5 text-cayenne-red-500" />
            <h2 className="text-lg font-semibold text-carbon-black-900">Change Password</h2>
          </div>
          <p className="text-sm text-carbon-black-500">
            Leave blank if you don't want to change your password.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label htmlFor="current-password" className="text-sm font-medium text-carbon-black-700">
                Current Password
              </label>
              <Controller
                name="currentPassword"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    id="current-password"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Enter current password"
                    hasError={!!errors.currentPassword}
                  />
                )}
              />
              {errors.currentPassword && (
                <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="hidden md:block" />

            {/* New Password */}
            <div className="space-y-1.5">
              <label htmlFor="new-password" className="text-sm font-medium text-carbon-black-700">
                New Password
              </label>
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    id="new-password"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Min 6 characters"
                    hasError={!!errors.newPassword}
                  />
                )}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="text-sm font-medium text-carbon-black-700">
                Confirm New Password
              </label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    id="confirm-password"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Repeat new password"
                    hasError={!!errors.confirmPassword}
                  />
                )}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
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
    </div>
  );
}