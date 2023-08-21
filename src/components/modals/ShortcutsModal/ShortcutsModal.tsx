import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export const ShortcutsModal = (props: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}) => {
  const { open, onClose, onSave } = props;
  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle>Shortcuts</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This is the content of the dialog. You can put any content here.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={onSave}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};
