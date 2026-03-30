import React, { useMemo } from 'react';

import { Button, Stack } from '@mui/material';

import { MainContainer } from '@/components/container';
import FullModal from '@/components/modal/full-modal';

import useForms from '@/hooks/use-forms';
import { RHFFormProvider } from '@/components/react-hook-form';

import { createProjectTemplateFormStepSchema } from '@/validator/forms/project-template-form-schema';

import ProjectTemplateDeliverablesForm from './project-template-deliverables-form';
import ProjectTemplateCostingForm from './project-template-costing-form';
import useProjectTemplateFormContext from './hook';
import CostForm from './project-template-costing-form/cost-form';

export default function ProjectTemplateFormView() {
  const { openProjectTemplateForm } = useForms();

  const {
    step,
    methods,
    openCostForm,
    handleNext,
    handleBack,
    handleCancel,
    handleCreate,
  } = useProjectTemplateFormContext();

  const stepSchema = useMemo(() => createProjectTemplateFormStepSchema(), []);

  return (
    <>
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
      <CostForm
        open={openCostForm.value}
        selected={selected}
        index={selectedIndex}
        onClose={handleCloseForm}
        onAppend={handleAddCost}
        onUpdate={handleUpdateCost}
      />
    </>
  );
}
