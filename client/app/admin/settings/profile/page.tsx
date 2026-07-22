"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Section from "@/components/ui/Section";
import { Save, Shield, UserCircle } from "lucide-react";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profileImage instanceof File) {
      const objectUrl = URL.createObjectURL(profileImage);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof profileImage === "string") {
      setPreviewUrl(profileImage);
    } else {
      setPreviewUrl(null);
    }
  }, [profileImage]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-carbon-black-900">Profile Settings</h1>
        <p className="text-carbon-black-500 mt-1">
          Manage your personal information and security preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">

        {/* Personal Information */}
        <Section className="space-y-4">
          <div className="flex items-center gap-3 mb-4 border-b border-carbon-black-100 pb-2">
            <h2 className="text-lg font-semibold text-carbon-black-900">Personal Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-carbon-black-700">First Name</label>
              <input
                type="text"
                defaultValue="Admin"
                className="w-full px-4 py-2.5 bg-white border border-carbon-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500 transition-colors shadow-sm"
                placeholder="Enter first name"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-carbon-black-700">Last Name</label>
              <input
                type="text"
                defaultValue="User"
                className="w-full px-4 py-2.5 bg-white border border-carbon-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500 transition-colors shadow-sm"
                placeholder="Enter last name"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-carbon-black-700">Email Address</label>
              <input
                type="email"
                defaultValue="admin@menunest.com"
                className="w-full px-4 py-2.5 bg-white border border-carbon-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500 transition-colors shadow-sm"
                placeholder="Enter email address"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-carbon-black-700">Phone Number</label>
              <input
                type="tel"
                className="w-full px-4 py-2.5 bg-white border border-carbon-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500 transition-colors shadow-sm"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </Section>

        {/* Security / Password */}
        <Section className="space-y-4">
          <div className="flex items-center gap-3 mb-4 border-b border-carbon-black-100 pb-2 mt-8">
            <Shield className="w-5 h-5 text-cayenne-red-500" />
            <h2 className="text-lg font-semibold text-carbon-black-900">Security</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-carbon-black-700">Current Password</label>
              <input
                type="password"
                className="w-full px-4 py-2.5 bg-white border border-carbon-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500 transition-colors shadow-sm"
                placeholder="••••••••"
              />
            </div>
            <div className="hidden md:block"></div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-carbon-black-700">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2.5 bg-white border border-carbon-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500 transition-colors shadow-sm"
                placeholder="New password"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-carbon-black-700">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2.5 bg-white border border-carbon-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500 transition-colors shadow-sm"
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </Section>

        <div className="flex justify-end pt-6 border-t border-carbon-black-100">
          <Button 
            type="submit" 
            isLoading={isLoading} 
            leftIcon={!isLoading && <Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}