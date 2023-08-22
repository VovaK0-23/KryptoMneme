import { DeepPartial } from '@/types';
import { deepMerge } from '@/utils';

export const Modifiers = {
  alt: 'altKey',
  ctrl: 'ctrlKey',
  meta: 'metaKey',
  shift: 'shiftKey',
  none: '',
} as const;

export type Modifier = (typeof Modifiers)[keyof typeof Modifiers];

export type Shortcut = {
  key: string;
  mod: Modifier;
};

export const shortcutsDefaultState = {
  openSearch: {
    key: 's',
    mod: 'altKey',
  } as Shortcut,
};

export type ShortcutsState = typeof shortcutsDefaultState;

export type UpdateShortcutsAction = {
  type: 'UPD';
  payload: DeepPartial<ShortcutsState>;
};

export type ShortcutsAction = UpdateShortcutsAction;

export const shortcutsReducer = (state: ShortcutsState, action: ShortcutsAction) => {
  switch (action.type) {
    case 'UPD': {
      return { ...deepMerge(state, action.payload) };
    }
  }
};
