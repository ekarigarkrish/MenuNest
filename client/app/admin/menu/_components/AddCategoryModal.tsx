import React, { useEffect, useState } from "react";
import Button from "../../../../components/ui/Button";
import Modal from "../../../../components/ui/Modal";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ImageUpload from "../../../../components/ui/ImageUpload";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null;
  onSave?: (data: any) => void;
  isPending?: boolean;
}

const schema = yup.object().shape({
  name: yup.string().required("Category name is required"),
  slug: yup.string().required("Slug is required").matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric and can contain hyphens"),
  desc: yup.string().optional(),
  image: yup.mixed<string | File>().nullable(),
  isVisible: yup.boolean().required().default(true),
});

export default React.memo(function AddCategoryModal({ isOpen, onClose, initialData, onSave, isPending = false }: AddCategoryModalProps) {
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      desc: "",
      image: null,
      isVisible: true,
    }
  });

  useEffect(() => {
    if (isOpen) {
      setIsSlugManuallyEdited(false);
      if (initialData) {
        reset({
          name: initialData.name || "",
          slug: initialData.slug || "",
          desc: initialData.desc || "",
          image: initialData.image || null,
          isVisible: initialData.isVisible ?? true,
        });
      } else {
        reset({ name: "", slug: "", desc: "", image: null, isVisible: true });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: any) => {
    if (onSave) {
      onSave(data);
    }
  };

  const isEdit = !!initialData;

  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      onClose={onClose}
      title={isEdit ? "Edit Menu Category" : "Create Menu Category"}
      description={isEdit ? "Update your category details." : "Organize your menu items efficiently."}
      footer={
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" type="button" className="rounded-xl w-full sm:w-auto border-gray-200 text-gray-700 hover:bg-gray-50" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="button" className="rounded-xl w-full sm:w-auto shadow-md shadow-cayenne-red-500/20 hover:shadow-lg hover:shadow-cayenne-red-500/30" onClick={handleSubmit(onSubmit)} isLoading={isPending}>
            {isEdit ? "Save Changes" : "Create Category"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Category Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  onChange={(e) => {
                    field.onChange(e);
                    if (!isSlugManuallyEdited) {
                      const generatedSlug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      setValue("slug", generatedSlug, { shouldValidate: true, shouldDirty: true });
                    }
                  }}
                  className={`w-full px-4 py-2.5 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl text-sm focus:ring-4 focus:ring-cayenne-red-500/10 focus:border-cayenne-red-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 shadow-sm`}
                  placeholder="e.g. Signature Cocktails"
                />
              )}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Slug</label>
            <Controller
              name="slug"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm font-medium">
                    /
                  </span>
                  <input
                    {...field}
                    type="text"
                    onChange={(e) => {
                      field.onChange(e);
                      setIsSlugManuallyEdited(true);
                    }}
                    className={`w-full pl-7 pr-4 py-2.5 bg-white border ${errors.slug ? 'border-red-500' : 'border-gray-200'} rounded-xl text-sm focus:ring-4 focus:ring-cayenne-red-500/10 focus:border-cayenne-red-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 shadow-sm`}
                    placeholder="signature-cocktails"
                  />
                </div>
              )}
            />
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Description <span className="text-gray-400 font-normal ml-1">(Optional)</span></label>
          <Controller
            name="desc"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-cayenne-red-500/10 focus:border-cayenne-red-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 shadow-sm resize-none"
                placeholder="A brief description of this category..."
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Cover Image <span className="text-gray-400 font-normal ml-1">(Optional)</span>
          </label>
          <Controller
            name="image"
            control={control}
            render={({ field: { value, onChange } }) => (
              <ImageUpload value={value} onChange={onChange} />
            )}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50/50">
          <div>
            <p className="font-semibold text-sm text-gray-900">Visibility</p>
            <p className="text-xs text-gray-500 mt-0.5">Show this category to customers</p>
          </div>

          <Controller
            name="isVisible"
            control={control}
            render={({ field: { value, onChange } }) => (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cayenne-red-500"></div>
              </label>
            )}
          />
        </div>
      </div>
    </Modal>
  );
})