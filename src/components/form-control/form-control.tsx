import useBoolean from '@/hooks/use-boolean';

import { createContext, ReactNode } from 'react';

import { useBooleanReturnType } from '@/hooks/use-boolean';

interface IFormControl {
  openAddOrganizationForm: useBooleanReturnType;
  openOrganizationForm: useBooleanReturnType;
  openSettings: useBooleanReturnType;
  openProjectTemplateForm: useBooleanReturnType;
  openProjectForm: useBooleanReturnType;
  openPriceForm: useBooleanReturnType;
  openInviteForm: useBooleanReturnType;
  openClientsForm: useBooleanReturnType;
}

export const FormsContext = createContext<IFormControl | undefined>(undefined);

export default function FormControl({ children }: { children: ReactNode }) {
  const openAddOrganizationForm = useBoolean();
  const openOrganizationForm = useBoolean();
  const openSettings = useBoolean();
  const openProjectTemplateForm = useBoolean();
  const openProjectForm = useBoolean();
  const openPriceForm = useBoolean();
  const openInviteForm = useBoolean();
  const openClientsForm = useBoolean();

  return (
    <FormsContext.Provider
      value={{
        openAddOrganizationForm,
        openOrganizationForm,
        openSettings,
        openProjectTemplateForm,
        openProjectForm,
        openPriceForm,
        openInviteForm,
        openClientsForm,
      }}
    >
      {children}
    </FormsContext.Provider>
  );
}
