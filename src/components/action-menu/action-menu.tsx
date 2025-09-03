import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import React, { useCallback, useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';

interface IActionMenu {
  id: string;
  disabled: boolean;
}

export default function ActionMenu({ id, disabled = false }: IActionMenu) {
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

  const handleEditClick = useCallback(() => {
    console.log('ID: ', id);
  }, [id]);

  return (
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
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
      </Menu>
    </Box>
  );
}
