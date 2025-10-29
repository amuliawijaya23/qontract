'use client';
import React, { ReactNode } from 'react';
import { UseFormReturn, FormProvider } from 'react-hook-form';

/* eslint-disable @typescript-eslint/no-explicit-any */
type RHFFormProviderProps = {
  children: ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
};

export default function RHFFormProvider({
  children,
  methods,
  onSubmit,
}: RHFFormProviderProps) {
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmit) onSubmit();
        }}
        autoComplete="on"
      >
        {children}
      </form>
    </FormProvider>
  );
}
