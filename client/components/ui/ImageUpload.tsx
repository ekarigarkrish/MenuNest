import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, X as XIcon } from "lucide-react";
import Button from "./Button";

interface ImageUploadProps {
  value?: string | File | null;
  onChange?: (file: File | null) => void;
  className?: string;
}

export default function ImageUpload({ value, onChange, className = "" }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof value === "string") {
      setPreviewUrl(value);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (onChange) onChange(file);
    
    // Reset file input value so selecting the same file again works
    e.target.value = "";
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onChange) onChange(null);
  };

  return (
    <div className={`relative ${className}`}>
      <input type="file" id="image-upload" accept="image/*" hidden onChange={handleFileChange} />
      <label htmlFor="image-upload" className="block cursor-pointer">
        {previewUrl ? (
          <div className="relative border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden group h-48 bg-gray-50 flex items-center justify-center">
            <Image src={previewUrl} alt="Preview" fill className="object-contain" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
              <span className="text-white font-medium">Click to change</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all group h-48">
            <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
              <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-cayenne-red-500 transition-colors" />
            </div>
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
              Click to upload cover image
            </span>
            <span className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 2MB</span>
          </div>
        )}
      </label>
    </div>
  );
}
