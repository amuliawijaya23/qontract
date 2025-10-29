import React from 'react';
import { IProjectTemplateSchema } from '@/validator/forms/project-template-form-schema';

import { IconButton, Stack, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { CardGroup } from '@/components/container';

import { useFieldArray, useFormContext } from 'react-hook-form';
import CostingForm from './costing-form';

export default function ProjectTemplateCostingForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<IProjectTemplateSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'costing',
  });

  return (
    <CardGroup
      title="COSTING"
      action={
        <Tooltip title="Add COSTING">
          <IconButton
            onClick={() =>
              append({
                category: '',
                costs: [],
              })
            }
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      }
    >
      <Stack gap={2}>
        {fields.map((_, index) => (
          <CostingForm
            key={`costing-${index}`}
            index={index}
            onRemove={remove}
          />
        ))}
      </Stack>
    </CardGroup>
  );
}
