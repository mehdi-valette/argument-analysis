import { TextRange, TextExtension } from '~/types/interface';

export interface RangeModification {
  idLocal: string;
  range: TextRange[];
}

export interface RangeDelete {
  idLocal: string;
  from: number;
  to: number;
}
