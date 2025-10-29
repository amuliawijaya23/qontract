import useBoolean from '@/hooks/use-boolean';

import { createContext, ReactNode, useCallback, useState } from 'react';

import { useBooleanReturnType } from '@/hooks/use-boolean';

interface IFormControl {
  orgId: string;
  projectTemplateId: string;
  projectId: string;
  priceId: string;
  clientId: string;
  handleOrgId: (id: string) => void;
  handleProjectTemplateId: (id: string) => void;
  handleProjectId: (id: string) => void;
  handlePriceId: (id: string) => void;
  handleClientId: (id: string) => void;
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
  const [orgId, setOrgId] = useState<string>('');
  const [projectTemplateId, setProjectTemplateId] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('');
  const [priceId, setPriceId] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');

  const openAddOrganizationForm = useBoolean();
  const openOrganizationForm = useBoolean();
  const openSettings = useBoolean();
  const openProjectTemplateForm = useBoolean();
  const openProjectForm = useBoolean();
  const openPriceForm = useBoolean();
  const openInviteForm = useBoolean();
  const openClientsForm = useBoolean();

  const handleOrgId = useCallback((id: string) => setOrgId(id), []);
  const handleProjectTemplateId = useCallback(
    (id: string) => setProjectTemplateId(id),
    []
  );
  const handleProjectId = useCallback((id: string) => setProjectId(id), []);
  const handlePriceId = useCallback((id: string) => setPriceId(id), []);
  const handleClientId = useCallback((id: string) => setClientId(id), []);

  return (
    <FormsContext.Provider
      value={{
        orgId,
        projectTemplateId,
        projectId,
        priceId,
        clientId,
        handleOrgId,
        handleProjectTemplateId,
        handleProjectId,
        handlePriceId,
        handleClientId,
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
