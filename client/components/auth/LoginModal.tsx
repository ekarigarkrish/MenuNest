"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Fetch } from "@/config/axios.config";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  })

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setShowPassword(false);
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
      toast.error(error.response?.data?.message || "An error occurred during login")
    }
  }

  const TitleComponent = (
    <div className="flex flex-col gap-1.5 pt-2">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-cayenne-red-600 to-orange-500 bg-clip-text text-transparent">
        Welcome Back
      </h2>
      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Sign in to access your MenuNest dashboard
      </p>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={TitleComponent}
      size="sm"
      className="dark:bg-carbon-black-900 border-none shadow-2xl overflow-hidden"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2 pb-2">
        <div className="space-y-1.5 relative">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1"
          >
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-cayenne-red-500 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-carbon-black-800 border rounded-xl outline-none transition-all duration-300 ${
                errors.email 
                  ? "border-red-500 focus:ring-4 focus:ring-red-500/20" 
                  : "border-gray-200 dark:border-carbon-black-700 focus:border-cayenne-red-500 focus:ring-4 focus:ring-cayenne-red-500/15 hover:border-gray-300 dark:hover:border-carbon-black-600"
              } text-gray-900 dark:text-white placeholder:text-gray-400`}
              placeholder="admin@menunest.com"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 font-medium ml-1 animate-fade-in-up">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5 relative">
          <div className="flex items-center justify-between ml-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-cayenne-red-500 transition-colors">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-carbon-black-800 border rounded-xl outline-none transition-all duration-300 ${
                errors.password 
                  ? "border-red-500 focus:ring-4 focus:ring-red-500/20" 
                  : "border-gray-200 dark:border-carbon-black-700 focus:border-cayenne-red-500 focus:ring-4 focus:ring-cayenne-red-500/15 hover:border-gray-300 dark:hover:border-carbon-black-600"
              } text-gray-900 dark:text-white placeholder:text-gray-400`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 font-medium ml-1 animate-fade-in-up">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full relative group overflow-hidden bg-gradient-to-r from-cayenne-red-600 to-orange-500 hover:from-cayenne-red-500 hover:to-orange-400 text-white font-medium !py-6 rounded-xl transition-all duration-300 shadow-lg shadow-cayenne-red-500/25 hover:shadow-cayenne-red-500/40"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          >
            Sign In
          </Button>
        </div>
      </form>
    </Modal>
  );
}