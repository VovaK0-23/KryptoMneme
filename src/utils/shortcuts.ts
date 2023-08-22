import { Shortcut } from '@/reducers/shortcutsReducer';

export const matchesShortcut = (event: KeyboardEvent, shortcut: Shortcut) => {
  return event.key === shortcut.key && (!shortcut.mod || !!event[shortcut.mod]);
};
