export interface TextRange {
  from: number;
  to: number;
  text: string;
}

export interface TextDefinition {
  localId: string;
  databaseId?: string;
  range: TextRange[];
  definition: string;
}

export interface EventBusMessage {
  header: any[];
  payload: any;
}
