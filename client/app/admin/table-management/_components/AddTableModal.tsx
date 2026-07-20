import React, { useState, useRef } from "react";
import { Users, Upload, X } from "lucide-react";
import Modal from "../../../../components/ui/Modal";
import Button from "../../../../components/ui/Button";

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, capacity: number, qrLogo?: File | null) => void;
}

export default function AddTableModal({
  isOpen,
  onClose,
  onAdd,
}: AddTableModalProps) {
  const [newTableName, setNewTableName] = useState("");
  const [newTableCapacity, setNewTableCapacity] = useState<number>(2);
  const [qrLogo, setQrLogo] = useState<File | null>(null);
  const [qrLogoPreview, setQrLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setNewTableName("");
    setNewTableCapacity(2);
    setQrLogo(null);
    setQrLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setQrLogo(file);
      setQrLogoPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setQrLogo(null);
    setQrLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newTableName, newTableCapacity, qrLogo);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Table"
      description="Create a new table to generate its unique QR code."
      size="md"
    >
      <form id="add-table-form" onSubmit={handleSubmit} className="space-y-5 mt-2">
        <div>
          <label htmlFor="tableName" className="block text-sm font-medium text-gray-700 mb-1.5">
            Table Name or Number
          </label>
          <input
            type="text"
            id="tableName"
            required
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            placeholder="e.g. Table 5, VIP Area"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cayenne-red-500 focus:ring-2 focus:ring-cayenne-red-100 outline-none transition-all"
          />
        </div>
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1.5">
            Seating Capacity
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="capacity"
              required
              min="1"
              max="100"
              value={newTableCapacity}
              onChange={(e) => setNewTableCapacity(parseInt(e.target.value) || 1)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-cayenne-red-500 focus:ring-2 focus:ring-cayenne-red-100 outline-none transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            QR Code Logo (Optional)
          </label>
          {qrLogoPreview ? (
            <div className="relative inline-block">
              <img src={qrLogoPreview} alt="QR Logo Preview" className="h-24 w-24 object-contain rounded-xl border border-gray-200 p-2" />
              <button
                type="button"
                onClick={removeLogo}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200 text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
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
        <Button variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit" form="add-table-form">
          Create Table
        </Button>
      </div>
    </Modal>
  );
}
