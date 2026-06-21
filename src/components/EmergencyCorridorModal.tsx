import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { ShieldAlert } from 'lucide-react';

interface EmergencyCorridorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const EmergencyCorridorModal: React.FC<EmergencyCorridorModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deactivate Corridor">
      <div className="flex flex-col items-center text-center py-2">
        <div className="w-12 h-12 rounded-full bg-accent-red-soft flex items-center justify-center mb-4">
          <ShieldAlert size={24} className="text-accent-red" />
        </div>
        <p className="text-sm text-text-secondary mb-6">
          Deactivating the corridor will restore all signal timing to normal. Are you sure you want to proceed?
        </p>
        <div className="flex gap-3 w-full">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={onConfirm} className="flex-1">Confirm Deactivate</Button>
        </div>
      </div>
    </Modal>
  );
};
