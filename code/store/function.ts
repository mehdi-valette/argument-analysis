import cloneDeep from 'lodash.clonedeep';
import { TextRange, TextExtension } from '~/types/seven-steps';

export interface RangeModification {
  localId: string;
  range: TextRange[];
}

export interface RangeDelete {
  localId: string;
  from: number;
  to: number;
}

export function rangeAdd<T extends TextExtension>(
  list: T[],
  { localId, range }: RangeModification
) {
  let returnValue = null;

  const listClone = cloneDeep(list);
  const element = listClone.find((claim) => claim.localId === localId);

  if (element !== undefined) {
    element.range.push(...range);
    returnValue = listClone;
  }

  return returnValue;
}

export function rangeUpdate<T extends TextExtension>(
  list: T[],
  { localId, range }: RangeModification
) {
  const listClone = cloneDeep(list);
  listClone.forEach((element) => {
    if (element.localId === localId) {
      element.range = range;
    }
  });

  return listClone;
}

export function rangeDelete<T extends TextExtension>(
  list: T[],
  { localId, from, to }: RangeDelete
) {
  let returnValue = null;
  const listClone = cloneDeep(list);

  const element = listClone.find((claim) => claim.localId === localId);

  if (element !== undefined) {
    element.range = element.range.filter(
      (range) => range.from !== from || range.to !== to
    );

    returnValue = listClone;
  }

  return returnValue;
}
