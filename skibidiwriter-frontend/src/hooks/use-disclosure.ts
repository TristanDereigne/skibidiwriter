import { useState } from "react";

export function useDisclosure(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return {
    isOpen,
    open: () => setIsOpen(true),
    dialogProps: { open: isOpen, onOpenChange: setIsOpen },
  };
}

export type Disclosure = ReturnType<typeof useDisclosure>;
