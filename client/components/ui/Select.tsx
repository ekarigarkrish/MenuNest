import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { useQuery } from "@tanstack/react-query";
import { Fetch } from "@/config/axios.config";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  api?: string;
  label?: React.ReactNode;
  error?: string;
  containerClassName?: string;
  className?: string;
  options?: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  api,
  label,
  error,
  containerClassName = "",
  className = "",
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search query to avoid spamming the API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: apiOptions = [], isLoading } = useQuery({
    queryKey: ["select-options", api, debouncedSearchQuery],
    queryFn: async () => {
      if (!api) return [];
      const res = await Fetch.get(api, { 
        params: { search: debouncedSearchQuery },
        withCredentials: true, 
        withXSRFToken: true 
      });
      
      return res.data?.categories?.map((item: any) => ({
        label: item.name || item.label || item.title,
        value: item.id || item.value,
      })) || [];
    },
    enabled: !!api,
  });

  const finalOptions = api ? apiOptions : options;
  const selectedOption = finalOptions.find((opt:any) => opt.value === value);
  
  const filteredOptions = api 
    ? finalOptions 
    : finalOptions.filter((option:any) => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened and clear search when closed
  useEffect(() => {
    if (isOpen) {
      // Small timeout to allow animation to start before focusing
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      // Clear search when closing
      setTimeout(() => setSearchQuery(""), 150); // delay clear to avoid flicker during exit animation
    }
  }, [isOpen]);

  return (
    <div className={`w-full ${containerClassName}`} ref={dropdownRef}>
      {label && (
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          onClick={() => !isOpen && setIsOpen(true)}
          className={`w-full h-auto px-4 py-2.5 bg-white border cursor-pointer flex items-center justify-between ${
            error
              ? "border-red-500 focus-within:ring-4 focus-within:ring-red-500/10 focus-within:border-red-500"
              : isOpen
              ? "border-cayenne-red-500 ring-4 ring-cayenne-red-500/10"
              : "border-gray-200 hover:border-gray-300"
          } rounded-xl text-sm outline-none transition-all shadow-sm ${className}`}
        >
          {isOpen ? (
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="font-medium text-left bg-transparent outline-none w-full text-gray-900 placeholder:text-gray-400"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking input
            />
          ) : (
            <span className={`font-medium text-left truncate ${!selectedOption ? "text-gray-400" : "text-gray-900"}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          )}
          <div onClick={(e) => {
              if (isOpen) {
                e.stopPropagation();
                setIsOpen(false);
              }
            }}
            className="cursor-pointer p-0.5 rounded-md hover:bg-gray-100 transition-colors ml-2 shrink-0"
          >
            <ChevronDown
              size={18}
              className={`text-gray-500 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-200/50 py-2 flex flex-col"
            >
              {/* Options List */}
              <div className="max-h-52 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {isLoading ? (
                  <div className="px-4 py-6 flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-xs font-medium">Loading options...</span>
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="px-4 py-4 text-sm text-gray-500 text-center">
                    No matching options found
                  </div>
                ) : (
                  filteredOptions.map((option:SelectOption) => (
                    <Button
                      key={option.value}
                      variant="ghost"
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-start group rounded-none ${
                        value === option.value
                          ? "bg-cayenne-red-50 text-cayenne-red-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{option.label}</span>
                      {value === option.value && (
                        <Check size={16} className="text-cayenne-red-500" />
                      )}
                    </Button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="text-sm text-red-500 mt-1.5 font-medium">{error}</p>}
    </div>
  );
};

export default React.memo(Select);