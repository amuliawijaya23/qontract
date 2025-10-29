import React, { useState, useCallback, useMemo } from 'react';

import { Button, Stack } from '@mui/material';

import { MainContainer } from '@/components/container';
import FullModal from '@/components/modal/full-modal';

import useForms from '@/hooks/use-forms';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RHFFormProvider } from '@/components/react-hook-form';

import {
  createProjectTemplateFormSchema,
  createProjectTemplateFormStepSchema,
  IProjectTemplateSchema,
} from '@/validator/forms/project-template-form-schema';

import ProjectTemplateDeliverablesForm from './project-template-deliverables-form';
import ProjectTemplateCostingForm from './project-template-costing-form';

type FieldKeys = 'name' | 'deliverables' | 'costing' | 'quotation';

export default function ProjectTemplateFormView() {
  const [step, setStep] = useState<number>(0);

  const { openProjectTemplateForm } = useForms();

  const validationSchema = useMemo(() => createProjectTemplateFormSchema(), []);

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
          costs: [
            // {
            //   title: '',
            //   type: CostingType.ABSOLUTE,
            //   defaultPriceId: '',
            //   quantityType: QuantityType.STATIC,
            //   quantity: 0,
            //   percentage: 0,
            //   percentageOf: [],
            //   rules: [],
            // },
          ],
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

  const { reset, handleSubmit, trigger } = methods;

  const handleBack = useCallback(() => {
    setStep((prev) => prev - 1);
  }, []);

  const handleNext = useCallback(async () => {
    const isValid = await trigger(stepFields);

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  }, [stepFields, trigger]);

  const handleCancel = useCallback(() => {
    reset();
    openProjectTemplateForm.onFalse();
  }, [openProjectTemplateForm, reset]);

  const handleCreate = useCallback(() => {
    handleSubmit(async (data) => {
      console.log(data);
    });
  }, [handleSubmit]);

  return (
    <FullModal
      title="CREATE PROJECT TEMPLATE"
      subtitle="Create a new project template"
      open={openProjectTemplateForm.value}
      onClose={openProjectTemplateForm.onFalse}
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
            {step === 0 && <ProjectTemplateDeliverablesForm />}
            {step === 1 && <ProjectTemplateCostingForm />}
            {step === 2 && <></>}
          </Stack>
        </MainContainer>
      </RHFFormProvider>
    </FullModal>
  );
}
