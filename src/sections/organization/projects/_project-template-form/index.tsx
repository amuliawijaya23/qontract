import React from 'react';

import ProjectTemplateFormProvider from './project-template-form-provider';
import ProjectTemplateFormView from './project-template-form';

export default function ProjectTemplateForm() {
  return (
    <ProjectTemplateFormProvider>
      <ProjectTemplateFormView />
    </ProjectTemplateFormProvider>
  );
}
