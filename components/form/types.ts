import { ReactNode } from 'react';

export type FieldType = 'text' | 'number' | 'email' | 'password' | 'select' | 'switch' | 'date' | 'textarea' | 'file';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  col?: number;
  accept?: string;
} 