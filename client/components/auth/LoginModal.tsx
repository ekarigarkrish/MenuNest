"use client";

import React, { useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Fetch } from "@/config/axios.config";
import config from "@/config/config";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const loginSchema = yup.object({
  email: yup
    .string()
    .strict()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .strict()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
}).required();

type LoginFormData = yup.InferType<typeof loginSchema>;

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  })

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await Fetch.post('/api/auth/login', data)
      if(!res?.data?.success) return toast.error(res.data?.message)

      toast.success(res?.data?.message)
      switch (res.data.role) {
        case "admin":
          router.push('/admin')
          break;
        default:
          router.push('/')
          break;
      }
      onClose();
    } catch (error:any) {
      toast.error(error.response?.data?.message)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome Back"
      description="Sign in to your account to continue"
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-carbon-black-800 dark:text-white transition-colors ${
              errors.email 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300 dark:border-gray-700 focus:ring-cayenne-red-500"
            }`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-carbon-black-800 dark:text-white transition-colors ${
              errors.password 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300 dark:border-gray-700 focus:ring-cayenne-red-500"
            }`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
          )}
        </div>
        
        {/* <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <input type="checkbox" className="rounded text-cayenne-red-500 focus:ring-cayenne-red-500" />
            Remember me
          </label>
          <a href="#" className="text-cayenne-red-600 hover:text-cayenne-red-700 font-medium">
            Forgot password?
          </a>
        </div> */}

        <Button
          type="submit"
          className="w-full mt-6"
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </form>
    </Modal>
  );
}