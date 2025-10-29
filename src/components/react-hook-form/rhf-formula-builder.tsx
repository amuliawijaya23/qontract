import { useEffect, useState } from 'react';

import { Box, MenuItem, TextField } from '@mui/material';

import { useFormContext } from 'react-hook-form';

import FormulaWrappers from '@/validator/enums/formula-wrappers';
import MathOperators from '@/validator/enums/math-operators';

type Option = {
  name: string;
  value: string;
};

type FormFormulaBuilderProps = {
  name: string;
  scopeFields: Option[];
};

export default function RHFFormulaBuilder({
  name,
  scopeFields,
}: FormFormulaBuilderProps) {
  const { setValue } = useFormContext();

  const [wrapper, setWrapper] = useState('');
  const [leftOperand, setLeftOperand] = useState(scopeFields[0].value || '');
  const [operator, setOperator] = useState('/');
  const [rightOperand, setRightOperand] = useState(1);

  useEffect(() => {
    const base = `${leftOperand} ${operator} ${rightOperand}`;
    const finalExpr = wrapper ? `${wrapper}(${base})` : base;
    setValue(name, finalExpr);
  }, [name, wrapper, leftOperand, operator, rightOperand, setValue]);

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
