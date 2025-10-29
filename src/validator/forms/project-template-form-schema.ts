import { array, boolean, InferType, mixed, number, object, string } from 'yup';
import ProjectScopeType from '../enums/project-scope-type';
import OperatorType from '../enums/operator-type';
import QuantityType from '../enums/quantity-type';
import CostingType from '../enums/costing-type';

export function creaetScopeFormSchema() {
  return object().shape({
    title: string().required('Required'),
    unit: string().when('type', {
      is: (v: ProjectScopeType) => v === ProjectScopeType.Number,
      then: () => string().required('Required'),
      otherwise: () => string().notRequired(),
    }),
    options: array(
      object().shape({ value: string().required('Required') })
    ).optional(),
    required: boolean().required('Required'),
    type: string().oneOf(Object.values(ProjectScopeType)).required('Required'),
  });
}

export function createScopeSchema() {
  return object().shape({
    title: string().required('Required'),
    unit: string().optional(),
    options: array(string()).optional(),
    required: boolean().required('Required'),
    type: string().oneOf(Object.values(ProjectScopeType)).required('Required'),
  });
}

export function createProjectScopeSchema() {
  return object().shape({
    category: string().required('Required'),
    scopes: array(createScopeSchema())
      .min(1, 'Add at least one scope')
      .required('Required'),
  });
}

function createConditionSchema() {
  return object().shape({
    scopeField: string().required('Required'),
    operator: string().oneOf(Object.values(OperatorType)).required('Required'),
    value: mixed()
      .test(
        'is-string-or-number',
        'Value must be a string or number',
        (val) => typeof val === 'string' || typeof val === 'number'
      )
      .required('Required'),
  });
}

function createOutputSchema() {
  return object().shape({
    priceId: string().optional(),
    quantityType: string()
      .oneOf(Object.values(QuantityType))
      .required('Required')
      .default(QuantityType.STATIC),
    quantity: mixed()
      .when('quantityType', {
        is: (v: QuantityType) => v === QuantityType.STATIC,
        then: () =>
          number().typeError('Quantity must be a number').required('Required'),
        otherwise: () =>
          string()
            .typeError('Quantity must be a valid string formula')
            .required('Required'),
      })
      .optional(),
  });
}

function createRulesSchema() {
  return object().shape({
    conditions: array(createConditionSchema()).required(
      'At least one condition is required'
    ),
    output: createOutputSchema(),
  });
}

export function createProjectCostSchema() {
  return object().shape({
    title: string().required('Required'),
    type: string().oneOf(Object.values(CostingType)).required('Required'),
    defaultPriceId: mixed().when('type', {
      is: (v: CostingType) => v === CostingType.ABSOLUTE,
      then: () => string().required('Required'),
      otherwise: () => mixed().notRequired(),
    }),
    quantityType: string()
      .oneOf(Object.values(QuantityType))
      .required('Required')
      .default(QuantityType.STATIC),
    quantity: mixed()
      .when('quantityType', {
        is: (v: QuantityType) => v === QuantityType.STATIC,
        then: () =>
          number().typeError('Quantity must be a number').required('Required'),
        otherwise: () =>
          string()
            .typeError('Quantity must be a valid string formula')
            .required('Required'),
      })
      .required('Required'),
    percentage: mixed().when('type', {
      is: (v: CostingType) => v === CostingType.PERCENTAGE,
      then: () =>
        number()
          .min(0, 'Must be positive')
          .max(100, 'Cannot exceed 100%')
          .required('Required'),
      otherwise: () => mixed().notRequired(),
    }),
    percentageOf: mixed().when('type', {
      is: (v: CostingType) => v === CostingType.PERCENTAGE,
      then: () => array(string()).min(1, 'Select at least one category'),
      otherwise: () => mixed().notRequired(),
    }),
    rules: array(createRulesSchema()).optional(),
  });
}

export function createProjectCostingSchema() {
  return object().shape({
    category: string().required('Required'),
    costs: array(createProjectCostSchema())
      .min(1, 'Add at least one cost item')
      .required('Required'),
  });
}

export function createProjectQuotationSchema() {
  return object().shape({
    title: string().required('Required'),
    category: string().required('Required'),
  });
}

export function createProjectTemplateFormSchema() {
  return object().shape({
    name: string().required('Required'),
    deliverables: array(createProjectScopeSchema())
      .min(1, 'Add at least one deliverable')
      .required('Required'),
    costing: array(createProjectCostingSchema())
      .min(1, 'Add at least one Cost')
      .required('Required'),
    quotation: array(createProjectQuotationSchema()).required('Required'),
  });
}

export function createProjectTemplateScopeSchema() {
  return object().shape({
    name: string().required('Required'),
    deliverables: array(createProjectScopeSchema())
      .min(1, 'Add at least one deliverable')
      .required('Required'),
  });
}

export function createProjectTemplateCostingSchema() {
  return object().shape({
    costing: array(createProjectCostingSchema())
      .min(1, 'Add at least one Cost')
      .required('Required'),
  });
}

export function createProjectTemplateQuotationSchema() {
  return object().shape({
    quotation: array(createProjectQuotationSchema()).required('Required'),
  });
}

export function createProjectTemplateFormStepSchema() {
  return [
    createProjectTemplateScopeSchema(),
    createProjectTemplateCostingSchema(),
    createProjectQuotationSchema(),
  ];
}

export type IProjectTemplateSchema = InferType<
  ReturnType<typeof createProjectTemplateFormSchema>
>;

export type IScopeSchema = InferType<ReturnType<typeof createScopeSchema>>;
export type IProjectScopeSchema = InferType<
  ReturnType<typeof createProjectScopeSchema>
>;

export type IConditionSchema = InferType<
  ReturnType<typeof createConditionSchema>
>;
export type IOutputSchema = InferType<ReturnType<typeof createOutputSchema>>;
export type IRuleSchema = InferType<ReturnType<typeof createRulesSchema>>;
export type ICostSchema = InferType<ReturnType<typeof createProjectCostSchema>>;
export type IProjectCostingSchema = InferType<
  ReturnType<typeof createProjectCostingSchema>
>;

export type IProjectQuotationSchema = InferType<
  ReturnType<typeof createProjectQuotationSchema>
>;
