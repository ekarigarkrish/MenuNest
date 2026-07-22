import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "../../../../components/ui/Modal";
import Button from "../../../../components/ui/Button";
import ImageUpload from "../../../../components/ui/ImageUpload";
import { TableData } from "../page";
import config from "@/config/config";

interface EditTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: TableData | null;
  onEdit: (id: string, name: string, qrLogo?: File | null, removeLogo?: boolean) => void;
  isPending?: boolean;
}

const schema = yup.object().shape({
  name: yup.string().required("Table name is required"),
  qrLogo: yup.mixed<File>().nullable(),
  isLogoRemoved: yup.boolean(),
});

type FormData = yup.InferType<typeof schema>;

export default function EditTableModal({
  isOpen,
  onClose,
  table,
  onEdit,
  isPending = false,
}: EditTableModalProps) {
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      qrLogo: null,
      isLogoRemoved: false,
    },
  });

  const isLogoRemoved = watch("isLogoRemoved");
  const qrLogo = watch("qrLogo");

  // Determine the current image value to display in the upload component
  const currentLogoValue = qrLogo 
    ? qrLogo 
    : (!isLogoRemoved && table?.qrLogo) 
      ? `${config.serverOrigin}/${table.qrLogo}` 
      : null;

  useEffect(() => {
    if (table && isOpen) {
      reset({
        name: table.name,
        qrLogo: null,
        isLogoRemoved: false,
      });
    }
  }, [table, isOpen, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: FormData) => {
    if (table) {
      onEdit(table.id, data.name, data.qrLogo, data.isLogoRemoved);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Table"
      description="Update table details."
      size="md"
    >
      <form id="edit-table-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
        <div>
          <label htmlFor="editTableName" className="block text-sm font-medium text-gray-700 mb-1.5">
            Table Name or Number
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="editTableName"
                placeholder="e.g. Table 5"
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
            render={({ field: { onChange } }) => (
              <ImageUpload 
                value={currentLogoValue as string | File | null} 
                onChange={(val) => {
                  onChange(val);
                  setValue("isLogoRemoved", val === null);
                }} 
              />
            )}
          />
        </div>
      </form>
      
      <div className="mt-8 flex justify-end gap-3">
        <Button variant="ghost" onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" form="edit-table-form" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Modal>
  );
}