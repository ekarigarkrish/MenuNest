import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "../../../../components/ui/Modal";
import Button from "../../../../components/ui/Button";
import ImageUpload from "../../../../components/ui/ImageUpload";

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
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      qrLogo: null,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    onClose();
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
          <Controller
            name="qrLogo"
            control={control}
            render={({ field: { value, onChange } }) => (
              <ImageUpload value={value as string | File | null} onChange={onChange} />
            )}
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
