import { useMemo } from 'react';

import { Alert, IconButton, Stack, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { CardGroup } from '@/components/container';

import { RHFTextField } from '@/components/react-hook-form';
import { useFieldArray, useFormContext } from 'react-hook-form';

import DeliverableForm from './deliverables-form';
import { IProjectTemplateSchema } from '@/validator/forms/project-template-form-schema';

export default function ProjectTemplateDeliverablesForm() {
  const {
    formState: { errors },
    control,
  } = useFormContext<IProjectTemplateSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'deliverables',
  });

  const deliverablesError = useMemo(
    () => errors.deliverables?.message,
    [errors.deliverables?.message]
  );

  return (
    <>
      <CardGroup title="TEMPLATE NAME">
        <RHFTextField
          required
          name="name"
          label="Name"
          sx={{ minWidth: 320 }}
        />
      </CardGroup>
      <CardGroup
        title="DELIVERABLES"
        action={
          <Tooltip title="Add Deliverables">
            <IconButton
              onClick={() =>
                append({
                  category: '',
                  scopes: [],
                })
              }
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        }
      >
        <Stack gap={2}>
          {deliverablesError && fields.length === 0 && (
            <Alert severity="error">{deliverablesError}</Alert>
          )}
          {fields.map((_, index) => (
            <DeliverableForm
              key={`deliverables-${index}`}
              index={index}
              onRemove={remove}
            />
          ))}
        </Stack>
      </CardGroup>
    </>
  );
}
