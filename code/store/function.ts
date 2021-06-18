import cloneDeep from 'lodash.clonedeep';
import { TextRange, TextExtension } from '~/types/seven-steps';

export interface RangeModification {
  idLocal: string;
  range: TextRange[];
}

export interface RangeDelete {
  idLocal: string;
  from: number;
  to: number;
}

export function rangeAdd<T extends TextExtension>(
  list: T[],
  { idLocal, range }: RangeModification
) {
  let returnValue = null;

  const listClone = cloneDeep(list);
  const element = listClone.find((claim) => claim.idLocal === idLocal);

  if (element !== undefined) {
    element.range.push(...range);
    returnValue = listClone;
  }

  return returnValue;
}

export function rangeUpdate<T extends TextExtension>(
  list: T[],
  { idLocal, range }: RangeModification
) {
  const listClone = cloneDeep(list);
  listClone.forEach((element) => {
    if (element.idLocal === idLocal) {
      element.range = range;
    }
  });

  return listClone;
}

export function rangeDelete<T extends TextExtension>(
  list: T[],
  { idLocal, from, to }: RangeDelete
) {
  let returnValue = null;
  const listClone = cloneDeep(list);

  const element = listClone.find((claim) => claim.idLocal === idLocal);

  if (element !== undefined) {
    element.range = element.range.filter(
      (range) => range.from !== from || range.to !== to
    );

    returnValue = listClone;
  }

  return returnValue;
}
