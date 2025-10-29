import React, { useCallback, useMemo, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { RHFTextField } from '@/components/react-hook-form';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useBoolean } from '@/hooks';
import ScopeForm from './scope-form';
import {
  IProjectTemplateSchema,
  IScopeSchema,
} from '@/validator/forms/project-template-form-schema';

import ScopeItem from './scope-item';

type DeliverableFormProps = {
  index: number;
  onRemove: (index: number) => void;
};

export default function DeliverableForm({
  index,
  onRemove,
}: DeliverableFormProps) {
  const openScopeForm = useBoolean();

  const [selectedIndex, setSelectedIndex] = useState<null | number>(null);

  const {
    formState: { errors },
    control,
  } = useFormContext<IProjectTemplateSchema>();

  const scopesError = useMemo(
    () => errors.deliverables && errors.deliverables[0]?.scopes?.message,
    [errors.deliverables]
  );

  const handleRemove = useCallback(() => onRemove(index), [index, onRemove]);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `deliverables.${index}.scopes`,
  });

  const handleAddScope = useCallback(
    (data: IScopeSchema) => {
      append(data);
    },
    [append]
  );

  const handleEditScope = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      openScopeForm.onTrue();
    },
    [openScopeForm]
  );

  const handleUpdateScope = useCallback(
    (index: number, data: IScopeSchema) => {
      update(index, data);
      openScopeForm.onFalse();
      setSelectedIndex(null);
    },
    [openScopeForm, update]
  );

  const handleCloseForm = useCallback(() => {
    openScopeForm.onFalse();
    setSelectedIndex(null);
  }, [openScopeForm]);

  const selected = useMemo(
    () => (selectedIndex !== null ? fields[selectedIndex] : null),
    [fields, selectedIndex]
  );

  return (
    <>
      <ScopeForm
        index={selectedIndex}
        selected={selected}
        open={openScopeForm.value}
        onClose={handleCloseForm}
        onAppend={handleAddScope}
        onUpdate={handleUpdateScope}
      />
      <Card>
        <CardContent
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <RHFTextField
            required
            name={`deliverables[${index}].category`}
            label="Category"
            sx={{ width: 320 }}
          />
          <Box>
            <Tooltip title="Remove Deliverable">
              <IconButton onClick={handleRemove}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
        <CardHeader title="SCOPES" slotProps={{ title: { variant: 'h4' } }} />
        {scopesError && !fields.length && (
          <CardContent sx={{ px: 2, py: 0 }}>
            <Alert severity="error">{scopesError}</Alert>
          </CardContent>
        )}
        {Array.isArray(fields) && fields.length > 0 && (
          <CardContent>
            <Stack gap={1}>
              {fields.map((scope: IScopeSchema, i: number) => (
                <ScopeItem
                  key={`deliverable-${index}-scope-${i}`}
                  values={scope}
                  index={i}
                  onRemove={remove}
                  onEdit={handleEditScope}
                />
              ))}
            </Stack>
          </CardContent>
        )}
        <CardContent>
          <Card variant="outlined">
            <Button
              color={scopesError && !fields.length ? 'error' : 'primary'}
              fullWidth
              variant="outlined"
              sx={{ p: 2 }}
              onClick={openScopeForm.onTrue}
            >
              <AddIcon />
            </Button>
          </Card>
        </CardContent>
      </Card>
    </>
  );
}
