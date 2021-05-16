export interface TextSelection {
    start: number;
    end: number;
    text: string;
}

export interface TextDefinition {
    localId: string;
    databaseId?: string;
    range: TextSelection[];
    definition: string;
}
