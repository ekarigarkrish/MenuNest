"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { type ColorTheme } from "@/hooks/useColorTheme";

interface ColorThemePickerProps {
  themes: ColorTheme[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ColorThemePicker({
  themes,
  selectedId,
  onSelect,
}: ColorThemePickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {themes.map((theme) => {
        const isSelected = selectedId === theme.id;

        return (
          <motion.button
            key={theme.id}
            id={`theme-${theme.id}`}
            type="button"
            onClick={() => onSelect(theme.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`relative group flex flex-col items-start gap-2.5 p-3.5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer focus:outline-none ${
              isSelected
                ? "border-current shadow-md ring-2 ring-offset-1"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white"
            }`}
            style={
              isSelected
                ? ({
                    borderColor: theme.swatch,
                    "--tw-ring-color": theme.swatch,
                    backgroundColor: `${theme.swatch}08`,
                  } as any)
                : {}
            }
            aria-label={`Select ${theme.name} theme`}
            aria-pressed={isSelected}
          >
            {/* Color swatch */}
            <div
              className="w-full h-10 rounded-lg shadow-sm flex-shrink-0 relative overflow-hidden"
              style={{ background: theme.gradient }}
            >
              {/* Shine overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />

              {/* Checkmark */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow">
                    <Check
                      className="w-3.5 h-3.5"
                      style={{ color: theme.swatch }}
                      strokeWidth={3}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Labels */}
            <div className="min-w-0 w-full">
              <p
                className={`text-sm font-semibold truncate transition-colors ${
                  isSelected ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {theme.name}
              </p>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {theme.description}
              </p>
            </div>

            {/* Active dot indicator */}
            {isSelected && (
              <div
                className="absolute top-2 right-2 w-2 h-2 rounded-full"
                style={{ backgroundColor: theme.swatch }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
