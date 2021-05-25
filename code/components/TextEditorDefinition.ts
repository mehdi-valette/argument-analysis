import {
  Command,
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes,
} from '@tiptap/core';

export interface DefinitionOptions {
  HTMLAttributes: Record<string, any>;
  id: string;
  from: number;
  to: number;
  definition: string;
}

declare module '@tiptap/core' {
  interface Commands {
    definition: {
      /**
       * Set a definition mark
       */
      setDefinition: (attributes: {
        id: string;
        from: number;
        to: number;
        definition: string;
      }) => Command;
      /**
       * Toggle a definition mark
       */
      toggleDefinition: () => Command;
      /**
       * Unset a definition mark
       */
      unsetDefinition: () => Command;
    };
  }
}

export const starInputRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))$/gm;
export const starPasteRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/gm;
export const underscoreInputRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/gm;
export const underscorePasteRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/gm;

export const Definition = Mark.create<DefinitionOptions>({
  name: 'definition',

  defaultOptions: {
    HTMLAttributes: {
      class: 'definition',
    },
    id: '',
    from: -1,
    to: -1,
    definition: '',
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (node) =>
          (node as HTMLElement).dataset['definition'] !== undefined && null,
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
      definition: {
        default: '',
        rendered: false,
      },
    };
  },

  renderHTML({ mark, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, {
        title: mark.attrs.definition,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setDefinition:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark('definition', attributes);
        },
      toggleDefinition:
        () =>
        ({ commands }) => {
          return commands.toggleMark('definition');
        },
      unsetDefinition:
        () =>
        ({ commands }) => {
          return commands.unsetMark('definition');
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-b': () => this.editor.commands.toggleDefinition(),
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
