export interface TextSelection {
  from: number
  to: number
  text: string
}

export interface TextDefinition {
  localId: string
  databaseId?: string
  range: TextSelection[]
  definition: string
}

export interface BusEvent {
  header: any[]
  payload: any
}
