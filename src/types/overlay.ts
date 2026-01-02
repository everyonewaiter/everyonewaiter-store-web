export interface ModalProps {
  isOpen: boolean;
  close: () => void;
}

export interface AlertProps {
  close: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}
