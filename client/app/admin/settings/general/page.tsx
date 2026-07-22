"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Section from "@/components/ui/Section";
import { Store, Globe, Palette, Save } from "lucide-react";

export default function GeneralPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState("usd");
  const [timezone, setTimezone] = useState("utc");
  const [theme, setTheme] = useState("light");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  const currencyOptions = [
    { label: "USD ($)", value: "usd" },
    { label: "EUR (€)", value: "eur" },
    { label: "GBP (£)", value: "gbp" },
    { label: "INR (₹)", value: "inr" },
  ];

  const timezoneOptions = [
    { label: "UTC (Coordinated Universal Time)", value: "utc" },
    { label: "EST (Eastern Standard Time)", value: "est" },
    { label: "PST (Pacific Standard Time)", value: "pst" },
    { label: "IST (Indian Standard Time)", value: "ist" },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-carbon-black-900">General Settings</h1>
        <p className="text-carbon-black-500 mt-1">
          Manage your restaurant's global settings and application preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Restaurant Details */}
        <Section className="space-y-4">
          <div className="flex items-center gap-3 mb-4 border-b border-carbon-black-100 pb-2">
            <Store className="w-5 h-5 text-cayenne-red-500" />
            <h2 className="text-lg font-semibold text-carbon-black-900">Restaurant Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-carbon-black-700">Restaurant Name</label>
              <input
                type="text"
                defaultValue="MenuNest Central"
                className="w-full px-4 py-2.5 bg-white border border-carbon-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500 transition-colors shadow-sm"
                placeholder="Enter restaurant name"
              />
            </div>
            
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-carbon-black-700">Description</label>
              <textarea
                rows={3}
                defaultValue="Premium dining experience located in the heart of the city."
                className="w-full px-4 py-2.5 bg-white border border-carbon-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500 transition-colors shadow-sm resize-none"
                placeholder="Brief description of your restaurant"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-carbon-black-700">Contact Email</label>
              <input
                type="email"
                defaultValue="contact@menunest.com"
                className="w-full px-4 py-2.5 bg-white border border-carbon-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500 transition-colors shadow-sm"
                placeholder="contact@restaurant.com"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-carbon-black-700">Contact Phone</label>
              <input
                type="tel"
                defaultValue="+1 (555) 123-4567"
                className="w-full px-4 py-2.5 bg-white border border-carbon-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cayenne-red-500/20 focus:border-cayenne-red-500 transition-colors shadow-sm"
                placeholder="+1 (555) 000-0000"
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