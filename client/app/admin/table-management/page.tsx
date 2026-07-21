"use client";

import { useState } from "react";
import { Plus, LayoutGrid, Layers } from "lucide-react";
import Button from "../../../components/ui/Button";
import Section from "../../../components/ui/Section";
import Container from "../../../components/ui/Container";
import { motion } from "framer-motion";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import TableCard from "./_components/TableCard";
import AddTableModal from "./_components/AddTableModal";
import BulkAddTableModal from "./_components/BulkAddTableModal";
import EditTableModal from "./_components/EditTableModal";
import QrCodeModal from "./_components/QrCodeModal";
import DeleteTableModal from "./_components/DeleteTableModal";
import { Fetch } from "@/config/axios.config";
export interface TableData {
  id: string;
  name: string;
  tableToken: string;
  qrLogo?: string
}

export default function AdminTableMangementPage() {
  const queryClient = useQueryClient();
  const { data: tables = [], isLoading } = useQuery<TableData[]>({
    queryKey: ['tables'],
    queryFn: async () => {
      const res = await Fetch.get('/api/table/all/data', { withCredentials: true, withXSRFToken: true });
      return res.data.data;
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [tableToEdit, setTableToEdit] = useState<TableData | null>(null);
  const [tableToDelete, setTableToDelete] = useState<TableData | null>(null);

  const addTableMutation = useMutation({
    mutationFn: async (data: { name: string; qrLogo?: File | null }) => {
      const formdata = new FormData();
      formdata.append('name', data.name);
      if (data.qrLogo) formdata.append('qrLogo', data.qrLogo);

      const res = await Fetch.post('/api/table/tb-qrcode', formdata, { withCredentials: true, withXSRFToken: true })
      return res.data;
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(['tables'], (old: TableData[] = []) => [
        ...old,
        { id: data.table?.id, name: data.table?.name, tableToken: data.table?.tableToken, qrLogo: `${data.table?.qrLogo}` }
      ]);
      setIsAddModalOpen(false);
      toast.success(data.message || "Table added successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add table");
    }
  });

  const bulkAddTableMutation = useMutation({
    mutationFn: async (data: { names: string[]; qrLogo?: File | null }) => {
      const formdata = new FormData();
      formdata.append('names', JSON.stringify(data.names));
      if (data.qrLogo) formdata.append('qrLogo', data.qrLogo);

      const res = await Fetch.post('/api/table/bulk-create', formdata, { withCredentials: true, withXSRFToken: true })
      return res.data;
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(['tables'], (old: TableData[] = []) => [
        ...old,
        ...(data.tables || [])
      ]);
      setIsBulkAddModalOpen(false);
      toast.success(data.message || "Tables added successfully");
      if (data.skipped?.length > 0) {
        toast.info(`${data.skipped.length} tables were skipped as they already exist.`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add tables");
    }
  });

  const editTableMutation = useMutation({
    mutationFn: async (data: { id: string; name: string; qrLogo?: File | null; removeLogo?: boolean }) => {
      const formdata = new FormData();
      formdata.append('name', data.name);
      if (data.removeLogo) formdata.append('removeLogo', 'true');
      if (data.qrLogo) formdata.append('qrLogo', data.qrLogo);

      const res = await Fetch.put(`/api/table/tb-qrcode/${data.id}`, formdata, { withCredentials: true, withXSRFToken: true });
      return res.data;
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(['tables'], (old: TableData[] = []) => old.map(t => {
        if (t.id === data.table?.id) {
          return { ...t, name: data.table.name, qrLogo: data.table.qrLogo };
        }
        return t;
      }));
      setIsEditModalOpen(false);
      toast.success(data.message || "Table updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update table");
    }
  });

  const handleAddTable = (name: string, qrLogo?: File | null) => {
    addTableMutation.mutate({ name, qrLogo });
  };

  const handleBulkAddTable = (count: number, qrLogo?: File | null) => {
    let maxNumber = 0;
    tables.forEach(t => {
      const match = t.name.match(/\d+/);
      if (match) maxNumber = Math.max(maxNumber, parseInt(match[0]));
    });

    const names = Array.from({ length: count }).map((_, i) => `Table ${maxNumber + i + 1}`);
    bulkAddTableMutation.mutate({ names, qrLogo });
  };

  const handleEditTable = (id: string, name: string, qrLogo?: File | null, removeLogo?: boolean) => {
    editTableMutation.mutate({ id, name, qrLogo, removeLogo });
  };

  const deleteTableMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await Fetch.delete(`/api/table/tb-qrcode/${id}`, { withCredentials: true, withXSRFToken: true });
      return res.data;
    },
    onSuccess: (data: any, id: string) => {
      queryClient.setQueryData(['tables'], (old: TableData[] = []) => old.filter((t) => t.id !== id));
      setIsDeleteModalOpen(false);
      setTableToDelete(null);
      toast.success(data.message || "Table deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete table");
    }
  });

  const handleDelete = (id: string) => {
    deleteTableMutation.mutate(id);
  };

  const openEditModal = async (table: TableData) => {
    setTableToEdit(table);
    setIsEditModalOpen(true);
  };

  const openQrModal = (table: TableData) => {
    setSelectedTable(table);
    setIsQrModalOpen(true);
  };

  const confirmDelete = (table: TableData) => {
    setTableToDelete(table);
    setIsDeleteModalOpen(true);
  };

  return (
    <Section className="py-8 bg-gray-50 rounded-2xl min-h-[calc(100vh-12rem)]">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-carbon-black-900 font-heading">
              Table Management
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Manage your restaurant tables and generate unique QR codes for ordering.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              leftIcon={<Layers className="w-5 h-5" />}
              onClick={() => setIsBulkAddModalOpen(true)}
              className="flex-1 md:flex-none"
            >
              Bulk Add
            </Button>
            <Button
              leftIcon={<Plus className="w-5 h-5" />}
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 md:flex-none"
            >
              Add New Table
            </Button>
          </div>
        </div>

        {/* Table Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16 w-full">
            <div className="w-8 h-8 border-4 border-cayenne-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tables?.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onOpenQrModal={openQrModal}
                onOpenEditModal={openEditModal}
                onConfirmDelete={confirmDelete}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && tables.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutGrid className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-carbon-black-900 mb-2">No tables found</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Get started by adding your first table. You can then generate QR codes for customers to scan and order.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                leftIcon={<Layers className="w-5 h-5" />}
                onClick={() => setIsBulkAddModalOpen(true)}
              >
                Bulk Add
              </Button>
              <Button
                leftIcon={<Plus className="w-5 h-5" />}
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Your First Table
              </Button>
            </div>
          </motion.div>
        )}

        {/* Modals */}
        <AddTableModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddTable}
          isPending={addTableMutation.isPending}
        />

        <BulkAddTableModal
          isOpen={isBulkAddModalOpen}
          onClose={() => setIsBulkAddModalOpen(false)}
          onAdd={handleBulkAddTable}
          isPending={bulkAddTableMutation.isPending}
        />

        <EditTableModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          table={tableToEdit}
          onEdit={handleEditTable}
          isPending={editTableMutation.isPending}
        />

        <QrCodeModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          table={selectedTable}
        />

        <DeleteTableModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          table={tableToDelete}
          onDelete={handleDelete}
          isPending={deleteTableMutation.isPending}
        />
      </Container>
    </Section>
  );
}