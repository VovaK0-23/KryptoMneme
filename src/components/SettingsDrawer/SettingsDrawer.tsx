import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Keyboard } from '@mui/icons-material';
import { Drawer, IconButton, List, ListItem, Tooltip } from '@mui/material';

import { ThemeToggleBtn } from '../ThemeToggleBtn';
import { ShortcutsModal } from '../modals/ShortcutsModal';

export const SettingsDrawer = (props: { open: boolean; onClose: () => void }) => {
  const { open, onClose } = props;
  const navigate = useNavigate();

  const handleOpenShortcuts = () => {
    navigate('/shortcuts');
  };

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
    </Drawer>
  );
};
