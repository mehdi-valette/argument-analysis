import { TextExtension, TextRange } from '@/types/seven-steps';
import { Editor } from '@tiptap/core';

/** check whether a text selected in a new clarification already exists */
export function clarificationExists(
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
// export function getClarificationEditorOld(editor: Editor) {
//   const root = editor.getJSON();
//   const elementList: Record<string, any>[] = [root];
//   const clarificationMap = new Map<string, TextClarification>();

//   for (const element of elementList) {
//     // the element is of type "block", add its children to the nodes' list
//     if (element.content !== undefined) {
//       elementList.push(...element.content);

//       // the element is of type text and has some marks, analyse the marks
//     } else if (element.type === 'text' && element.marks !== undefined) {
//       // for each "clarification" mark
//       const clarifications = element.marks
//         .filter((m: { type: string }) => m.type === 'clarification')
//         .forEach((mark: any) => {
//           // get or create the basic clarification into clarificationMap
//           let clarification = clarificationMap.get(mark.attrs.id);

//           if (clarification === undefined) {
//             clarification = {
//               localId: mark.attrs.id,
//               clarification: mark.attrs.clarification,
//               range: [],
//             };

//             clarificationMap.set(mark.attrs.id, clarification);
//           }

//           // push the range to the clarification
//           clarification.range.push({
//             from: mark.attrs.from,
//             to: mark.attrs.to,
//             text: element.text,
//           });
//         });
//     }
//   }

//   return [...clarificationMap.values()];
// }

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
      const clarifications = element.marks
        .filter((m: { type: string }) => m.type === 'clarification')
        .forEach((mark: any) => {
          clarificationMap.set(`${mark.attrs.from}-${mark.attrs.to}`, {
            id: mark.attrs.id,
            from: mark.attrs.from,
            to: mark.attrs.to,
            clarification: mark.attrs.clarification,
          });

          // // get or create the basic clarification into clarificationMap
          // let clarification = clarificationMap.get(mark.attrs.id);

          // if (clarification === undefined) {
          //   clarification = {
          //     localId: mark.attrs.id,
          //     clarification: mark.attrs.clarification,
          //     range: [],
          //   };

          //   clarificationMap.set(mark.attrs.id, clarification);
          // }

          // // push the range to the clarification
          // clarification.range.push({
          //   from: mark.attrs.from,
          //   to: mark.attrs.to,
          //   text: element.text,
          // });
        });
    }
  }

  return clarificationMap;
}

/** indicate if a clarification already exists */
// export function clarificationExistsOld(
//   editor: Editor,
//   clarificationRange: TextClarification
// ) {
//   let returnValue = false;
//   const root = editor.getJSON();
//   const elementList: Record<string, any>[] = [root];

//   for (const element of elementList) {
//     // the element is of type "block", add its children to the nodes' list
//     if (element.content !== undefined) {
//       elementList.push(...element.content);

//       // the element is of type text and has some marks, analyse the marks
//     } else if (element.type === 'text' && element.marks !== undefined) {
//       // for each "clarification" mark, verify if the new range is within that clarification
//       const clarifications = element.marks
//         .filter((m: { type: string }) => m.type === 'clarification')
//         .forEach((element: any) => {
//           if (
//             element.attrs.from < clarificationRange.range[0].to &&
//             element.attrs.to > clarificationRange.range[0].from
//           ) {
//             returnValue = true;
//           }
//         });
//     }
//   }

//   return returnValue;
// }
