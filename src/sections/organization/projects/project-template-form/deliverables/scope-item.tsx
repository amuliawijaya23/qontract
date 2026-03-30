import React, { useCallback } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  FormLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import EditNoteIcon from '@mui/icons-material/EditNote';

import { IScopeSchema } from '@/validator/forms/project-template-form-schema';
import ProjectScopeType from '@/validator/enums/project-scope-type';

type ScopeItemProps = {
  values: IScopeSchema;
  index: number;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
};

export default function ScopeItem({
  values,
  index,
  onEdit,
  onRemove,
}: ScopeItemProps) {
  const handleEditClick = useCallback(() => {
    onEdit(index);
  }, [index, onEdit]);

  const handleRemoveClick = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <Card variant="outlined">
      <CardHeader
        title={values.title}
        action={
          <>
            <Tooltip title="Edit Scope">
              <IconButton onClick={handleEditClick}>
                <EditNoteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove Scope">
              <IconButton onClick={handleRemoveClick}>
                <RemoveIcon />
              </IconButton>
            </Tooltip>
          </>
        }
        slotProps={{ title: { variant: 'h4' } }}
      />
      <CardContent>
        <Stack gap={2}>
          <Grid container>
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              <Stack gap={1}>
                <FormLabel>Required</FormLabel>
                <Typography>{values.required ? 'Yes' : 'No'}</Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              <Stack gap={1}>
                <FormLabel>Type</FormLabel>
                <Typography>{`${values.type[0].toUpperCase()}${values.type.substring(
                  1
                )}`}</Typography>
              </Stack>
            </Grid>
            {values.type === ProjectScopeType.Number && (
              <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                <Stack gap={1}>
                  <FormLabel>Unit</FormLabel>
                  <Typography>{values.unit}</Typography>
                </Stack>
              </Grid>
            )}
            {values.type === ProjectScopeType.String &&
              values.options?.length && (
                <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                  <Stack gap={1}>
                    <FormLabel>Options</FormLabel>
                    <List
                      component={Stack}
                      disablePadding
                      dense
                      direction="row"
                    >
                      {values.options.map((option, i) => (
                        <ListItem
                          key={`scope-${i}-${option}`}
                          disableGutters
                          disablePadding
                          dense
                        >
                          <ListItemText primary={option} />
                        </ListItem>
                      ))}
                    </List>
                  </Stack>
                </Grid>
              )}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
}
