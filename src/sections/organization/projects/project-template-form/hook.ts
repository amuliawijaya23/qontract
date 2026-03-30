import { useContext } from 'react';
import { ProjectTemplateFormContext } from './provider';

export default function useProjectTemplateFormContext() {
  const context = useContext(ProjectTemplateFormContext);

  if (!context) {
    throw new Error(`useForm must be used within ProjectTemplateFormProvider`);
  }

  return context;
}
