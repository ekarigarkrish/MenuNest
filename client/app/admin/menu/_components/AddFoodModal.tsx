import React, { useEffect } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ImageUpload from "@/components/ui/ImageUpload";
import Select from "@/components/ui/Select";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Fetch } from "@/config/axios.config";
import { toast } from "sonner";

interface AddFoodModalProps {
  activeCategoryId: string;
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    slug: yup.string().required("Slug is required"),
    categoryId: yup.string().required("Category is required"),
    price: yup.number().required("Price is required").positive("Price must be positive"),
    discount: yup.number().min(0).max(100).optional(),
    discountPrice: yup.number().nullable().optional(),
    prepTime: yup.number().min(0).nullable().optional(),
    description: yup.string().nullable().optional(),
    isAvailable: yup.boolean().default(true),
    isFeatured: yup.boolean().default(false),
    isVegetarian: yup.boolean().default(false),
    image: yup.mixed<any>().nullable().optional(),
  });

type FormData = yup.InferType<typeof schema>;

// --- Helper Components ---
const ToggleField = ({ control, name, label, description, colorClass = "peer-checked:bg-cayenne-red-500" }: any) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium text-sm text-gray-900">{label}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={field.value}
            onChange={(e) => field.onChange(e.target.checked)}
          />
          <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${colorClass}`} />
        </label>
      )}
    />
  </div>
);

const InputField = ({ control, name, label, error, type = "text", placeholder, prefix, suffix, onChangeOverride, ...props }: any) => (
  <div className="space-y-2 w-full">
    {label && (
      <label className="text-sm font-semibold text-gray-700">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
    )}
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          <div className="relative">
            {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-gray-500">{prefix}</span>}
            <input
              type={type}
              {...field}
              {...props}
              value={field.value ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                const parsedVal = type === "number" ? parseFloat(val) : val;
                field.onChange(parsedVal);
                if (onChangeOverride) onChangeOverride(e, field);
              }}
              className={`w-full ${prefix ? "pl-8" : "px-4"} ${suffix ? "pr-8" : "pr-4"} py-2.5 ${props.readOnly ? "bg-gray-50/50 cursor-not-allowed" : "bg-white"
                } border ${error ? "border-red-500 focus:ring-red-500/10 focus:border-red-500" : "border-gray-200 focus:ring-cayenne-red-500/10 focus:border-cayenne-red-500"
                } rounded-xl text-sm outline-none transition-all text-gray-900 placeholder:text-gray-400 shadow-sm`}
              placeholder={placeholder}
            />
            {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-gray-500">{suffix}</span>}
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
        </>
      )}
    />
  </div>
);

export default React.memo(function AddFoodModal({ activeCategoryId, isOpen, onClose, initialData }: AddFoodModalProps) {
  const defaultValues :any = {
      name: "",
      slug: "",
      categoryId: activeCategoryId || "",
      price: undefined,
      discount: undefined,
      discountPrice: undefined,
      prepTime: undefined,
      description: "",
      isAvailable: true,
      isFeatured: false,
      isVegetarian: false,
      image: null,
    }
  const { control, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const price = watch("price");
  const discount = watch("discount");

  // Auto-calculate discount price
  useEffect(() => {
    if (price !== undefined && discount !== undefined && discount > 0 && discount <= 100) {
      setValue("discountPrice", parseFloat((price - price * (discount / 100)).toFixed(2)));
    } else if (price !== undefined && (!discount || discount === 0)) {
      setValue("discountPrice", 0);
    } else {
      setValue("discountPrice", undefined);
    }
  }, [price, discount, setValue]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name || "",
          slug: initialData.slug || "",
          categoryId: initialData.categoryId || activeCategoryId || "",
          price: initialData.price,
          discount: initialData.discount,
          discountPrice: initialData.discountPrice,
          prepTime: initialData.preparationTime,
          description: initialData.description || "",
          isAvailable: initialData.isAvailable ?? true,
          isFeatured: initialData.isFeatured ?? false,
          isVegetarian: initialData.isVeg ?? false,
          image: initialData.image || null,
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [isOpen, activeCategoryId, initialData, reset]);

  const queryClient = useQueryClient();

  const { mutate: createMenuItem, isPending: isCreating } = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new globalThis.FormData();
      const append = (k: string, v: any) => v !== undefined && v !== null && formData.append(k, typeof v === 'boolean' ? String(v) : v);

      append("name", data.name);
      append("slug", data.slug);
      append("categoryId", data.categoryId);
      append("price", data.price);
      append("discount", data.discount);
      append("discountPrice", data.discountPrice);
      append("preparationTime", data.prepTime);
      append("description", data.description);
      append("isAvailable", data.isAvailable);
      append("isFeatured", data.isFeatured);
      append("isVeg", data.isVegetarian);
      if (data.image instanceof File) {
        formData.append("image", data.image);
      } else if (!data.image && initialData?.image) {
        formData.append("removeImage", "true");
      }

      const res = initialData?.id
        ? await Fetch.put(`/api/menu/${initialData.id}`, formData, {
          withCredentials: true,
          withXSRFToken: true,
        })
        : await Fetch.post("/api/menu/create", formData, {
          withCredentials: true,
          withXSRFToken: true,
        });
      return res.data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success(data.message || `Item ${initialData ? 'updated' : 'created'} successfully!`);
      onClose();
      reset(defaultValues);
    },
    onError: (error: any) => {
      console.log(error);
      
      toast.error(error.response?.data?.message || `Unable to ${initialData ? 'update' : 'create'} item!`);
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Menu Item" : "Add Menu Item"}
      description={initialData ? "Update your menu item details." : "Create a new item based on your menu item model."}
      size="lg"
      footer={
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="rounded-xl w-full sm:w-auto border-gray-200 text-gray-700 hover:bg-gray-50" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" className="rounded-xl w-full sm:w-auto shadow-md shadow-cayenne-red-500/20 hover:shadow-lg hover:shadow-cayenne-red-500/30" onClick={handleSubmit((d) => createMenuItem(d))} isLoading={isCreating || isSubmitting}>
            Save Item
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit((d) => createMenuItem(d))} className="space-y-6 py-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Settings Column */}
          <div className="col-span-1 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">Item Image</label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <>
                    <ImageUpload value={field.value ?? null} onChange={field.onChange} />
                    {errors?.image && <p className="text-xs text-red-500">{errors.image?.message as string}</p>}
                  </>
                )}
              />
            </div>

            <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-200 space-y-5 shadow-sm">
              <h3 className="font-semibold text-sm text-gray-900">Item Settings</h3>
              <ToggleField control={control} name="isAvailable" label="Available" description="Show on live menu" />
              <ToggleField control={control} name="isFeatured" label="Featured" description="Highlight item" />
              <ToggleField control={control} name="isVegetarian" label="Vegetarian" description="Mark as veg" colorClass="peer-checked:bg-green-500" />
            </div>
          </div>

          {/* Fields Column */}
          <div className="col-span-1 md:col-span-2 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <InputField
                  control={control} name="name" label="Item Name" required error={errors.name} placeholder="e.g. Sizzling Fajitas"
                  onChangeOverride={(e: any, field: any) => {
                    const val = e.target.value;
                    setValue("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""), { shouldValidate: true });
                  }}
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <InputField control={control} name="slug" label="Slug" required error={errors.slug} placeholder="sizzling-fajitas" />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label={<>Category <span className="text-red-500">*</span></>}
                      api='/api/category/all' value={field.value} onChange={field.onChange}
                      error={errors.categoryId?.message as string} placeholder="Select Category"
                    />
                  )}
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <InputField type="number" min="0" control={control} name="prepTime" label="Prep Time (mins)" error={errors.prepTime} placeholder="e.g. 15" />
              </div>

              <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <InputField type="number" step="0.01" min="0" control={control} name="price" label="Price" required error={errors.price} prefix="₹" placeholder="0.00" />
                <InputField type="number" step="1" min="0" max="100" control={control} name="discount" label="Discount" error={errors.discount} suffix="%" placeholder="0" />
                <InputField type="number" step="0.01" min="0" control={control} name="discountPrice" label="Discount Price" error={errors.discountPrice} prefix="₹" placeholder="0.00" readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <>
                    <textarea
                      {...field} value={field.value ?? ""} rows={4}
                      className={`w-full px-4 py-3 bg-white border ${errors.description ? "border-red-500 focus:ring-red-500/10 focus:border-red-500" : "border-gray-200 focus:ring-cayenne-red-500/10 focus:border-cayenne-red-500"
                        } rounded-xl text-sm outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none shadow-sm`}
                      placeholder="Write an appetizing description of the dish..."
                    />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message as string}</p>}
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
})