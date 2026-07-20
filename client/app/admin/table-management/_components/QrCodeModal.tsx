import React from "react";
import { QrCode } from "lucide-react";
import Modal from "../../../../components/ui/Modal";
import Button from "../../../../components/ui/Button";
import { TableData } from "../page";

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: TableData | null;
}

export default function QrCodeModal({
  isOpen,
  onClose,
  table,
}: QrCodeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`QR Code - ${table?.name}`}
      description="Print this QR code and place it on the table for customers."
      size="sm"
    >
      {table && (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-56 h-56 bg-white border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center mb-6 relative overflow-hidden group">
            <QrCode className="w-32 h-32 text-carbon-black-900 group-hover:scale-105 transition-transform duration-300" strokeWidth={1.5} />
            <div className="absolute inset-0 bg-gradient-to-tr from-cayenne-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          
          <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 text-center mb-6">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Table Token</div>
            <div className="font-mono text-sm text-carbon-black-800 break-all bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
              {table.tableToken}
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
            <Button className="flex-1">
              Download QR
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
