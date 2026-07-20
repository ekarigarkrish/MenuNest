import React, { useState, useEffect } from "react";
import { QrCode } from "lucide-react";
import Modal from "../../../../components/ui/Modal";
import Button from "../../../../components/ui/Button";
import { TableData } from "../page";
import { Fetch } from "@/config/axios.config";
import { toast } from "sonner";

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
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    const fetchPreview = async () => {
      if (!isOpen || !table) return;
      setIsLoadingPreview(true);
      try {
        const response = await Fetch.get(`/api/table/tb-qrcode/${table.id}`, {
          responseType: 'blob',
          withCredentials: true
        });
        objectUrl = window.URL.createObjectURL(new Blob([response.data]));
        setQrPreviewUrl(objectUrl);
      } catch (error) {
        console.error("Failed to load QR preview", error);
      } finally {
        setIsLoadingPreview(false);
      }
    };

    if (isOpen && table) {
      fetchPreview();
    } else {
      setQrPreviewUrl(null);
    }

    return () => {
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [isOpen, table]);

  const handleDownload = async () => {
    if (!table) return;
    
    try {
      setIsDownloading(true);
      if (qrPreviewUrl) {
        const link = document.createElement('a');
        link.href = qrPreviewUrl;
        link.setAttribute('download', `table-${table.tableToken}-qr.png`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        toast.success("QR Code downloaded successfully");
        return;
      }

      const response = await Fetch.get(`/api/table/tb-qrcode/${table.id}`, {
        responseType: 'blob',
        withCredentials: true
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `table-${table.tableToken}-qr.png`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("QR Code downloaded successfully");
    } catch (error) {
      console.error("Failed to download QR code", error);
      toast.error("Failed to download QR code");
    } finally {
      setIsDownloading(false);
    }
  };

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
            {isLoadingPreview ? (
              <div className="w-8 h-8 border-4 border-cayenne-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : qrPreviewUrl ? (
              <img src={qrPreviewUrl} alt={`QR Code for ${table.name}`} className="w-full h-full object-contain p-2" />
            ) : (
              <QrCode className="w-32 h-32 text-carbon-black-900 group-hover:scale-105 transition-transform duration-300" strokeWidth={1.5} />
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-cayenne-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          
          <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 text-center mb-6">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Table Token</div>
            <div className="font-mono text-sm text-carbon-black-800 break-all bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
              {table.tableToken}
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isDownloading}>
              Close
            </Button>
            <Button className="flex-1" onClick={handleDownload} isLoading={isDownloading}>
              Download QR
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
