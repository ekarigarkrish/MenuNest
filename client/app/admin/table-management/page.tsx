"use client";

import React, { useState } from "react";
import { Plus, LayoutGrid } from "lucide-react";
import Button from "../../../components/ui/Button";
import Section from "../../../components/ui/Section";
import Container from "../../../components/ui/Container";
import { motion } from "framer-motion";
import TableCard from "./_components/TableCard";
import AddTableModal from "./_components/AddTableModal";
import EditTableModal from "./_components/EditTableModal";
import QrCodeModal from "./_components/QrCodeModal";
import DeleteTableModal from "./_components/DeleteTableModal";

export interface TableData {
  id: string;
  name: string;
  tableToken: string;
  capacity: number;
  qrLogoUrl?: string;
}

const mockTables: TableData[] = [
  { id: "1", name: "Table 1", tableToken: "tbl_9xj2ka0", capacity: 2 },
  { id: "2", name: "Table 2", tableToken: "tbl_4qm8vz1", capacity: 4 },
  { id: "3", name: "Table 3", tableToken: "tbl_7ps5ly3", capacity: 4 },
  { id: "4", name: "VIP 1", tableToken: "tbl_2nr6wt9", capacity: 8 },
];

export default function AdminTableMangementPage() {
  const [tables, setTables] = useState<TableData[]>(mockTables);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [tableToEdit, setTableToEdit] = useState<TableData | null>(null);
  const [tableToDelete, setTableToDelete] = useState<TableData | null>(null);

  const handleAddTable = (name: string, capacity: number, qrLogo?: File | null) => {
    const newTable: TableData = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      tableToken: `tbl_${Math.random().toString(36).substr(2, 9)}`,
      capacity: capacity,
      qrLogoUrl: qrLogo ? URL.createObjectURL(qrLogo) : undefined,
    };
    setTables([...tables, newTable]);
    setIsAddModalOpen(false);
  };

  const handleEditTable = (id: string, name: string, capacity: number, qrLogo?: File | null, removeLogo?: boolean) => {
    setTables(tables.map(t => {
      if (t.id === id) {
        let newLogoUrl = t.qrLogoUrl;
        if (qrLogo) {
          newLogoUrl = URL.createObjectURL(qrLogo);
        } else if (removeLogo) {
          newLogoUrl = undefined;
        }
        return { ...t, name, capacity, qrLogoUrl: newLogoUrl };
      }
      return t;
    }));
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setTables(tables.filter((t) => t.id !== id));
    setIsDeleteModalOpen(false);
    setTableToDelete(null);
  };

  const openEditModal = (table: TableData) => {
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
    <Section className="py-8 bg-gray-50 min-h-screen">
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
          <Button
            leftIcon={<Plus className="w-5 h-5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Table
          </Button>
        </div>

        {/* Table Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onOpenQrModal={openQrModal}
              onOpenEditModal={openEditModal}
              onConfirmDelete={confirmDelete}
            />
          ))}
        </div>

        {/* Empty State */}
        {tables.length === 0 && (
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
            <Button
              leftIcon={<Plus className="w-5 h-5" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Your First Table
            </Button>
          </motion.div>
        )}

        {/* Modals */}
        <AddTableModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddTable}
        />

        <EditTableModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          table={tableToEdit}
          onEdit={handleEditTable}
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
        />
      </Container>
    </Section>
  );
}