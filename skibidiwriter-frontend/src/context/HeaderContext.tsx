import * as React from "react";
import { createContext, useMemo, useState } from "react";

type HeaderContextType = {
  headerChildren: React.ReactNode | null;
  headerActions: React.ReactNode | null;
  setHeaderChildren: React.Dispatch<
    React.SetStateAction<React.ReactNode | null>
  >;
  setHeaderActions: React.Dispatch<
    React.SetStateAction<React.ReactNode | null>
  >;
};

export const HeaderContext = createContext<HeaderContextType | null>(null);

export const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [headerChildren, setHeaderChildren] = useState<React.ReactNode | null>(
    null,
  );
  const [headerActions, setHeaderActions] = useState<React.ReactNode | null>(
    null,
  );

  const value = useMemo(
    () => ({
      headerChildren,
      headerActions,
      setHeaderChildren,
      setHeaderActions,
    }),
    [headerChildren, headerActions],
  );

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
};
