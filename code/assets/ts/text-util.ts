import { TextExtension, TextRange } from '@/types/seven-steps';
import { Editor } from '@tiptap/core';

/** check whether a text selected in a new clarification already exists */
export function rangeExists(
  clarificationList: TextExtension[],
  newClarification: TextExtension
) {
  let returnValue = true;

  // aggregate all the ranges in the "clarification" database
  const allRange: TextRange[] = [];
  clarificationList.forEach((clarification) => {
    allRange.push(...clarification.range);
  });

  // verify if one of the ranges in the new selection
  // overlaps with an existing range
  const overlap = newClarification.range.find((newRange) => {
    // look for a range that overlaps
    const overlappingRange = allRange.find(
      (range) => !(newRange.to <= range.from || newRange.from >= range.to)
    );

    // if overlapping range is not undefined
    // that means we found a range that overlaps
    return overlappingRange !== undefined;
  });

  // add the clarification if there's no overlap with an existing range
  if (overlap === undefined) {
    returnValue = false;
  }

  return returnValue;
}

/** get the clarifications from a Tiptap editor */
export function getClarificationEditor(editor: Editor) {
  const root = editor.getJSON();
  const elementList: Record<string, any>[] = [root];
  const clarificationMap = new Map<
    string,
    { id: string; from: number; to: number; clarification: string }
  >();

  for (const element of elementList) {
    // the element is of type "block", add its children to the nodes' list
    if (element.content !== undefined) {
      elementList.push(...element.content);

      // the element is of type text and has some marks, analyse the marks
    } else if (element.type === 'text' && element.marks !== undefined) {
      // for each "clarification" mark
      element.marks
        .filter((m: { type: string }) => m.type === 'clarification')
        .forEach((mark: any) => {
          clarificationMap.set(`${mark.attrs.from}-${mark.attrs.to}`, {
            id: mark.attrs.id,
            from: mark.attrs.from,
            to: mark.attrs.to,
            clarification: mark.attrs.clarification,
          });
        });
    }
  }

  return clarificationMap;
}

/** get the claims from a Tiptap editor */
export function getClaimEditor(editor: Editor) {
  const root = editor.getJSON();
  const elementList: Record<string, any>[] = [root];
  const clarificationMap = new Map<
    string,
    { id: string; from: number; to: number; number: number }
  >();

  for (const element of elementList) {
    // the element is of type "block", add its children to the nodes' list
    if (element.content !== undefined) {
      elementList.push(...element.content);

      // the element is of type text and has some marks, analyse the marks
    } else if (element.type === 'text' && element.marks !== undefined) {
      // for each "clarification" mark
      element.marks
        .filter((m: { type: string }) => m.type === 'claim')
        .forEach((mark: any) => {
          clarificationMap.set(`${mark.attrs.from}-${mark.attrs.to}`, {
            id: mark.attrs.id,
            from: mark.attrs.from,
            to: mark.attrs.to,
            number: mark.attrs.number,
          });
        });
    }
  }

  return clarificationMap;
}
