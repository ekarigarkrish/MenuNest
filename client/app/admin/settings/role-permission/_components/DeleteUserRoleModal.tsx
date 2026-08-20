import React from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
// import { UserRoleData } from "../page";

interface DeleteUserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: { id: string, name: string } | null;
  onDelete: (id: string) => void;
  isPending?: boolean;
}

export default function DeleteUserRoleModal({
  isOpen,
  onClose,
  userRole,
  onDelete,
  isPending = false,
}: DeleteUserRoleModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete User Role"
      size="sm"
    >
      <p className="my-2">
        {`Are you sure you want to delete ${userRole?.name}? This action cannot be undone.`}
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => { if (userRole) onDelete(userRole.id) }}
          isLoading={isPending}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}