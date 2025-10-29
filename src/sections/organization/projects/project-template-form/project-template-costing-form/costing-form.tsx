import React, { useCallback, useMemo, useState } from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { useWatch, useFieldArray, useFormContext } from 'react-hook-form';
import { RHFTextField } from '@/components/react-hook-form';
import {
  ICostSchema,
  IProjectTemplateSchema,
} from '@/validator/forms/project-template-form-schema';

import { useBoolean } from '@/hooks';
import CostForm from './cost-form';

type CostingFormProps = {
  index: number;
  onRemove: (index: number) => void;
};

export default function CostingForm({ index, onRemove }: CostingFormProps) {
  const openCostForm = useBoolean();

  const [selectedIndex, setSelectedIndex] = useState<null | number>(null);

  const {
    formState: { errors },
    control,
  } = useFormContext<IProjectTemplateSchema>();

  const handleRemove = useCallback(() => onRemove(index), [index, onRemove]);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `costing.${index}.costs`,
  });

  const handleAddCost = useCallback(
    (data: ICostSchema) => {
      append(data);
    },
    [append]
  );

  const handleEditCost = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      openCostForm.onTrue();
    },
    [openCostForm]
  );

  const handleUpdateCost = useCallback(
    (index: number, data: ICostSchema) => {
      update(index, data);
      openCostForm.onFalse();
      setSelectedIndex(null);
    },
    [openCostForm, update]
  );

  const handleCloseForm = useCallback(() => {
    openCostForm.onFalse();
    setSelectedIndex(null);
  }, [openCostForm]);

  const costing = useWatch({ control, name: 'costing' });

  const selected = useMemo(
    () => (selectedIndex !== null ? fields[selectedIndex] : null),
    [fields, selectedIndex]
  );

  const percentageOfOptions = useMemo(
    () =>
      costing.map((c) => ({
        name: c.category,
        value: c.category,
      })),
    [costing]
  );

  const costsError = useMemo(
    () => errors.costing && errors.costing[0]?.costs?.message,
    [errors.costing]
  );

  return (
    <>
      <CostForm
        open={openCostForm.value}
        selected={selected}
        index={selectedIndex}
        categories={percentageOfOptions}
        onClose={handleCloseForm}
        onAppend={handleAddCost}
        onUpdate={handleUpdateCost}
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
            name={`costing[${index}].category`}
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
        <CardContent>
          <Card variant="outlined">
            <Button
              color={costsError && !fields.length ? 'error' : 'primary'}
              fullWidth
              variant="outlined"
              sx={{ p: 2 }}
              onClick={openCostForm.onTrue}
            >
              <AddIcon />
            </Button>
          </Card>
        </CardContent>
      </Card>
    </>
  );
}
