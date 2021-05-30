export interface TextRange {
  from: number;
  to: number;
  text: string;
}

export interface TextExtension {
  localId: string;
  databaseId?: string;
  range: TextRange[];
}

export interface TextClarification extends TextExtension {
  clarification: string;
}

export interface EventBusMessage {
  header: any[];
  payload: any;
}
