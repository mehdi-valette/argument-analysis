import {
  Command,
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes,
} from '@tiptap/core'

export interface DefinitionOptions {
  HTMLAttributes: Record<string, any>
  definitionId: string
}

declare module '@tiptap/core' {
  interface Commands {
    definition: {
      /**
       * Set a definition mark
       */
      setDefinition: (attributes: { definitionId: string }) => Command
      /**
       * Toggle a definition mark
       */
      toggleDefinition: () => Command
      /**
       * Unset a definition mark
       */
      unsetDefinition: () => Command
    }
  }
}

export const starInputRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))$/gm
export const starPasteRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/gm
export const underscoreInputRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/gm
export const underscorePasteRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/gm

export const Definition = Mark.create<DefinitionOptions>({
  name: 'definition',

  defaultOptions: {
    HTMLAttributes: {
      class: 'definition',
    },
    definitionId: '',
  },

  parseHTML() {
    return [
      {
        tag: 'span',
      },
      {
        tag: 'def',
        getAttrs: (node) =>
          (node as HTMLElement).style.fontWeight !== 'normal' && null,
      },
      {
        style: 'data-definition',
        getAttrs: (value) => true && null,
      },
    ]
  },

  addAttributes() {
    return {
      definitionId: {
        default: '',
        rendered: false,
      },
    }
  },

  renderHTML({ mark, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-definition': mark.attrs.definitionId,
      }),
      0,
    ]
  },

  addCommands() {
    return {
      setDefinition:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark('definition', attributes)
        },
      toggleDefinition:
        () =>
        ({ commands }) => {
          return commands.toggleMark('definition')
        },
      unsetDefinition:
        () =>
        ({ commands }) => {
          return commands.unsetMark('definition')
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-b': () => this.editor.commands.toggleDefinition(),
    }
  },

  addInputRules() {
    return [
      markInputRule(starInputRegex, this.type),
      markInputRule(underscoreInputRegex, this.type),
    ]
  },

  addPasteRules() {
    return [
      markPasteRule(starPasteRegex, this.type),
      markPasteRule(underscorePasteRegex, this.type),
    ]
  },
})
