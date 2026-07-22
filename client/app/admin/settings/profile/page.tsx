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
        {/* Avatar Section */}
        <Section className="bg-white p-6 sm:p-8 rounded-2xl border border-carbon-black-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 transition-all hover:shadow-md">
          <div className="relative group shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-carbon-black-50 border-4 border-white shadow-md relative flex items-center justify-center">
              {previewUrl ? (
                 <Image src={previewUrl} alt="Avatar" fill className="object-cover" />
              ) : (
                 <UserCircle className="w-20 h-20 text-carbon-black-200" strokeWidth={1} />
              )}
              {/* Overlay */}
              <label className="absolute inset-0 bg-carbon-black-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <span className="text-white text-xs font-semibold tracking-wider uppercase">Change</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfileImage(e.target.files[0]);
                    }
                  }} 
                />
              </label>
            </div>
          </div>
          
          <div className="flex-1 text-center sm:text-left flex flex-col justify-center py-1">
            <h2 className="text-xl font-bold text-carbon-black-900 mb-1.5">Profile Picture</h2>
            <p className="text-carbon-black-500 text-sm leading-relaxed max-w-lg mb-4">
              Upload a picture to make your profile stand out. It will be used across the platform to identify you.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <label className="px-4 py-2 bg-white border border-carbon-black-200 rounded-lg text-sm font-semibold text-carbon-black-700 hover:bg-carbon-black-50 hover:text-carbon-black-900 transition-colors cursor-pointer shadow-sm">
                Upload New Image
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfileImage(e.target.files[0]);
                    }
                  }} 
                />
              </label>
              {previewUrl && (
                <Button 
                  type="button"
                  onClick={() => setProfileImage(null)}
                  className="text-sm font-medium text-red-500 transition-colors px-2 py-1"
                >
                  Remove Picture
                </Button>
              )}
            </div>
            <p className="text-xs text-carbon-black-400 font-medium mt-3 sm:mt-4">
              Recommended size: 256x256px. Max file size: 2MB.
            </p>
          </div>
        </Section>

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