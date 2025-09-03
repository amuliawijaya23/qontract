import { array, boolean, InferType, object, string } from 'yup';
import ProjectScopeType from '../enums/project-scope-type';

export function createProjectScopeSchema() {
  return object().shape({
    name: string().required('Required'),
    title: string().required('Required'),
    unit: string().optional(),
    options: array(string()).optional(),
    required: boolean().required('Required'),
    type: string().oneOf(Object.values(ProjectScopeType)).required('Required'),
  });
}

export function createProjectTemplateFormSchema() {
  return object().shape({
    name: string().required('Required'),
    scope: array(createProjectScopeSchema()).required('Required'),
  });
}

export type IProjectTemplateSchema = InferType<
  ReturnType<typeof createProjectTemplateFormSchema>
>;

export type IProjectScopeSchema = InferType<
  ReturnType<typeof createProjectScopeSchema>
>;
