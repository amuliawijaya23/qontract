import lodash from 'lodash';
import {
  RHFAutocomplete,
  RHFFormProvider,
  RHFFormulaBuilder,
  RHFNumericFormat,
  RHFSelect,
  RHFTextField,
  RHFToggleButton,
} from '@/components/react-hook-form';
import { useOrganizationStore } from '@/hooks/store';
import CostingType from '@/validator/enums/costing-type';
import QuantityType from '@/validator/enums/quantity-type';
import CustomModal from '@/components/modal/custom-modal';
import {
  createProjectCostSchema,
  ICostSchema,
  IProjectTemplateSchema,
} from '@/validator/forms/project-template-form-schema';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import ProjectScopeType from '@/validator/enums/project-scope-type';
import OperatorType from '@/validator/enums/operator-type';

type IOption = {
  name: string;
  value: string;
};

type CostFormProps = {
  open: boolean;
  selected: ICostSchema | null;
  index: number | null;
  categories: IOption[];
  onClose: VoidFunction;
  onAppend: (data: ICostSchema) => void;
  onUpdate: (index: number, data: ICostSchema) => void;
};

export default function CostForm({
  open,
  selected,
  index,
  categories,
  onClose,
  onAppend,
  onUpdate,
}: CostFormProps) {
  const [enableOverrides, setEnableOverrides] = useState<boolean>(false);

  const { watch } = useFormContext<IProjectTemplateSchema>();

  const priceList = useOrganizationStore((state) => state.priceList);

  const defaultValues = useMemo(
    () =>
      selected
        ? {
            title: selected.title,
            type: selected.type,
            defaultPriceId: selected.defaultPriceId,
            quantityType: selected.quantityType,
            quantity: selected.quantity,
            percentage: selected.percentage,
            percentageOf: selected.percentageOf,
            rules: selected.rules,
          }
        : {
            title: '',
            type: CostingType.ABSOLUTE,
            defaultPriceId: '',
            quantityType: QuantityType.STATIC,
            quantity: 0,
            percentage: 0,
            percentageOf: [],
            rules: [],
          },
    [selected]
  );

  const validationSchema = useMemo(() => createProjectCostSchema(), []);

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { control, setValue, reset, handleSubmit } = methods;
  const {
    fields: overrides,
    append: appendRule,
    remove: removeRule,
  } = useFieldArray({ control, name: 'rules' });

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const onSubmit = useCallback(() => {
    handleSubmit((data) => {
      console.log('DATA: ', data);
    });
    handleClose();
  }, [handleSubmit, handleClose]);

  const handleEnableOverrides = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEnableOverrides(event.currentTarget.checked);
      if (!event.currentTarget.checked) {
        setValue('rules', []);
      }
    },
    [setValue]
  );

  const handleAddOverrides = useCallback(() => {
    appendRule({
      conditions: [
        {
          scopeField: '',
          operator: OperatorType.EQ,
          value: '',
        },
      ],
      output: {
        priceId: '',
        quantityType: QuantityType.STATIC,
        quantity: '',
      },
    });
  }, [appendRule]);

  const handleRemoveOverride = useCallback(
    (i: number) => removeRule(i),
    [removeRule]
  );

  const values = watch();

  const type = useWatch({ control, name: 'type' });
  const quantityType = useWatch({ control, name: 'quantityType' });

  const priceListOptions = useMemo(
    () =>
      priceList.map((p) => ({
        value: p.id,
        name: `${p.name}${p.brand ? ` - ${p.brand}` : ''}${
          p.model ? ` - ${p.model}` : ''
        }${p.description ? ` - ${p.description}` : ''}`,
      })),
    [priceList]
  );

  const costTypeOptions = useMemo(
    () => [
      { name: 'Absolute', value: CostingType.ABSOLUTE },
      { name: 'Percentage', value: CostingType.PERCENTAGE },
    ],
    []
  );

  const quantityTypeOptions = useMemo(
    () => [
      { name: 'Static', value: QuantityType.STATIC },
      { name: 'Formula', value: QuantityType.FORMULA },
    ],
    []
  );

  const scopeFields = useMemo(
    () => values.deliverables.flatMap((deliverable) => deliverable.scopes),
    [values.deliverables]
  );

  const scopeFieldOptions = useMemo(
    () =>
      scopeFields.map((scope) => ({
        name: scope.title,
        value: lodash.camelCase(scope.title),
      })),
    [scopeFields]
  );

  const formulaScopeFieldOptions = useMemo(
    () =>
      scopeFields
        .filter((scope) => scope.type === ProjectScopeType.Number)
        .map((scope) => ({
          name: scope.title,
          value: lodash.camelCase(scope.title),
        })),
    [scopeFields]
  );

  useEffect(() => {
    if (type === CostingType.ABSOLUTE) {
      setValue('percentage', 0);
      setValue('percentageOf', []);
    }

    if (type === CostingType.PERCENTAGE) {
      setValue('defaultPriceId', '');
    }

    if (quantityType === QuantityType.STATIC) {
      setValue('quantity', 0);
    }

    if (quantityType === QuantityType.FORMULA) {
      setValue('quantity', '');
    }

    if (!enableOverrides) {
      setValue('rules', []);
    }
  }, [type, quantityType, enableOverrides, setValue]);

  return (
    <CustomModal
      title="ADD COST"
      open={open}
      onClose={handleClose}
      action={
        <>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onSubmit}>{selected ? 'Update' : 'Add'}</Button>
        </>
      }
      size="lg"
    >
      <RHFFormProvider methods={methods}>
        <Stack gap={2}>
          <RHFTextField name="title" label="Title" sx={{ width: 320 }} />
          <Divider />
          <Typography variant="h4">PRICING</Typography>
          <RHFToggleButton name="type" options={costTypeOptions} />
          {type === CostingType.ABSOLUTE && (
            <RHFAutocomplete
              name="defaultPriceId"
              label="Default Price Item"
              options={priceListOptions}
            />
          )}
          {type === CostingType.PERCENTAGE && (
            <>
              <RHFNumericFormat
                name="percentage"
                label="Percentage"
                suffix=" %"
                sx={{ width: 320 }}
              />
              <RHFSelect
                name="percentageOf"
                label="Percentage Of"
                options={categories}
                multiple
              />
            </>
          )}
          <Divider />
          <Typography variant="h4">QUANTITY</Typography>
          <RHFToggleButton
            name="quantityType"
            options={quantityTypeOptions}
            buttonWidth={100}
          />
          {quantityType == QuantityType.STATIC ? (
            <RHFTextField
              name="quantity"
              label="Quantity"
              type="number"
              sx={{ width: 350 }}
            />
          ) : (
            <RHFFormulaBuilder
              name="quantity"
              scopeFields={formulaScopeFieldOptions}
            />
          )}
          <FormControlLabel
            control={
              <Switch
                checked={enableOverrides}
                onChange={handleEnableOverrides}
              />
            }
            label="Overrides"
          />
          {enableOverrides && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h4">OVERRIDES</Typography>
                <Box>
                  <Tooltip title="Add Override">
                    <IconButton onClick={handleAddOverrides}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              {/* {overrides.map((_, i) => (
                
              ))} */}
            </>
          )}
        </Stack>
      </RHFFormProvider>
    </CustomModal>
  );
}
