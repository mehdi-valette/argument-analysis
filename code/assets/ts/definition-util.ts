import { TextDefinition, TextRange } from '@/types/seven-steps';
import { Editor } from '@tiptap/core';
import { cloneDeep } from 'lodash';

/** check whether a text selected in a new definition already exists */
export function definitionExists(
  definitionList: TextDefinition[],
  newDefinition: TextDefinition
) {
  let returnValue = true;

  // aggregate all the ranges in the "definition" database
  const allRange: TextRange[] = [];
  definitionList.forEach((definition) => {
    allRange.push(...definition.range);
  });

  // verify if one of the ranges in the new selection
  // overlaps with an existing range
  const overlap = newDefinition.range.find((newRange) => {
    // look for a range that overlaps
    const overlappingRange = allRange.find(
      (range) => !(newRange.to <= range.from || newRange.from >= range.to)
    );

    // if overlapping range is not undefined
    // that means we found a range that overlaps
    return overlappingRange !== undefined;
  });

  // add the definition if there's no overlap with an existing range
  if (overlap === undefined) {
    returnValue = false;
  }

  return returnValue;
}

/** get the definitions from a Tiptap editor */
export function getDefinitionEditorOld(editor: Editor) {
  const root = editor.getJSON();
  const elementList: Record<string, any>[] = [root];
  const definitionMap = new Map<string, TextDefinition>();

  for (const element of elementList) {
    // the element is of type "block", add its children to the nodes' list
    if (element.content !== undefined) {
      elementList.push(...element.content);

      // the element is of type text and has some marks, analyse the marks
    } else if (element.type === 'text' && element.marks !== undefined) {
      // for each "definition" mark
      const definitions = element.marks
        .filter((m: { type: string }) => m.type === 'definition')
        .forEach((mark: any) => {
          // get or create the basic definition into definitionMap
          let definition = definitionMap.get(mark.attrs.id);

          if (definition === undefined) {
            definition = {
              localId: mark.attrs.id,
              definition: mark.attrs.definition,
              range: [],
            };

            definitionMap.set(mark.attrs.id, definition);
          }

          // push the range to the definition
          definition.range.push({
            from: mark.attrs.from,
            to: mark.attrs.to,
            text: element.text,
          });
        });
    }
  }

  return [...definitionMap.values()];
}

/** get the definitions from a Tiptap editor */
export function getDefinitionEditor(editor: Editor) {
  const root = editor.getJSON();
  const elementList: Record<string, any>[] = [root];
  const definitionMap = new Map<
    string,
    { id: string; from: number; to: number; definition: string }
  >();

  for (const element of elementList) {
    // the element is of type "block", add its children to the nodes' list
    if (element.content !== undefined) {
      elementList.push(...element.content);

      // the element is of type text and has some marks, analyse the marks
    } else if (element.type === 'text' && element.marks !== undefined) {
      // for each "definition" mark
      const definitions = element.marks
        .filter((m: { type: string }) => m.type === 'definition')
        .forEach((mark: any) => {
          definitionMap.set(`${mark.attrs.from}-${mark.attrs.to}`, {
            id: mark.attrs.id,
            from: mark.attrs.from,
            to: mark.attrs.to,
            definition: mark.attrs.definition,
          });

          // // get or create the basic definition into definitionMap
          // let definition = definitionMap.get(mark.attrs.id);

          // if (definition === undefined) {
          //   definition = {
          //     localId: mark.attrs.id,
          //     definition: mark.attrs.definition,
          //     range: [],
          //   };

          //   definitionMap.set(mark.attrs.id, definition);
          // }

          // // push the range to the definition
          // definition.range.push({
          //   from: mark.attrs.from,
          //   to: mark.attrs.to,
          //   text: element.text,
          // });
        });
    }
  }

  return definitionMap;
}

/** indicate if a definition already exists */
export function definitionExistsOld(
  editor: Editor,
  definitionRange: TextDefinition
) {
  let returnValue = false;
  const root = editor.getJSON();
  const elementList: Record<string, any>[] = [root];

  for (const element of elementList) {
    // the element is of type "block", add its children to the nodes' list
    if (element.content !== undefined) {
      elementList.push(...element.content);

      // the element is of type text and has some marks, analyse the marks
    } else if (element.type === 'text' && element.marks !== undefined) {
      // for each "definition" mark, verify if the new range is within that definition
      const definitions = element.marks
        .filter((m: { type: string }) => m.type === 'definition')
        .forEach((element: any) => {
          if (
            element.attrs.from < definitionRange.range[0].to &&
            element.attrs.to > definitionRange.range[0].from
          ) {
            returnValue = true;
          }
        });
    }
  }

  return returnValue;
}
