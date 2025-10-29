import { useEffect, useState } from 'react';

import { useField, useFormikContext } from 'formik';
import { Box, MenuItem, TextField } from '@mui/material';

import FormulaWrappers from '@/validator/enums/formula-wrappers';
import MathOperators from '@/validator/enums/math-operators';

interface IOption {
  name: string;
  value: string;
}

interface IFormFormulaBuilder {
  name: string;
  scopeFields: IOption[];
}

export default function FormFormulaBuilder({
  name,
  scopeFields,
}: IFormFormulaBuilder) {
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();

  const [wrapper, setWrapper] = useState('');
  const [leftOperand, setLeftOperand] = useState(scopeFields[0].value || '');
  const [operator, setOperator] = useState('/');
  const [rightOperand, setRightOperand] = useState(1);

  useEffect(() => {
    const base = `${leftOperand} ${operator} ${rightOperand}`;
    const finalExpr = wrapper ? `${wrapper}(${base})` : base;
    setFieldValue(name, finalExpr);
  }, [name, wrapper, leftOperand, operator, rightOperand, setFieldValue]);

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <TextField
        select
        label="Wrapper"
        value={wrapper}
        onChange={(e) => setWrapper(e.target.value)}
        sx={{ width: 120 }}
      >
        {Object.values(FormulaWrappers).map((w) => (
          <MenuItem key={w} value={w}>
            {w || '(none)'}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Scope Field"
        value={leftOperand}
        onChange={(e) => setLeftOperand(e.target.value)}
        sx={{ width: 200 }}
      >
        {scopeFields.map((sf) => (
          <MenuItem key={sf.value} value={sf.value}>
            {sf.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Operator"
        value={operator}
        onChange={(e) => setOperator(e.target.value)}
        sx={{ width: 100 }}
      >
        {Object.values(MathOperators).map((op) => (
          <MenuItem key={op} value={op}>
            {op}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Number"
        type="number"
        value={rightOperand}
        onChange={(e) => setRightOperand(Number(e.target.value))}
        sx={{ width: 100 }}
      />
    </Box>
  );
}
