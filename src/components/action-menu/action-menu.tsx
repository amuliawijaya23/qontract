import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useBoolean } from '@/hooks';
import CustomModal from '../modal/custom-modal';

interface IActionMenu {
  id: string;
  disabled: boolean;
  status?: boolean;
  isDeleted?: boolean;
  onEdit?: (id: string) => void;
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ActionMenu({
  id,
  disabled = false,
  status,
  isDeleted,
  onEdit,
  onArchive,
  onUnarchive,
  onDelete,
}: IActionMenu) {
  const openDialog = useBoolean();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setAnchorEl(null);
    },
    []
  );

  const handleEditClick = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      onEdit?.(id);
      handleClose(e);
    },
    [id, handleClose, onEdit]
  );

  const handleArchiveClick = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      onArchive?.(id);
      handleClose(e);
    },
    [id, onArchive, handleClose]
  );

  const handleUnarchiveClick = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      onUnarchive?.(id);
      handleClose(e);
    },
    [id, onUnarchive, handleClose]
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      openDialog.onTrue();
      handleClose(e);
    },
    [openDialog, handleClose]
  );

  const handleConfirmDelete = useCallback(() => {
    onDelete?.(id);
    openDialog.onFalse();
  }, [id, openDialog, onDelete]);

  return (
    <>
      <CustomModal
        open={openDialog.value}
        onClose={openDialog.onFalse}
        title="Delete Confirmation"
        subtitle="This Action Will Permanently Your Data"
        action={
          <>
            <Button onClick={openDialog.onFalse}>Cancel</Button>
            <Button color="error" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <Typography variant="body1">
          This action is irreversible. Do you want to continue?
        </Typography>
      </CustomModal>
      <Box>
        <IconButton onClick={handleOpen} disabled={disabled}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          slotProps={{ paper: { sx: { minWidth: 100 } } }}
        >
          {onEdit && <MenuItem onClick={handleEditClick}>Edit</MenuItem>}
          {onArchive && status === true && (
            <MenuItem onClick={handleArchiveClick}>Archive</MenuItem>
          )}
          {onUnarchive && status === false && (
            <MenuItem onClick={handleUnarchiveClick}>Unarchive</MenuItem>
          )}
          {onDelete && isDeleted === false && (
            <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
          )}
        </Menu>
      </Box>
    </>
  );
}
