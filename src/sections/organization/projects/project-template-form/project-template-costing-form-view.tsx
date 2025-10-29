import React, { useMemo } from 'react';
import lodash from 'lodash';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';

import { CardGroup } from '@/components/container';

import { FieldArray, useFormikContext } from 'formik';
import {
  FormFormulaBuilder,
  FormNumericFormat,
  FormTextField,
  FormToggleButton,
} from '@/components/formik';
import { IProjectTemplateSchema } from '@/validator/forms/project-template-form-schema';
import { useOrganizationStore } from '@/hooks/store';
import QuantityType from '@/validator/enums/quantity-type';
import FormAutocomplete from '@/components/formik/form-autocomplete';
import FormSelect from '@/components/formik/form-select';
import OperatorType from '@/validator/enums/operator-type';
import ProjectScopeType from '@/validator/enums/project-scope-type';
import CostingType from '@/validator/enums/costing-type';
import CustomModal from '@/components/modal/custom-modal';
import { useBoolean } from '@/hooks';

export default function ProjectTemplateCostingFormView() {
  const openCostForm = useBoolean();

  const { values } = useFormikContext<IProjectTemplateSchema>();

  const priceList = useOrganizationStore((state) => state.priceList);

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

  const operatorOptions = useMemo(
    () => [
      { value: OperatorType.EQ, name: '==' },
      { value: OperatorType.NEQ, name: '!=' },
      { value: OperatorType.GT, name: '>' },
      { value: OperatorType.GTE, name: '>=' },
      { value: OperatorType.LT, name: '<' },
      { value: OperatorType.LTE, name: '<=' },
    ],
    []
  );

  const percentageOfOptions = useMemo(
    () =>
      values.costing.map((cost) => ({
        name: cost.category,
        value: cost.category,
      })),
    [values.costing]
  );

  return (
    <FieldArray name="costing">
      {({ push, remove }) => (
        <CardGroup
          title="COSTING"
          action={
            <IconButton
              onClick={() =>
                push({
                  category: '',
                  costs: [],
                })
              }
            >
              <AddIcon />
            </IconButton>
          }
        >
          <Stack gap={2}>
            {values.costing.map((m, index) => (
              <Card key={`costing-${index}`} sx={{ p: 1 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <FormTextField
                      required
                      name={`costing[${index}].category`}
                      label="Category"
                      // disabled={isPending}
                      sx={{ width: 320 }}
                    />
                    <Box>
                      <Tooltip title="Remove Costing">
                        <IconButton onClick={() => remove(index)}>
                          <RemoveIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
                <Divider />
                <FieldArray name={`costing[${index}].costs`}>
                  {({ push: pushCost, remove: removeCost }) => (
                    <>
                      <CardHeader
                        title="COSTS"
                        action={
                          <Tooltip title="Add Cost">
                            <IconButton
                              onClick={() =>
                                pushCost({
                                  title: '',
                                  type: CostingType.ABSOLUTE,
                                  defaultPriceId: '',
                                  quantityType: QuantityType.STATIC,
                                  quantity: 0,
                                  percentage: 0,
                                  percentageOf: [],
                                  rules: [],
                                })
                              }
                            >
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                        }
                        slotProps={{ title: { variant: 'h4' } }}
                      />
                      <Stack gap={1}>
                        {values.costing[index].costs.map((_c, cIdx) => (
                          <Card
                            key={`costing-${index}-cost-${cIdx}`}
                            variant="outlined"
                          >
                            <CardContent>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <FormTextField
                                  required
                                  name={`costing[${index}].costs[${cIdx}].title`}
                                  label="Title"
                                  // disabled={isPending}
                                  sx={{ width: 320 }}
                                />
                                <Box>
                                  <Tooltip title="Remove Cost">
                                    <IconButton
                                      onClick={() => removeCost(cIdx)}
                                    >
                                      <RemoveIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                            </CardContent>

                            <CardHeader
                              title="PRICE"
                              slotProps={{ title: { variant: 'h4' } }}
                            />
                            <CardContent>
                              <Stack gap={2}>
                                <FormToggleButton
                                  name={`costing[${index}].costs[${cIdx}].type`}
                                  options={[
                                    {
                                      value: CostingType.ABSOLUTE,
                                      label: 'Absolute',
                                    },
                                    {
                                      value: CostingType.PERCENTAGE,
                                      label: 'Percentage',
                                    },
                                  ]}
                                  buttonWidth={100}
                                />
                                {values.costing[index].costs[cIdx].type ===
                                  CostingType.ABSOLUTE && (
                                  <FormAutocomplete
                                    name={`costing[${index}].costs[${cIdx}].defaultPriceId`}
                                    label="Default Price Item"
                                    // disabled={isPending}
                                    options={priceListOptions}
                                  />
                                )}
                                {values.costing[index].costs[cIdx].type ===
                                  CostingType.PERCENTAGE && (
                                  <>
                                    <FormNumericFormat
                                      name={`costing[${index}].costs[${cIdx}].percentage`}
                                      label="Percentage"
                                      suffix=" %"
                                      sx={{ width: 320 }}
                                    />
                                    <FormSelect
                                      name={`costing[${index}].costs[${cIdx}].percentageOf`}
                                      label="Percentage Of"
                                      options={percentageOfOptions}
                                      multiple
                                    />
                                  </>
                                )}
                              </Stack>
                            </CardContent>
                            <CardHeader
                              title="QUANTITY"
                              slotProps={{ title: { variant: 'h4' } }}
                            />
                            <CardContent>
                              <Stack gap={2}>
                                <FormToggleButton
                                  name={`costing[${index}].costs[${cIdx}].quantityType`}
                                  options={[
                                    {
                                      value: QuantityType.STATIC,
                                      label: 'Static',
                                    },
                                    {
                                      value: QuantityType.FORMULA,
                                      label: 'Formula',
                                    },
                                  ]}
                                  buttonWidth={100}
                                />
                                {values.costing[index].costs[cIdx]
                                  .quantityType == QuantityType.STATIC ? (
                                  <FormTextField
                                    name={`costing[${index}].costs[${cIdx}].quantity`}
                                    label="Quantity"
                                    type="number"
                                    sx={{ width: 350 }}
                                  />
                                ) : (
                                  <FormFormulaBuilder
                                    name={`costing[${index}].costs[${cIdx}].quantity`}
                                    scopeFields={formulaScopeFieldOptions}
                                  />
                                )}
                              </Stack>
                            </CardContent>
                            <FieldArray
                              name={`costing[${index}].costs[${cIdx}].rules`}
                            >
                              {({ push: pushRule, remove: removeRule }) => (
                                <Stack gap={2} p={1}>
                                  <CardHeader
                                    title="OVERRIDES"
                                    slotProps={{ title: { variant: 'h4' } }}
                                    action={
                                      <IconButton
                                        onClick={() =>
                                          pushRule({
                                            conditions: [
                                              {
                                                scopeField: '',
                                                operator: '>=',
                                                value: '',
                                              },
                                            ],
                                            output: {
                                              priceId: '',
                                              quantityType: QuantityType.STATIC,
                                              quantity: '',
                                            },
                                          })
                                        }
                                      >
                                        <AddIcon />
                                      </IconButton>
                                    }
                                  />
                                  {(
                                    values.costing[index].costs[cIdx].rules ||
                                    []
                                  ).map((rule, idx) => (
                                    <Card
                                      key={`costing-${index}-cost-${cIdx}-rule-${idx}`}
                                    >
                                      <FieldArray
                                        name={`costing[${index}].costs[${cIdx}].rules[${idx}].conditions`}
                                      >
                                        {({
                                          push: pushCondition,
                                          remove: removeCondition,
                                        }) => (
                                          <Stack gap={1}>
                                            <CardHeader
                                              title="CONDITIONS"
                                              slotProps={{
                                                title: { variant: 'h4' },
                                              }}
                                              action={
                                                <>
                                                  <Button
                                                    onClick={() =>
                                                      pushCondition({
                                                        scopeField: '',
                                                        operator: '>=',
                                                        value: '',
                                                      })
                                                    }
                                                  >
                                                    Add Condition
                                                  </Button>
                                                  <IconButton
                                                    onClick={() =>
                                                      removeRule(idx)
                                                    }
                                                  >
                                                    <CloseIcon />
                                                  </IconButton>
                                                </>
                                              }
                                            />
                                            {(rule.conditions || []).map(
                                              (_, i) => {
                                                const scopeFieldName =
                                                  values.costing?.[index]
                                                    ?.costs[cIdx].rules?.[idx]
                                                    ?.conditions?.[i]
                                                    ?.scopeField;

                                                const selectedScopeField =
                                                  scopeFields.find(
                                                    (s) =>
                                                      lodash.camelCase(
                                                        s.title
                                                      ) === scopeFieldName
                                                  );

                                                return (
                                                  <Box
                                                    key={`costing-${index}-cost-${cIdx}-rule-${idx}-condition-${i}`}
                                                    display="flex"
                                                    gap={1}
                                                    alignItems="center"
                                                    sx={{ p: 1 }}
                                                  >
                                                    <FormAutocomplete
                                                      name={`costing[${index}].costs[${cIdx}].rules[${idx}].conditions[${i}].scopeField`}
                                                      label="Field"
                                                      options={
                                                        scopeFieldOptions
                                                      }
                                                      sx={{ flex: 1 }}
                                                    />
                                                    <FormSelect
                                                      name={`costing[${index}].costs[${cIdx}].rules[${idx}].conditions[${i}].operator`}
                                                      disabled={
                                                        !selectedScopeField
                                                      }
                                                      options={
                                                        selectedScopeField?.type ===
                                                        'string'
                                                          ? operatorOptions.filter(
                                                              (o) =>
                                                                o.value ===
                                                                  'eq' ||
                                                                o.value ===
                                                                  'neq'
                                                            )
                                                          : operatorOptions
                                                      }
                                                      sx={{ flex: 0.25 }}
                                                    />
                                                    {Boolean(
                                                      !selectedScopeField
                                                    ) && (
                                                      <FormTextField
                                                        disabled
                                                        name={`costing[${index}].costs[${cIdx}].rules[${idx}].conditions[${i}].value`}
                                                        label="Value"
                                                        sx={{ flex: 1 }}
                                                      />
                                                    )}
                                                    {Boolean(
                                                      selectedScopeField &&
                                                        selectedScopeField
                                                          ?.options?.length
                                                    ) && (
                                                      <FormSelect
                                                        name={`costing[${index}].costs[${cIdx}].rules[${idx}].conditions[${i}].value`}
                                                        label="Value"
                                                        options={(
                                                          selectedScopeField?.options ||
                                                          []
                                                        )?.map((opt) => ({
                                                          name: opt || '',
                                                          value: opt || '',
                                                        }))}
                                                        sx={{ flex: 1 }}
                                                      />
                                                    )}
                                                    {Boolean(
                                                      selectedScopeField &&
                                                        (!selectedScopeField?.options ||
                                                          !selectedScopeField
                                                            .options.length)
                                                    ) && (
                                                      <FormTextField
                                                        name={`costing[${index}].costs[${cIdx}].rules[${idx}].conditions[${i}].value`}
                                                        label="Value"
                                                        placeholder="Enter value"
                                                        type={
                                                          selectedScopeField?.type ===
                                                          'string'
                                                            ? 'string'
                                                            : 'number'
                                                        }
                                                        sx={{ flex: 1 }}
                                                      />
                                                    )}
                                                    <IconButton
                                                      onClick={() =>
                                                        removeCondition(i)
                                                      }
                                                    >
                                                      <RemoveIcon />
                                                    </IconButton>
                                                  </Box>
                                                );
                                              }
                                            )}
                                          </Stack>
                                        )}
                                      </FieldArray>
                                      <CardHeader
                                        title="OUTPUT"
                                        slotProps={{ title: { variant: 'h4' } }}
                                      />
                                      <CardContent>
                                        <Stack gap={2}>
                                          <FormAutocomplete
                                            name={`costing[${index}].costs[${cIdx}].rules[${idx}].output.priceId`}
                                            label="Override Price Item"
                                            options={priceListOptions}
                                          />
                                          <FormToggleButton
                                            name={`costing[${index}].costs[${cIdx}].rules[${idx}].output.quantityType`}
                                            options={[
                                              {
                                                value: QuantityType.STATIC,
                                                label: 'Static',
                                              },
                                              {
                                                value: QuantityType.FORMULA,
                                                label: 'Formula',
                                              },
                                            ]}
                                            buttonWidth={100}
                                          />
                                          {rule.output?.quantityType ===
                                          QuantityType.STATIC ? (
                                            <FormTextField
                                              name={`costing[${index}].costs[${cIdx}].rules[${idx}].output.quantity`}
                                              label="Override Quantity"
                                              type="number"
                                              sx={{ width: 350 }}
                                            />
                                          ) : (
                                            <FormFormulaBuilder
                                              name={`costing[${index}].costs[${cIdx}].rules[${idx}].output.quantity`}
                                              scopeFields={
                                                formulaScopeFieldOptions
                                              }
                                            />
                                          )}
                                        </Stack>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </Stack>
                              )}
                            </FieldArray>
                          </Card>
                        ))}
                      </Stack>
                    </>
                  )}
                </FieldArray>
              </Card>

              // <Card key={`costing-${index}`} sx={{ p: 1 }}>
              //   <CardHeader
              //     title="PRICING ITEM"
              //     slotProps={{ title: { variant: 'h4' } }}
              //     action={
              //       <IconButton onClick={() => remove(index)}>
              //         <RemoveIcon />
              //       </IconButton>
              //     }
              //   />
              //   <CardContent>
              //     <Stack gap={2}>
              //       <FormTextField
              //         required
              //         name={`costing[${index}].title`}
              //         label="Title"
              //       />
              //       <FormTextField
              //         required
              //         name={`costing[${index}].category`}
              //         label="Category"
              //       />
              //       <FormAutocomplete
              //         name={`costing[${index}].defaultPriceId`}
              //         label="Default Price Item"
              //         // disabled={isPending}
              //         options={priceListOptions}
              //         sx={{ flex: 0.25 }}
              //       />
              //     </Stack>
              //   </CardContent>
              //   <CardHeader
              //     title="DEFAULT QUANTITY"
              //     slotProps={{ title: { variant: 'h4' } }}
              //   />
              //   <CardContent>
              //     <Stack gap={3}>
              //       <FormToggleButton
              //         name={`costing[${index}].quantityType`}
              //         options={[
              //           { value: QuantityType.STATIC, label: 'Static' },
              //           { value: QuantityType.FORMULA, label: 'Formula' },
              //         ]}
              //         buttonWidth={100}
              //       />
              //       {values.costing[index].quantityType ==
              //       QuantityType.STATIC ? (
              //         <FormTextField
              //           name={`costing[${index}].quantity`}
              //           label="Quantity"
              //           type="number"
              //           sx={{ width: 350 }}
              //         />
              //       ) : (
              //         <FormFormulaBuilder
              //           name={`costing[${index}].quantity`}
              //           scopeFields={formulaScopeFieldOptions}
              //         />
              //       )}
              //     </Stack>
              //   </CardContent>
              //   <FieldArray name={`costing[${index}].rules`}>
              //     {({ push: pushRule, remove: removeRule }) => (
              //       <Stack gap={2}>
              //         <CardHeader
              //           title="OVERRIDES"
              //           slotProps={{ title: { variant: 'h4' } }}
              //           action={
              //             <IconButton
              //               onClick={() =>
              //                 pushRule({
              //                   conditions: [
              //                     {
              //                       scopeField: '',
              //                       operator: '>=',
              //                       value: '',
              //                     },
              //                   ],
              //                   output: {
              //                     priceId: '',
              //                     quantityType: QuantityType.STATIC,
              //                     quantity: '',
              //                   },
              //                 })
              //               }
              //             >
              //               <AddIcon />
              //             </IconButton>
              //           }
              //         />
              //         {(values.costing[index].rules || []).map((rule, idx) => (
              //           <Card
              //             key={`costing-${index}-rule-${idx}`}
              //             variant="outlined"
              //           >
              //             <FieldArray
              //               name={`costing[${index}].rules[${idx}].conditions`}
              //             >
              //               {({
              //                 push: pushCondition,
              //                 remove: removeCondition,
              //               }) => (
              //                 <Stack gap={1}>
              //                   <CardHeader
              //                     title="CONDITIONS"
              //                     slotProps={{ title: { variant: 'h4' } }}
              //                     action={
              //                       <>
              //                         <Button
              //                           onClick={() =>
              //                             pushCondition({
              //                               scopeField: '',
              //                               operator: '>=',
              //                               value: '',
              //                             })
              //                           }
              //                         >
              //                           Add Condition
              //                         </Button>
              //                         <IconButton
              //                           onClick={() => removeRule(idx)}
              //                         >
              //                           <CloseIcon />
              //                         </IconButton>
              //                       </>
              //                     }
              //                   />
              //                   {(rule.conditions || []).map((_, i) => {
              //                     const scopeFieldName =
              //                       values.costing?.[index]?.rules?.[idx]
              //                         ?.conditions?.[i]?.scopeField;

              //                     const selectedScopeField = scopeFields.find(
              //                       (s) =>
              //                         lodash.camelCase(s.title) ===
              //                         scopeFieldName
              //                     );

              //                     return (
              //                       <Box
              //                         key={`rule-${idx}-condition-${i}`}
              //                         display="flex"
              //                         gap={1}
              //                         alignItems="center"
              //                         sx={{ p: 1 }}
              //                       >
              //                         <FormAutocomplete
              //                           name={`costing[${index}].rules[${idx}].conditions[${i}].scopeField`}
              //                           label="Field"
              //                           options={scopeFieldOptions}
              //                           sx={{ flex: 1 }}
              //                         />
              //                         <FormSelect
              //                           name={`costing[${index}].rules[${idx}].conditions[${i}].operator`}
              //                           disabled={!selectedScopeField}
              //                           options={
              //                             selectedScopeField?.type === 'string'
              //                               ? operatorOptions.filter(
              //                                   (o) =>
              //                                     o.value === 'eq' ||
              //                                     o.value === 'neq'
              //                                 )
              //                               : operatorOptions
              //                           }
              //                           sx={{ flex: 0.25 }}
              //                         />
              //                         {Boolean(!selectedScopeField) && (
              //                           <FormTextField
              //                             disabled
              //                             name={`costing[${index}].rules[${idx}].conditions[${i}].value`}
              //                             label="Value"
              //                             sx={{ flex: 1 }}
              //                           />
              //                         )}
              //                         {Boolean(
              //                           selectedScopeField &&
              //                             selectedScopeField?.options?.length
              //                         ) && (
              //                           <FormSelect
              //                             name={`costing[${index}].rules[${idx}].conditions[${i}].value`}
              //                             label="Value"
              //                             options={(
              //                               selectedScopeField?.options || []
              //                             )?.map((opt) => ({
              //                               name: opt || '',
              //                               value: opt || '',
              //                             }))}
              //                             sx={{ flex: 1 }}
              //                           />
              //                         )}
              //                         {Boolean(
              //                           selectedScopeField &&
              //                             (!selectedScopeField?.options ||
              //                               !selectedScopeField.options.length)
              //                         ) && (
              //                           <FormTextField
              //                             name={`costing[${index}].rules[${idx}].conditions[${i}].value`}
              //                             label="Value"
              //                             placeholder="Enter value"
              //                             type={
              //                               selectedScopeField?.type ===
              //                               'string'
              //                                 ? 'string'
              //                                 : 'number'
              //                             }
              //                             sx={{ flex: 1 }}
              //                           />
              //                         )}
              //                         <IconButton
              //                           onClick={() => removeCondition(i)}
              //                         >
              //                           <RemoveIcon />
              //                         </IconButton>
              //                       </Box>
              //                     );
              //                   })}
              //                 </Stack>
              //               )}
              //             </FieldArray>
              //             <CardHeader
              //               title="OUTPUT"
              //               slotProps={{ title: { variant: 'h4' } }}
              //             />
              //             <CardContent>
              //               <Stack gap={2}>
              //                 <FormAutocomplete
              //                   name={`costing[${index}].rules[${idx}].output.priceId`}
              //                   label="Override Price Item"
              //                   options={priceListOptions}
              //                 />
              //                 <FormToggleButton
              //                   name={`costing[${index}].rules[${idx}].output.quantityType`}
              //                   options={[
              //                     {
              //                       value: QuantityType.STATIC,
              //                       label: 'Static',
              //                     },
              //                     {
              //                       value: QuantityType.FORMULA,
              //                       label: 'Formula',
              //                     },
              //                   ]}
              //                   buttonWidth={100}
              //                 />
              //                 {rule.output?.quantityType ===
              //                 QuantityType.STATIC ? (
              //                   <FormTextField
              //                     name={`costing[${index}].rules[${idx}].output.quantity`}
              //                     label="Override Quantity"
              //                     type="number"
              //                     sx={{ width: 350 }}
              //                   />
              //                 ) : (
              //                   <FormFormulaBuilder
              //                     name={`costing[${index}].rules[${idx}].output.quantity`}
              //                     scopeFields={formulaScopeFieldOptions}
              //                   />
              //                 )}
              //               </Stack>
              //             </CardContent>
              //           </Card>
              //         ))}
              //       </Stack>
              //     )}
              //   </FieldArray>
              // </Card>
            ))}
            <Card variant="outlined">
              <Button
                endIcon={<AddIcon />}
                variant="contained"
                size="large"
                fullWidth
                onClick={() =>
                  push({
                    title: '',
                    defaultPriceId: '',
                    category: '',
                    quantityType: QuantityType.STATIC,
                    quantity: 0,
                    rules: [],
                  })
                }
              >
                Add
              </Button>
            </Card>
          </Stack>
        </CardGroup>
      )}
    </FieldArray>
  );
}
