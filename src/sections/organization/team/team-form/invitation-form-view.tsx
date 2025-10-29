import React, { useCallback, useMemo, useState } from 'react';

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import CustomModal from '@/components/modal/custom-modal';

import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  RHFFormProvider,
  RHFSelect,
  RHFTextField,
} from '@/components/react-hook-form';

import UserOrganizationRoles from '@/validator/enums/user-organization-roles';
import {
  createInvitationFormSchema,
  IInvitationSchema,
} from '@/validator/forms/team-form-schema';

import useCreateInvitation from '@/hooks/service/member/use-create-invitation';
import useForms from '@/hooks/use-forms';
import { enqueueSnackbar } from 'notistack';
import { useBoolean } from '@/hooks';

export default function InvitationFormView() {
  const { openInviteForm } = useForms();

  const [code, setCode] = useState<string>('');
  const openCodeModal = useBoolean();

  const validationSchema = useMemo(() => createInvitationFormSchema(), []);

  const defaultValues = useMemo(
    () => ({ emails: [{ email: '' }], role: UserOrganizationRoles.Member }),
    []
  );

  const methods = useForm<IInvitationSchema>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { reset, handleSubmit, control } = methods;

  const { mutate: createInvitation, isPending } = useCreateInvitation({
    onSuccess: (data) => {
      setCode(data?.code || '');
      reset();
      enqueueSnackbar({
        variant: 'success',
        message: 'Invitation successfuly created',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      openInviteForm.onFalse();
      openCodeModal.onTrue();
    },
    onError: (e) => {
      enqueueSnackbar({
        variant: 'error',
        message: e.message,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    },
  });

  const { fields, append, remove } = useFieldArray<IInvitationSchema>({
    control,
    name: 'emails',
  });

  const handleCreateInvite = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      handleSubmit(async (data: IInvitationSchema) => {
        await createInvitation(data);
      })();
    },
    [handleSubmit, createInvitation]
  );

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      reset();
      openInviteForm.onFalse();
    },
    [openInviteForm, reset]
  );

  const handleCloseCode = useCallback(() => {
    setCode('');
    openCodeModal.onFalse();
  }, [openCodeModal]);

  const handleCopyCode = useCallback(
    () => navigator.clipboard.writeText(code),
    [code]
  );

  return (
    <>
      <CustomModal
        title="Invite User"
        subtitle=""
        open={openInviteForm.value}
        onClose={openInviteForm.onFalse}
        size="sm"
        action={
          <>
            <Button color="error" disabled={isPending} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              loading={isPending}
              loadingPosition="start"
              onClick={handleCreateInvite}
            >
              Confirm
            </Button>
          </>
        }
      >
        <RHFFormProvider methods={methods}>
          <Stack gap={4}>
            <Stack gap={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ flexGrow: 1 }}>Users</Typography>
                <IconButton onClick={() => append({ email: '' })}>
                  <AddIcon />
                </IconButton>
              </Box>
              {fields.map((email, index) => (
                <Box key={`email-${index}`} sx={{ display: 'flex' }}>
                  <RHFTextField
                    name={`emails[${index}].email`}
                    label="Email"
                    sx={{ flexGrow: 1 }}
                    labelMode="inline"
                    slotProps={
                      fields.length > 1
                        ? {
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    size="small"
                                    onClick={(
                                      e: React.MouseEvent<HTMLButtonElement>
                                    ) => {
                                      e.preventDefault();
                                      remove(index);
                                    }}
                                  >
                                    <RemoveIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            },
                          }
                        : {}
                    }
                    disabled={isPending}
                  />
                </Box>
              ))}
            </Stack>
            <RHFSelect
              required
              name="role"
              label="Role"
              placeholder="Member"
              options={Object.values(UserOrganizationRoles)
                .filter((r) => r !== UserOrganizationRoles.Owner)
                .map((r) => ({
                  value: r,
                  name: r[0].toUpperCase() + r.substring(1),
                }))}
              disabled={isPending}
            />
          </Stack>
        </RHFFormProvider>
      </CustomModal>
      <CustomModal
        size="sm"
        title="Invitation Code"
        subtitle="Use the invitation code below to invite new members to your
            organization:"
        open={openCodeModal.value}
        onClose={handleCloseCode}
      >
        <Stack gap={1}>
          <Button onClick={handleCopyCode}>{code}</Button>
        </Stack>
      </CustomModal>
    </>
  );
}
