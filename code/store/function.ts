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
