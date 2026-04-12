import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within a Select');
  }
  return context;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, onOpenChange: setOpen }}>
      {children}
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

function SelectTrigger({ children, className = '' }: SelectTriggerProps) {
  const { open, onOpenChange } = useSelectContext();

  return (
    <button
      type="button"
      className={`w-full bg-slate-800/50 border border-blue-800/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-transparent transition-all flex items-center justify-between ${className}`}
      onClick={() => onOpenChange(!open)}
    >
      {children}
      <ChevronDown size={16} className="text-slate-400 flex-shrink-0 ml-2" />
    </button>
  );
}

interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

function SelectValue({ placeholder = 'Select...', className = '' }: SelectValueProps) {
  const { value } = useSelectContext();

  return (
    <span className={`truncate ${!value ? 'text-slate-500' : ''} ${className}`}>
      {value || placeholder}
    </span>
  );
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

function SelectContent({ children, className = '' }: SelectContentProps) {
  const { open, onOpenChange } = useSelectContext();
  const triggerRef = React.useRef<HTMLDivElement>(null);

  if (!open) return null;

  return (
    <div
      ref={triggerRef}
      className="relative z-50"
    >
      <div
        className={`absolute z-50 mt-2 w-full min-w-[8rem] overflow-hidden rounded-xl border border-blue-800/30 bg-[#0d1f47] shadow-2xl ${className}`}
      >
        <div className="p-1">
          {children}
        </div>
      </div>
      {/* Backdrop to close the select */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => onOpenChange(false)}
      />
    </div>
  );
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

function SelectItem({ value, children, className = '' }: SelectItemProps) {
  const { value: selectedValue, onValueChange, onOpenChange } = useSelectContext();

  const handleClick = () => {
    onValueChange(value);
    onOpenChange(false);
  };

  return (
    <button
      type="button"
      className={`w-full text-left px-3 py-2 text-sm text-white hover:bg-blue-800/30 rounded-lg transition-colors flex items-center justify-between gap-2 ${className}`}
      onClick={handleClick}
    >
      <span className="truncate">{children}</span>
      {selectedValue === value && <Check size={14} className="text-emerald-400 flex-shrink-0" />}
    </button>
  );
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
};
