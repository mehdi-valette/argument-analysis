import {
  Command,
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes,
} from '@tiptap/core';

export interface ClarificationOptions {
  HTMLAttributes: Record<string, any>;
  id: string;
  from: number;
  to: number;
  clarification: string;
}

declare module '@tiptap/core' {
  interface Commands {
    clarification: {
      /**
       * Set a clarification mark
       */
      setClarification: (attributes: {
        id: string;
        from: number;
        to: number;
        clarification: string;
      }) => Command;
      /**
       * Toggle a clarification mark
       */
      toggleClarification: () => Command;
      /**
       * Unset a clarification mark
       */
      unsetClarification: () => Command;
    };
  }
}

export const starInputRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))$/gm;
export const starPasteRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/gm;
export const underscoreInputRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/gm;
export const underscorePasteRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/gm;

export const Clarification = Mark.create<ClarificationOptions>({
  name: 'clarification',

  defaultOptions: {
    HTMLAttributes: {
      class: 'clarification',
    },
    id: '',
    from: -1,
    to: -1,
    clarification: '',
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) =>
          (node as HTMLElement).dataset['clarification'] !== undefined && null,
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
      clarification: {
        default: '',
        rendered: false,
      },
    };
  },

  renderHTML({ mark, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, {
        title: mark.attrs.clarification,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setClarification:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark('clarification', attributes);
        },
      toggleClarification:
        () =>
        ({ commands }) => {
          return commands.toggleMark('clarification');
        },
      unsetClarification:
        () =>
        ({ commands }) => {
          return commands.unsetMark('clarification');
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-b': () => this.editor.commands.toggleClarification(),
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
