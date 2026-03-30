import React, { createContext, ReactNode, useCallback, useState } from 'react';

import { IProjectTemplateSchema } from '@/validator/forms/project-template-form-schema';
import { useBoolean } from '@/hooks';
import { useBooleanReturnType } from '@/hooks/use-boolean';

interface IProjectTemplateFormContext {
  values: IProjectTemplateSchema;
  selectedIndex: number | null;
  openScopeForm: useBooleanReturnType;
  openCostForm: useBooleanReturnType;
  select: (index: number) => void;
}

export const ProjectTemplateFormContext = createContext<
  IProjectTemplateFormContext | undefined
>(undefined);

export default function ProjectTemplateFormProvider({
  children,
  values,
}: {
  children: ReactNode;
  values: IProjectTemplateSchema;
}) {
  const openScopeForm = useBoolean();
  const openCostForm = useBoolean();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelectIndex = useCallback(
    (index: number) => setSelectedIndex(index),
    []
  );

  return (
    <ProjectTemplateFormContext.Provider
      value={{
        values,
        selectedIndex,
        openScopeForm,
        openCostForm,
        select: handleSelectIndex,
      }}
    >
      {children}
    </ProjectTemplateFormContext.Provider>
  );
}
