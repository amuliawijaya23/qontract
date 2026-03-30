import { ICostSchema } from '@/validator/forms/project-template-form-schema';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

type CostConditionFormProps = {
  index: number;
};

export default function CostConditionForm({ index }: CostConditionFormProps) {
  const { watch } = useFormContext<ICostSchema>();

  const values = watch();

  //   const scopeFieldName =
  //     values.costing?.[index]?.costs[cIdx].rules?.[idx]?.conditions?.[i]
  //       ?.scopeField;

  //   const selectedScopeField = scopeFields.find(
  //     (s) => lodash.camelCase(s.title) === scopeFieldName
  //   );

  console.log('VAL: ', values);
  return <div>CostConditionForm</div>;
}
