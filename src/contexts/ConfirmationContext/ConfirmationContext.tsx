import React, { ReactNode, createContext, useRef, useState } from 'react';

import { ConfirmationModal } from '@/components/modals/ConfirmationModal';

import { noop } from '@/utils';

export const ConfirmationContext = createContext<{
  confirmCustom: (title: string, message: string) => Promise<boolean>;
}>({
  confirmCustom: async () => true,
});

export const ConfirmationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const resolveFn = useRef<(value: boolean) => void>(noop);

  const confirmCustom = async (title: string, message: string) => {
    setMessage(message);
    setTitle(title);
    setOpen(true);
    return new Promise((resolve: (bool: boolean) => void) => {
      resolveFn.current = resolve;
    });
  };

  const handleConfirm = () => {
    setOpen(false);
    resolveFn.current(true);
  };

  const handleCancel = () => {
    setOpen(false);
    resolveFn.current(false);
  };

  return (
    <ConfirmationContext.Provider value={{ confirmCustom }}>
      {children}
      <ConfirmationModal
        open={open}
        title={title}
        message={message}
        onConfirm={handleConfirm}
        onClose={handleCancel}
      />
    </ConfirmationContext.Provider>
  );
};
