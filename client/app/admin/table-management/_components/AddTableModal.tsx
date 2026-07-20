import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "../../../../components/ui/Modal";
import Button from "../../../../components/ui/Button";

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, qrLogo?: File | null) => void;
  isPending?: boolean;
}

const schema = yup.object().shape({
  name: yup.string().required("Table name is required"),
  qrLogo: yup.mixed<File>().nullable(),
});

type FormData = yup.InferType<typeof schema>;

export default function AddTableModal({
  isOpen,
  onClose,
  onAdd,
  isPending = false,
}: AddTableModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      qrLogo: null,
    },
  });

  const qrLogo = watch("qrLogo");
  const qrLogoPreview = qrLogo ? URL.createObjectURL(qrLogo) : null;

  useEffect(() => {
    if (!isOpen) {
      reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    onClose();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue("qrLogo", e.target.files[0]);
    }
  };

  const removeLogo = () => {
    setValue("qrLogo", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data: FormData) => {
    onAdd(data.name, data.qrLogo);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Table"
      description="Create a new table to generate its unique QR code."
      size="md"
    >
      <form id="add-table-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2" encType="multipart/form-data" >
        <div>
          <label htmlFor="tableName" className="block text-sm font-medium text-gray-700 mb-1.5">
            Table Name or Number
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="tableName"
                placeholder="e.g. Table 5, VIP Area"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-cayenne-red-500 focus:ring-2 focus:ring-cayenne-red-100 outline-none transition-all`}
              />
            )}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            QR Code Logo (Optional)
          </label>
          {qrLogoPreview ? (
            <div className="relative inline-block group">
              <div className="relative h-28 w-28 rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                <Image
                  src={qrLogoPreview}
                  alt="QR Logo Preview"
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  <span className="text-white text-xs font-medium">Change</span>
                </div>
              </div>
              <Button
                variant="ghost"
                type="button"
                onClick={removeLogo}
                className="absolute -top-3 -right-3 flex !h-8 !w-8 items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all z-10 !p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-cayenne-red-500 hover:bg-cayenne-red-50 transition-colors"
            >
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload logo</span>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLogoUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </form>
      
      <div className="mt-8 flex justify-end gap-3">
        <Button variant="ghost" onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" form="add-table-form" disabled={isPending}>
          {isPending ? "Creating..." : "Create Table"}
        </Button>
      </div>
    </Modal>
  );
}
