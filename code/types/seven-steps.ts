export interface TextRange {
  from: number;
  to: number;
  text: string;
}

export interface TextClarification {
  localId: string;
  databaseId?: string;
  range: TextRange[];
  clarification: string;
}

export interface EventBusMessage {
  header: any[];
  payload: any;
}
