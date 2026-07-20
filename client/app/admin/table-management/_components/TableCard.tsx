import React from "react";
import { QrCode, Trash2, LayoutGrid, Users, Link, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../../../../components/ui/Button";
import { TableData } from "../page";

interface TableCardProps {
  table: TableData;
  onOpenQrModal: (table: TableData) => void;
  onOpenEditModal: (table: TableData) => void;
  onConfirmDelete: (table: TableData) => void;
}

export default function TableCard({
  table,
  onOpenQrModal,
  onOpenEditModal,
  onConfirmDelete,
}: TableCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col"
    >
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-cayenne-red-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cayenne-red-50 flex items-center justify-center text-cayenne-red-600">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-carbon-black-900">
              {table.name}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-3 mb-5 border border-gray-100 flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1.5 font-medium">
              <Link className="w-4 h-4" /> Token
            </span>
          </div>
          <span className="font-mono text-xs bg-white px-2 py-1.5 rounded-lg border border-gray-200 text-gray-700 break-all flex items-center justify-center">
            {table.tableToken}
          </span>
        </div>
      </div>
      <div className="flex flex-col 2xs:flex-row sm:flex-col md:flex-row items-stretch 2xs:items-center sm:items-stretch md:items-center gap-2 mt-auto">
        <Button 
          variant="primary" 
          size="sm" 
          className="flex-1 py-2 w-full 2xs:w-auto sm:w-full md:w-auto"
          leftIcon={<QrCode className="w-4 h-4" />}
          onClick={() => onOpenQrModal(table)}
        >
          QR Code
        </Button>
        <div className="flex items-center gap-2 w-full 2xs:w-auto sm:w-full md:w-auto justify-end">
          <Button 
            variant="secondary" 
            size="icon" 
            className="text-gray-500 hover:text-gray-700 flex-shrink-0 w-full 2xs:w-10 sm:w-full md:w-10 flex-1 2xs:flex-none sm:flex-1 md:flex-none"
            onClick={() => onOpenEditModal(table)}
            title="Edit Table"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 hover:text-red-600 hover:bg-red-50 flex-shrink-0 w-full 2xs:w-10 sm:w-full md:w-10 flex-1 2xs:flex-none sm:flex-1 md:flex-none"
            onClick={() => onConfirmDelete(table)}
            title="Delete Table"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
