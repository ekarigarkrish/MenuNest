import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { useQuery } from "@tanstack/react-query";
import { Fetch } from "@/config/axios.config";

export interface SelectOption {
  label: string;
  value: string;
}

// ─── Single-select variant (existing behaviour, backward-compatible) ─────────
interface SelectSingleProps {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
  api?: string;
  label?: React.ReactNode;
  error?: string;
  containerClassName?: string;
  className?: string;
  options?: SelectOption[];
  placeholder?: string;
}

// ─── Multi-select variant (new) ──────────────────────────────────────────────
interface SelectMultiProps {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
  api?: string;
  label?: React.ReactNode;
  error?: string;
  containerClassName?: string;
  className?: string;
  options?: SelectOption[];
  placeholder?: string;
}

export type SelectProps = SelectSingleProps | SelectMultiProps;

const Select: React.FC<SelectProps> = (props) => {
  const {
    api,
    label,
    error,
    containerClassName = "",
    className = "",
    options = [],
    placeholder = "Select an option",
    multiple,
  } = props;

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
        withXSRFToken: true,
      });

      return (
        res.data?.categories?.map((item: any) => ({
          label: item.name || item.label || item.title,
          value: item.id || item.value,
        })) || []
      );
    },
    enabled: !!api,
  });

  const finalOptions: SelectOption[] = api ? apiOptions : options;

  const filteredOptions = api
    ? finalOptions
    : finalOptions.filter((option) =>
        option.label?.toLowerCase().includes(searchQuery?.toLowerCase())
      );

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const selectedValues: string[] = multiple
    ? (props.value as string[])
    : (props.value as string)
    ? [(props.value as string)]
    : [];

  const isSelected = (val: string) => selectedValues.includes(val);

  // Used by single-select to display the current label when closed
  const selectedOption = multiple
    ? null
    : finalOptions.find((opt) => opt.value === (props.value as string));

  // ─── Event handlers ──────────────────────────────────────────────────────────
  const handleOptionClick = (optionValue: string) => {
    if (multiple) {
      const current = props.value as string[];
      const next = isSelected(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue];
      (props.onChange as (v: string[]) => void)(next);
      // keep dropdown open for multi-select
    } else {
      (props.onChange as (v: string) => void)(optionValue);
      setIsOpen(false);
    }
  };

  const removeChip = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation();
    if (multiple) {
      const current = props.value as string[];
      (props.onChange as (v: string[]) => void)(
        current.filter((v) => v !== optionValue)
      );
    }
  };

  // ─── Outside click ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── Focus / clear search ────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      // Small timeout to allow animation to start before focusing
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      // Clear search when closing; delay to avoid flicker during exit animation
      setTimeout(() => setSearchQuery(""), 150);
    }
  }, [isOpen]);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className={`w-full ${containerClassName}`} ref={dropdownRef}>
      {label && (
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Trigger */}
        <div
          onClick={() => !isOpen && setIsOpen(true)}
          className={`w-full h-auto px-4 py-2.5 bg-white border cursor-pointer flex items-center justify-between gap-2 ${
            error
              ? "border-red-500 focus-within:ring-4 focus-within:ring-red-500/10 focus-within:border-red-500"
              : isOpen
              ? "border-cayenne-red-500 ring-4 ring-cayenne-red-500/10"
              : "border-gray-200 hover:border-gray-300"
          } rounded-xl text-sm outline-none transition-all shadow-sm ${className}`}
        >
          {/* Left side content */}
          <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
            {/* Multi-select chips (shown when closed) */}
            {multiple && !isOpen && selectedValues.length > 0 &&
              selectedValues.map((val) => {
                const opt = finalOptions.find((o) => o.value === val);
                return (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cayenne-red-50 text-cayenne-red-600 text-xs font-medium border border-cayenne-red-100"
                  >
                    {opt?.label ?? val}
                    <button
                      type="button"
                      onClick={(e) => removeChip(e, val)}
                      className="hover:text-cayenne-red-800 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                );
              })}

            {/* Search input (shown when open) */}
            {isOpen ? (
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="font-medium text-left bg-transparent outline-none flex-1 min-w-[80px] text-gray-900 placeholder:text-gray-400"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking input
              />
            ) : (
              /* Single-select display label / placeholder */
              !multiple && (
                <span
                  className={`font-medium text-left truncate ${
                    !selectedOption ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
              )
            )}

            {/* Multi-select placeholder when nothing selected and closed */}
            {multiple && !isOpen && selectedValues.length === 0 && (
              <span className="font-medium text-gray-400">{placeholder}</span>
            )}
          </div>

          {/* Chevron / close trigger */}
          <div
            onClick={(e) => {
              if (isOpen) {
                e.stopPropagation();
                setIsOpen(false);
              }
            }}
            className="cursor-pointer p-0.5 rounded-md hover:bg-gray-100 transition-colors shrink-0"
          >
            <ChevronDown
              size={18}
              className={`text-gray-500 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-200/50 py-2 flex flex-col"
            >
              {/* Multi-select: chips strip inside open dropdown */}
              {multiple && selectedValues.length > 0 && (
                <div className="px-3 pb-2 pt-1 flex flex-wrap gap-1.5 border-b border-gray-100">
                  {selectedValues.map((val) => {
                    const opt = finalOptions.find((o) => o.value === val);
                    return (
                      <span
                        key={val}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cayenne-red-50 text-cayenne-red-600 text-xs font-medium border border-cayenne-red-100"
                      >
                        {opt?.label ?? val}
                        <button
                          type="button"
                          onClick={(e) => removeChip(e, val)}
                          className="hover:text-cayenne-red-800 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Options list */}
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
                  filteredOptions.map((option: SelectOption) => {
                    const active = isSelected(option.value);
                    return (
                      <Button
                        key={option.value}
                        variant="ghost"
                        type="button"
                        onClick={() => handleOptionClick(option.value)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-start group rounded-none ${
                          active
                            ? "bg-cayenne-red-50 text-cayenne-red-600 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="flex-1">{option.label}</span>
                        {active && (
                          <Check size={16} className="text-cayenne-red-500 shrink-0" />
                        )}
                      </Button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1.5 font-medium">{error}</p>
      )}
    </div>
  );
};

export default React.memo(Select);