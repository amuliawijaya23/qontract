import { CardGroup, CardSubgroup, MainContainer } from '@/components/container';
import { FormProvider, FormTextField } from '@/components/formik';
import FormCheckbox from '@/components/formik/form-checkbox';
import FormSelect from '@/components/formik/form-select';
import FullModal from '@/components/modal/full-modal';
import useForm from '@/hooks/use-forms';
import ProjectScopeType from '@/validator/enums/project-scope-type';
import {
  createProjectTemplateFormSchema,
  IProjectTemplateSchema,
} from '@/validator/forms/project-template-form-shcema';
import { Remove } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, Stack } from '@mui/material';
import { FieldArray, useFormik } from 'formik';
import React, { useCallback, useMemo } from 'react';

export default function ProjectTemplateFormView() {
  const { openProjectTemplateForm } = useForm();
  const validationSchema = useMemo(() => createProjectTemplateFormSchema(), []);

  const initialValues: IProjectTemplateSchema = useMemo(
    () => ({
      name: '',
      scope: [
        {
          name: '',
          title: '',
          unit: '',
          options: [],
          required: false,
          type: ProjectScopeType.String,
        },
      ],
    }),
    []
  );

  const form = useFormik({
    validationSchema,
    initialValues,
    onSubmit: async (values) => {},
  });

  const { values, resetForm, submitForm } = form;

  const handleCancel = useCallback(() => {
    resetForm();
    openProjectTemplateForm.onFalse();
  }, [openProjectTemplateForm, resetForm]);

  const handleCreate = useCallback(async () => {
    await submitForm();
  }, [submitForm]);

  return (
    <FullModal
      title="CREATE PROJECT TEMPLATE"
      subtitle="Create a new project template"
      open={openProjectTemplateForm.value}
      onClose={openProjectTemplateForm.onFalse}
      action={
        <>
          <Button color="error" onClick={handleCancel} disabled={false}>
            Cancel
          </Button>
          <Button
            loading={false}
            loadingPosition="start"
            onClick={handleCreate}
          >
            Save
          </Button>
        </>
      }
    >
      <FormProvider value={form}>
        <MainContainer maxWidth="md">
          <Stack gap={3} sx={{ mt: 2 }}>
            <CardGroup title="Template Name">
              <FormTextField
                required
                name="name"
                label="Template Name"
                sx={{ minWidth: '320px' }}
              />
            </CardGroup>
            <FieldArray name="scope">
              {({ push, remove }) => (
                <CardGroup
                  title="Scope"
                  action={
                    <Button
                      onClick={() =>
                        push({
                          name: '',
                          title: '',
                          unit: '',
                          options: [],
                          required: false,
                          type: 'string',
                        })
                      }
                    >
                      Add
                    </Button>
                  }
                >
                  {values.scope.map((s, index) => (
                    <Grid key={`scope-field-${index}`} container width={1}>
                      <FormTextField
                        required
                        name={`scope[${index}].name`}
                        label="Field Name"
                      />
                      <FormTextField
                        required
                        name={`scope[${index}].title`}
                        label="Field Title"
                      />
                      <FormTextField
                        name={`scope[${index}].unit`}
                        label="Unit"
                      />
                      <FieldArray name={`scope[${index}].options`}>
                        {({ push: pushOption, remove: removeOption }) => (
                          <CardSubgroup
                            key={`scope-options-${index}`}
                            title="Options"
                            action={
                              <Button onClick={() => pushOption('')}>
                                Add
                              </Button>
                            }
                          >
                            {values.scope[index].options?.length ? (
                              values.scope[index].options.map((o, i) => (
                                <Box key={`scope-${index}-options-${i}`}>
                                  <FormTextField
                                    name={`scope[${index}].options[${i}]`}
                                    label={`Option ${i + 1}`}
                                  />
                                  <IconButton onClick={() => removeOption(i)}>
                                    <Remove />
                                  </IconButton>
                                </Box>
                              ))
                            ) : (
                              <></>
                            )}
                          </CardSubgroup>
                        )}
                      </FieldArray>
                      <FormCheckbox
                        name={`scope[${index}].required`}
                        required
                        label="Required"
                      />
                      <FormSelect
                        required
                        name={`scope[${index}].type`}
                        label="Field Type"
                        placeholder="String"
                        options={[
                          { name: 'String', value: ProjectScopeType.String },
                          { name: 'Number', value: ProjectScopeType.Number },
                        ]}
                      />
                      <IconButton onClick={() => remove(index)}>
                        <Remove />
                      </IconButton>
                    </Grid>
                  ))}
                </CardGroup>
              )}
            </FieldArray>
          </Stack>
        </MainContainer>
      </FormProvider>
    </FullModal>
  );
}
