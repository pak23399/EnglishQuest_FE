import { FieldValues, UseFormReturn } from 'react-hook-form';

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

export interface ProccessDialogProps extends SimpleDialogProps {
  isProcessing: boolean;
  onProcess: () => void;
}

export interface FormDialogProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
  open: boolean;
  isProcessing: boolean;
  onClose: () => void;
  onProcess: (schema: T) => void;
}
