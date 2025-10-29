import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import ProjectScopeType from '@/validator/enums/project-scope-type';

import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import CustomModal from '@/components/modal/custom-modal';
import {
  creaetScopeFormSchema,
  IScopeSchema,
} from '@/validator/forms/project-template-form-schema';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  RHFAutocomplete,
  RHFCheckbox,
  RHFFormProvider,
  RHFSelect,
  RHFTextField,
} from '@/components/react-hook-form';
import useGetOrganizationUnits from '@/hooks/service/units';

type ScopeFormProps = {
  open: boolean;
  selected: IScopeSchema | null;
  index: number | null;
  onClose: VoidFunction;
  onAppend: (data: IScopeSchema) => void;
  onUpdate: (index: number, data: IScopeSchema) => void;
};

export default function ScopeForm({
  open,
  selected,
  index,
  onClose,
  onAppend,
  onUpdate,
}: ScopeFormProps) {
  const { data: units } = useGetOrganizationUnits();

  const [enableOptions, setEnableOptions] = useState<boolean>(false);

  const defaultValues = useMemo(
    () =>
      selected
        ? {
            title: selected.title,
            unit: selected.unit ?? '',
            required: selected.required,
            type: selected.type,
            options: selected.options
              ? selected.options.map((option) => ({
                  value: option ?? '',
                }))
              : [],
          }
        : {
            title: '',
            unit: '',
            required: false,
            type: ProjectScopeType.String,
            options: [],
          },
    [selected]
  );

  const validationSchema = useMemo(() => creaetScopeFormSchema(), []);

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { control, setValue, reset, handleSubmit } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const type = useWatch({ control, name: 'type' });

  const unitOptions = useMemo(
    () => units?.map((u) => ({ name: u.unit, value: u.unit })) || [],
    [units]
  );

  const scopeTypeOptions = useMemo(
    () => [
      { name: 'Number', value: ProjectScopeType.Number },
      { name: 'Text', value: ProjectScopeType.String },
    ],
    []
  );

  const handleEnableOptions = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEnableOptions(event.currentTarget.checked);
      if (event.currentTarget.checked) {
        setValue('options', [{ value: '' }, { value: '' }, { value: '' }]);
      } else {
        setValue('options', []);
      }
    },
    [setValue]
  );

  const handleAddOption = useCallback(() => {
    append({ value: '' });
  }, [append]);

  const handleClose = useCallback(() => {
    reset();
    setEnableOptions(false);
    onClose();
  }, [reset, onClose]);

  const onSubmit = useCallback(async () => {
    handleSubmit((data) => {
      if (selected && index !== null) {
        onUpdate(index, {
          title: data.title,
          required: data.required,
          type: data.type,
          ...(data.unit ? { unit: data.unit } : {}),
          ...(data.options?.length
            ? { options: data.options.map((option) => option.value) }
            : {}),
        });
      } else {
        onAppend({
          title: data.title,
          required: data.required,
          type: data.type,
          ...(data.unit ? { unit: data.unit } : {}),
          ...(data.options?.length
            ? { options: data.options.map((option) => option.value) }
            : {}),
        });
      }
      handleClose();
    })();
  }, [selected, index, handleSubmit, onAppend, onUpdate, handleClose]);

  useEffect(() => {
    if (selected && selected.options?.length) {
      setEnableOptions(true);
    }

    reset(defaultValues);

    return () => {
      setEnableOptions(false);
      reset();
    };
  }, [defaultValues, selected, setEnableOptions, reset]);

  useEffect(() => {
    if (type === ProjectScopeType.Number) {
      setValue('options', []);
      setEnableOptions(false);
    }

    if (type === ProjectScopeType.String) {
      setValue('unit', '');
    }
  }, [type, setValue]);

  return (
    <CustomModal
      title="ADD SCOPE"
      open={open}
      onClose={handleClose}
      action={
        <>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onSubmit}>{selected ? 'Update' : 'Add'}</Button>
        </>
      }
      size="md"
    >
      <RHFFormProvider methods={methods}>
        <Stack gap={2}>
          <Box gap={2} sx={{ display: 'flex' }}>
            <RHFTextField
              required
              name="title"
              label="Field Title"
              sx={{ width: 320 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'end' }}>
              <RHFCheckbox name="required" label="Required" />
            </Box>
          </Box>
          <Box gap={2} sx={{ display: 'flex' }}>
            <RHFSelect
              required
              name="type"
              label="Field Type"
              options={scopeTypeOptions}
              sx={{ width: 320 }}
            />
            {type === ProjectScopeType.Number && (
              <RHFAutocomplete
                freeSolo
                name="unit"
                label="Unit"
                options={unitOptions}
                sx={{ flex: 0.5 }}
              />
            )}
          </Box>
          {type === ProjectScopeType.String && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={enableOptions}
                      onChange={handleEnableOptions}
                    />
                  }
                  label="Drop-down"
                />
                {enableOptions && (
                  <Box>
                    <Tooltip title="Add Option">
                      <IconButton onClick={handleAddOption}>
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
              {enableOptions && (
                <Fragment>
                  <Divider />
                  <Grid container gap={0}>
                    {fields.map((_, index) => (
                      <Grid
                        key={`option-${index}`}
                        p={0.5}
                        size={{
                          xs: 12,
                          lg: 4,
                        }}
                      >
                        <RHFTextField
                          fullWidth
                          name={`options[${index}].value`}
                          placeholder={`Option ${index + 1}`}
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    size="small"
                                    onClick={(
                                      e: React.MouseEvent<HTMLButtonElement>
                                    ) => {
                                      e.preventDefault();
                                      remove(index);
                                    }}
                                  >
                                    <RemoveIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Fragment>
              )}
            </>
          )}
        </Stack>
      </RHFFormProvider>
    </CustomModal>
  );
}
