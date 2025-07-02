import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';

interface SidebarContextType {
  refreshSidebar: () => void;
  setRefreshFunction: (fn: () => void) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [refreshFunction, setRefreshFunction] = useState<(() => void) | null>(null);

  const refreshSidebar = useCallback(() => {
    if (refreshFunction) {
      refreshFunction();
    }
  }, [refreshFunction]);

  const setRefreshFunc = useCallback((fn: () => void) => {
    setRefreshFunction(() => fn);
  }, []);

  return (
    <SidebarContext.Provider value={{ refreshSidebar, setRefreshFunction: setRefreshFunc }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}; 