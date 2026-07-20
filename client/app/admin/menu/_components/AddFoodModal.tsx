import React from "react";
import { Image as ImageIcon } from "lucide-react";
import Button from "../../../../components/ui/Button";
import Modal from "../../../../components/ui/Modal";

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFoodModal({ isOpen, onClose }: AddFoodModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Add Menu Item"
      description="Add a new delicious item to your menu."
      size="lg"
      footer={
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="rounded-xl w-full sm:w-auto border-gray-200 text-gray-700 hover:bg-gray-50" onClick={onClose}>
            Cancel
          </Button>
          <Button className="rounded-xl w-full sm:w-auto shadow-md shadow-cayenne-red-500/20 hover:shadow-lg hover:shadow-cayenne-red-500/30" onClick={onClose}>
            Save Item
          </Button>
        </div>
      }
    >
      <div className="space-y-6 py-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Image Upload Column */}
          <div className="col-span-1 space-y-2">
            <label className="text-sm font-semibold text-gray-700">Item Image</label>
            <div className="aspect-square border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all cursor-pointer group">
              <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-cayenne-red-500 transition-colors" />
              </div>
              <span className="text-sm font-medium text-gray-600 px-4 text-center group-hover:text-gray-900 transition-colors">
                Upload photo
              </span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
            </div>
          </div>

          {/* Fields Column */}
          <div className="col-span-1 md:col-span-2 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700">Item Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-cayenne-red-500/10 focus:border-cayenne-red-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 shadow-sm" 
                  placeholder="e.g. Sizzling Fajitas" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Price ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-gray-500">$</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-cayenne-red-500/10 focus:border-cayenne-red-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-semibold shadow-sm" 
                    placeholder="0.00" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Dietary Type</label>
                <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-cayenne-red-500/10 focus:border-cayenne-red-500 outline-none transition-all text-gray-900 appearance-none font-medium shadow-sm">
                  <option value="veg">Vegetarian (Veg)</option>
                  <option value="nonveg">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea 
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-cayenne-red-500/10 focus:border-cayenne-red-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none shadow-sm" 
                placeholder="Write an appetizing description of the dish..." 
                rows={3}
              ></textarea>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50/50">
              <div>
                <p className="font-semibold text-sm text-gray-900">Visibility</p>
                <p className="text-xs text-gray-500 mt-0.5">Show this item on the live menu</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cayenne-red-500"></div>
              </label>
            </div>

          </div>
        </div>
      </div>
    </Modal>
  );
}
