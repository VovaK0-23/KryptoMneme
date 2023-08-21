import React, { useState } from 'react';

import { Keyboard } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItem,
  Tooltip,
} from '@mui/material';

import { ThemeToggleBtn } from '../ThemeToggleBtn';

export const SettingsDrawer = (props: { open: boolean; onClose: () => void }) => {
  const { open, onClose } = props;

  const [openShortcuts, setOpenShortcuts] = useState(false);

  const handleOpenShortcuts = () => setOpenShortcuts(true);
  const handleCloseShortcuts = () => setOpenShortcuts(false);

  return (
    <Drawer anchor='right' open={open} onClose={onClose}>
      <List>
        <Tooltip title='Theme' placement='left'>
          <ListItem>
            <ThemeToggleBtn />
          </ListItem>
        </Tooltip>

        <Tooltip title='Shortcuts' placement='left'>
          <ListItem>
            <IconButton onClick={handleOpenShortcuts}>
              <Keyboard />
            </IconButton>
          </ListItem>
        </Tooltip>
      </List>

      <Dialog open={openShortcuts} onClose={handleCloseShortcuts} fullScreen>
        <DialogTitle>Dialog Title</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This is the content of the dialog. You can put any content here.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseShortcuts} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleCloseShortcuts} color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};
