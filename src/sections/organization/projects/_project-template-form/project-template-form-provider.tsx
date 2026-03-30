import React, {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  createProjectTemplateFormSchema,
  IProjectTemplateSchema,
} from '@/validator/forms/project-template-form-schema';

import useForms from '@/hooks/use-forms';
import { useBoolean } from '@/hooks';
import { useBooleanReturnType } from '@/hooks/use-boolean';

interface IProjectTemplateFormContext {
  values: IProjectTemplateSchema;
  step: number;
  methods: UseFormReturn<IProjectTemplateSchema>;
  openCostForm: useBooleanReturnType;
  setStep: (step: number) => void;
  handleBack: () => void;
  handleNext: () => void;
  handleCancel: () => void;
  handleCreate: () => void;
}

export const ProjectTemplateFormContext = createContext<
  IProjectTemplateFormContext | undefined
>(undefined);

type ProjectTemplateFormProviderProps = {
  children: ReactNode;
};

type FieldKeys = 'name' | 'deliverables' | 'costing' | 'quotation';

export default function ProjectTemplateFormProvider({
  children,
}: ProjectTemplateFormProviderProps) {
  const { openProjectTemplateForm } = useForms();
  const openCostForm = useBoolean();

  const [step, setStep] = useState<number>(0);

  const [selectedCost, setSelectedCost] = useState<number | null>(null);

  const validationSchema = useMemo(() => createProjectTemplateFormSchema(), []);

  const stepFields: FieldKeys[] = useMemo(() => {
    switch (step) {
      case 0:
        return ['name', 'deliverables'];

      case 1:
        return ['costing'];

      case 2:
        return ['quotation'];

      default:
        return [];
    }
  }, [step]);

  const defaultValues: IProjectTemplateSchema = useMemo(
    () => ({
      name: '',
      deliverables: [
        {
          category: '',
          scopes: [],
        },
      ],
      costing: [
        {
          category: '',
          costs: [],
        },
      ],
      quotation: [
        {
          title: '',
          category: '',
        },
      ],
    }),
    []
  );

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { reset, handleSubmit, trigger, watch } = methods;

  const values = watch();

  const handleNext = useCallback(async () => {
    const isValid = await trigger(stepFields);
    if (isValid) {
      setStep((prev: number) => prev + 1);
    }
  }, [stepFields, trigger]);

  const handleBack = useCallback(() => {
    setStep((prev: number) => prev - 1);
  }, []);

  const handleCancel = useCallback(() => {
    reset();
    openProjectTemplateForm.onFalse();
  }, [reset, openProjectTemplateForm]);

  const handleCreate = useCallback(() => {
    handleSubmit(async (data: IProjectTemplateSchema) => {
      console.log(data);
    });
    reset();
  }, [handleSubmit, reset]);

  return (
    <ProjectTemplateFormContext.Provider
      value={{
        values,
        step,
        methods,
        openCostForm,
        setStep,
        handleBack,
        handleNext,
        handleCancel,
        handleCreate,
      }}
    >
      {children}
    </ProjectTemplateFormContext.Provider>
  );
}
