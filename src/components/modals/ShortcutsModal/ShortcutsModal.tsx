import React, { ChangeEvent, useContext, useReducer } from 'react';

import { cloneDeep } from 'lodash';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';

import { ConfirmationContext } from '@/contexts/ConfirmationContext/ConfirmationContext';
import { ShortcutsContext } from '@/contexts/ShortcutsContext';

import {
  Modifiers,
  ShortcutsState,
  shortcutsDefaultState,
  shortcutsReducer,
} from '@/reducers/shortcutsReducer';
import { DeepPartial } from '@/types';

export const ShortcutsModal = () => {
  const { shortcuts, updateShortcuts } = useContext(ShortcutsContext);
  const { confirmCustom } = useContext(ConfirmationContext);
  const [localShortcuts, dispatchLocalShortcuts] = useReducer(
    shortcutsReducer,
    cloneDeep(shortcuts)
  );
  const navigate = useNavigate();

  const updateLocalShortcuts = (payload: DeepPartial<ShortcutsState>) => {
    dispatchLocalShortcuts({
      type: 'UPD',
      payload,
    });
  };

  const handleKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateLocalShortcuts({
      [event.target.name]: { key: event.target.value },
    });
  };

  const handleModChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateLocalShortcuts({
      [event.target.name]: { mod: event.target.value },
    });
  };

  const handleClose = () => {
    updateLocalShortcuts(shortcuts);
    navigate(-2);
  };

  const handleSave = () => {
    updateShortcuts(localShortcuts);
    navigate(-2);
  };

  const handleDefaultClick = async () => {
    if (
      await confirmCustom('Restore Defaults', 'Are you sure you want to restore default shortcuts?')
    ) {
      updateLocalShortcuts(shortcutsDefaultState);
      updateShortcuts(shortcutsDefaultState);
    }
  };

  return (
    <Dialog open={true} onClose={handleClose} fullScreen>
      <DialogTitle>Shortcuts</DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: '0.5rem' }}>Open Search</DialogContentText>
        <Grid container spacing={2}>
          <Grid item sx={{ minWidth: '6rem' }} xs={6}>
            <TextField
              fullWidth
              label='Key'
              name='openSearch'
              onChange={handleKeyChange}
              value={localShortcuts.openSearch.key}
            />
          </Grid>
          <Grid item sx={{ minWidth: '6rem' }} xs={6}>
            <TextField
              fullWidth
              label='Modifier'
              name='openSearch'
              onChange={handleModChange}
              select
              value={localShortcuts.openSearch.mod}
            >
              {Object.entries(Modifiers).map(([name, value]) => (
                <MenuItem key={name} value={value}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Button onClick={handleDefaultClick}>Default</Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant='contained'>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
