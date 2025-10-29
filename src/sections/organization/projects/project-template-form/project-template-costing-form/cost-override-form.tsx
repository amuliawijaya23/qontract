import React, { useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { Control, useFieldArray, useFormContext } from 'react-hook-form';

type CostOverrideFormProps = {
  control: Control;
  index: number;
  onRemove: (index: number) => void;
};

export default function CostOverrideForm({
  control,
  index,
  onRemove,
}: CostOverrideFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `rules.${index}.conditions`,
  });

  const handleRemoveOverride = useCallback(
    () => onRemove(index),
    [index, onRemove]
  );

  const handleAddCondition = useCallback(() => {
    append({
      scopeField: '',
      operator: '>=',
      value: '',
    });
  }, [append]);

  return (
    <Card>
      <CardHeader
        action={
          <Tooltip title="Remove Override">
            <IconButton onClick={handleRemoveOverride}>
              <RemoveIcon />
            </IconButton>
          </Tooltip>
        }
      />
      <CardContent>
        <Stack gap={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h4">CONDITIONS</Typography>
            <Box>
              <Tooltip title="Add Condition">
                <IconButton onClick={handleAddCondition}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
