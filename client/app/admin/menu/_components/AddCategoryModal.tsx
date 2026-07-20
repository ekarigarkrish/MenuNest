import React, { useState, useEffect } from "react";
import { Image as ImageIcon } from "lucide-react";
import Button from "../../../../components/ui/Button";
import Modal from "../../../../components/ui/Modal";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null;
  onSave?: (data: any) => void;
}

export default function AddCategoryModal({ isOpen, onClose, initialData, onSave }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || "");
        setIsVisible(initialData.isVisible ?? true);
      } else {
        setName("");
        setIsVisible(true);
      }
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (onSave) {
      onSave({ name, isVisible });
    }
    onClose();
  };

  const isEdit = !!initialData;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={isEdit ? "Edit Menu Category" : "Create Menu Category"}
      description={isEdit ? "Update your category details." : "Organize your menu items efficiently."}
      footer={
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="rounded-xl w-full sm:w-auto border-gray-200 text-gray-700 hover:bg-gray-50" onClick={onClose}>
            Cancel
          </Button>
          <Button className="rounded-xl w-full sm:w-auto shadow-md shadow-cayenne-red-500/20 hover:shadow-lg hover:shadow-cayenne-red-500/30" onClick={handleSave}>
            {isEdit ? "Save Changes" : "Create Category"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 py-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Category Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-cayenne-red-500/10 focus:border-cayenne-red-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 shadow-sm" 
            placeholder="e.g. Signature Cocktails" 
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Cover Image <span className="text-gray-400 font-normal ml-1">(Optional)</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all cursor-pointer group">
            <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
              <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-cayenne-red-500 transition-colors" />
            </div>
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
              Click to upload cover image
            </span>
            <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50/50">
          <div>
            <p className="font-semibold text-sm text-gray-900">Visibility</p>
            <p className="text-xs text-gray-500 mt-0.5">Show this category to customers</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cayenne-red-500"></div>
          </label>
        </div>
      </div>
    </Modal>
  );
}
