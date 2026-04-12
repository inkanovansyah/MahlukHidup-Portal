import * as React from 'react';
import { X } from 'lucide-react';

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

function useDialogContext() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within a Dialog');
  }
  return context;
}

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />
      )}
    </DialogContext.Provider>
  );
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

function DialogContent({ children, className = '' }: DialogContentProps) {
  const { open } = useDialogContext();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className={`w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0d1f47] border border-blue-800/40 rounded-xl shadow-2xl relative ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

function DialogHeader({ children, className = '' }: DialogHeaderProps) {
  return (
    <div className={`sticky top-0 bg-[#0d1f47] border-b border-blue-800/30 p-4 md:p-6 z-10 ${className}`}>
      {children}
    </div>
  );
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

function DialogTitle({ children, className = '' }: DialogTitleProps) {
  return (
    <h3 className={`text-lg font-black text-white uppercase font-cyber italic ${className}`}>
      {children}
    </h3>
  );
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

function DialogDescription({ children, className = '' }: DialogDescriptionProps) {
  return (
    <p className={`text-sm text-slate-400 ${className}`}>
      {children}
    </p>
  );
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

function DialogFooter({ children, className = '' }: DialogFooterProps) {
  return (
    <div className={`flex gap-3 pt-4 ${className}`}>
      {children}
    </div>
  );
}

interface DialogCloseProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function DialogClose({ children, className = '', onClick }: DialogCloseProps) {
  const { onOpenChange } = useDialogContext();

  const handleClick = () => {
    onOpenChange(false);
    onClick?.();
  };

  if (children) {
    return (
      <button
        className={className}
        onClick={handleClick}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-white"
    >
      <X size={18} />
    </button>
  );
}

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
