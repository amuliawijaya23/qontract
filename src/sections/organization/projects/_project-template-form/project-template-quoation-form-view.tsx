import React from 'react';

import { CardGroup } from '@/components/container';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { FieldArray, useFormikContext } from 'formik';
import { IProjectTemplateSchema } from '@/validator/forms/project-template-form-schema';
import { FormTextField } from '@/components/formik';

export default function ProjectTemplateQuotationFormView() {
  const { values } = useFormikContext<IProjectTemplateSchema>();

  return (
    <FieldArray name="quotation">
      {({ push, remove }) => (
        <CardGroup
          title="QUOTATION"
          action={
            <IconButton
              onClick={() =>
                push({
                  title: '',
                  category: '',
                })
              }
            >
              <AddIcon />
            </IconButton>
          }
        >
          <Stack gap={2}>
            {values.quotation.map((_, index) => (
              <Card key={`quotation-${index}`}>
                <CardHeader
                  title="QUOTATION ITEM"
                  slotProps={{ title: { variant: 'h4' } }}
                  action={
                    <Tooltip title="Remove Quotation">
                      <IconButton onClick={() => remove(index)}>
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>
                  }
                />
                <CardContent>
                  <Stack gap={2}>
                    <FormTextField
                      required
                      name={`quotation[${index}].title`}
                      label="Title"
                    />
                    <FormTextField
                      required
                      name={`quotation[${index}].category`}
                      label="Category"
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </CardGroup>
      )}
    </FieldArray>
  );
}
