'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from 'react';

import { FormikProvider, Form, FormikContextType } from 'formik';

interface IFormProvider {
  children: ReactNode;
  value: FormikContextType<any>;
}

export default function FormProvider({ children, value }: IFormProvider) {
  return (
    <FormikProvider value={value}>
      <Form>{children}</Form>
    </FormikProvider>
  );
}
