import React from "react";
import Modal from "../../../../components/ui/Modal";
import Button from "../../../../components/ui/Button";
import { TableData } from "../page";

interface DeleteTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: TableData | null;
  onDelete: (id: string) => void;
}

export default function DeleteTableModal({
  isOpen,
  onClose,
  table,
  onDelete,
}: DeleteTableModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Table"
      size="sm"
    >
      <p className="my-2">
        {`Are you sure you want to delete ${table?.name}? This action cannot be undone.`}
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => {
          if (table) onDelete(table.id);
        }}>
          Delete Table
        </Button>
      </div>
    </Modal>
  );
}
