import React, { useEffect } from "react";
import { Hash } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "../../../../components/ui/Modal";
import Button from "../../../../components/ui/Button";

interface BulkAddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (count: number) => void;
  isPending?: boolean;
}

const schema = yup.object().shape({
  count: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Number of tables is required")
    .min(1, "Minimum is 1")
    .max(100, "Maximum is 100"),
});

type FormData = yup.InferType<typeof schema>;

export default function BulkAddTableModal({ isOpen, onClose, onAdd, isPending = false }: BulkAddTableModalProps) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      count: 5,
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
    onAdd(data.count);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Bulk Add Tables"
      description="Quickly create multiple tables at once."
      size="md"
    >
      <form id="bulk-add-table-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
        <div>
          <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-1.5">
            How many tables do you want to create?
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Hash className="h-5 w-5 text-gray-400" />
            </div>
            <Controller
              name="count"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  id="count"
                  min="1"
                  max="100"
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  className={`w-full pl-11 pr-4 py-2.5 rounded-xl border ${errors.count ? 'border-red-500' : 'border-gray-200'} focus:border-cayenne-red-500 focus:ring-2 focus:ring-cayenne-red-100 outline-none transition-all`}
                />
              )}
            />
          </div>
          {errors.count && <p className="mt-1 text-sm text-red-500">{errors.count.message}</p>}
        </div>
      </form>

      <div className="mt-8 flex justify-end gap-3">
        <Button variant="ghost" onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" form="bulk-add-table-form" disabled={isPending}>
          {isPending ? "Creating..." : "Create Tables"}
        </Button>
      </div>
    </Modal>
  );
}