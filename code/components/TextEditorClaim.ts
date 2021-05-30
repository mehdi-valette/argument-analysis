import {
  Command,
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes,
} from '@tiptap/core';
import { Claim as ClaimInterface } from '~/types/seven-steps';

export interface ClaimOptions {
  HTMLAttributes: Record<string, any>;
  id: string;
  from: number;
  to: number;
  claim: string;
}

declare module '@tiptap/core' {
  interface Commands {
    claim: {
      /**
       * Set an claim mark
       */
      setClaim: (attributes: {
        id: string;
        from: number;
        to: number;
        claim: ClaimInterface;
      }) => Command;
      /**
       * Toggle a claim mark
       */
      toggleClaim: () => Command;
      /**
       * Unset a claim mark
       */
      unsetClaim: () => Command;
    };
  }
}

export const starInputRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))$/gm;
export const starPasteRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/gm;
export const underscoreInputRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/gm;
export const underscorePasteRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/gm;

export const Claim = Mark.create<ClaimOptions>({
  name: 'claim',

  defaultOptions: {
    HTMLAttributes: {
      class: 'claim',
    },
    id: '',
    from: -1,
    to: -1,
    claim: '',
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) =>
          (node as HTMLElement).dataset['claim'] !== undefined && null,
      },
    ];
  },

  addAttributes() {
    return {
      id: {
        default: '',
        rendered: false,
      },
      from: {
        default: -1,
        rendered: false,
      },
      to: {
        default: -1,
        rendered: false,
      },
      claim: {
        default: { translation: {}, logic: {} },
        rendered: false,
      },
    };
  },

  renderHTML({ mark, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, {
        title: mark.attrs.claim.translation.default,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setClaim:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark('claim', attributes);
        },
      toggleClaim:
        () =>
        ({ commands }) => {
          return commands.toggleMark('claim');
        },
      unsetClaim:
        () =>
        ({ commands }) => {
          return commands.unsetMark('claim');
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-b': () => this.editor.commands.toggleClaim(),
    };
  },

  addInputRules() {
    return [
      markInputRule(starInputRegex, this.type),
      markInputRule(underscoreInputRegex, this.type),
    ];
  },

  addPasteRules() {
    return [
      markPasteRule(starPasteRegex, this.type),
      markPasteRule(underscorePasteRegex, this.type),
    ];
  },
});