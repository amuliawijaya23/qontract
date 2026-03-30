import { useMemo, useState, useCallback } from 'react';

import { Button, Stack } from '@mui/material';

import FullModal from '@/components/modal/full-modal';

import {
  createProjectTemplateFormSchema,
  createProjectTemplateFormStepSchema,
  IProjectTemplateSchema,
} from '@/validator/forms/project-template-form-schema';

import { useForms } from '@/hooks';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RHFFormProvider } from '@/components/react-hook-form';
import { MainContainer } from '@/components/container';
import ProjectTemplateFormProvider from './provider';
import { DeliverablesForm } from './deliverables';
import ScopeForm from './deliverables/scope-form';

type FieldKeys = 'name' | 'deliverables' | 'costing' | 'quotation';

export default function ProjectTemplateFormView() {
  const { openProjectTemplateForm: open } = useForms();

  const [step, setStep] = useState<number>(0);

  const stepSchema = useMemo(() => createProjectTemplateFormStepSchema(), []);

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

  const validationSchema = useMemo(() => createProjectTemplateFormSchema(), []);

  const defaultValues = useMemo(
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
    open.onFalse();
  }, [reset, open]);

  const handleCreate = useCallback(() => {
    handleSubmit(async (data: IProjectTemplateSchema) => {
      console.log(data);
    });
    reset();
  }, [handleSubmit, reset]);

  return (
    <ProjectTemplateFormProvider values={values}>
      <FullModal
        title="CREATE PROJECT TEMPLATE"
        subtitle="Create a new project template"
        open={open.value}
        onClose={open.onFalse}
        action={
          <>
            {step === 0 && (
              <Button color="error" onClick={handleCancel} disabled={false}>
                Cancel
              </Button>
            )}
            {step > 0 && (
              <Button onClick={handleBack} disabled={false}>
                Back
              </Button>
            )}
            {step < stepSchema.length - 1 && (
              <Button
                loading={false}
                loadingPosition="start"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
            {step === stepSchema.length - 1 && (
              <Button
                loading={false}
                loadingPosition="start"
                onClick={handleCreate}
              >
                Save
              </Button>
            )}
          </>
        }
      >
        <RHFFormProvider methods={methods}>
          <MainContainer maxWidth="md">
            <Stack gap={3} sx={{ mt: 2 }}>
              {step === 0 && <DeliverablesForm />}
              {step === 1 && <></>}
              {step === 2 && <></>}
            </Stack>
          </MainContainer>
        </RHFFormProvider>
      </FullModal>
    </ProjectTemplateFormProvider>
  );
}
