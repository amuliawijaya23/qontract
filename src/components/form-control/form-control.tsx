import { useBoolean } from '@/hooks/use-boolean';
import { createContext, ReactNode } from 'react';

import { useBooleanReturnType } from '@/hooks/use-boolean';

interface IFormControl {
  openAddOrganizationForm: useBooleanReturnType;
  openOrganizationForm: useBooleanReturnType;
  openSettings: useBooleanReturnType;
}

export const FormsContext = createContext<IFormControl | undefined>(undefined);

export default function FormControl({ children }: { children: ReactNode }) {
  const openAddOrganizationForm = useBoolean();
  const openOrganizationForm = useBoolean();
  const openSettings = useBoolean();

  return (
    <FormsContext.Provider
      value={{
        openAddOrganizationForm,
        openOrganizationForm,
        openSettings,
      }}
    >
      {children}
    </FormsContext.Provider>
  );
}
