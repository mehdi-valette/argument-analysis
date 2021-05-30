/** A range in a text (a substring in a string)
 * @prop from: position of the first letter of the range
 * @prop to: position of the last letter of the range
 * @prop text: text within the range
 */
export interface TextRange {
  from: number;
  to: number;
  text: string;
}

/** Base interface that will be extended by different kinds of text extensions (clarification, claim identification)
 * @prop localId: ID used within the frontend application
 * @prop databaseId: ID used in the database
 * @prop range: list of text ranges concerned by the extension
 */
export interface TextExtension {
  localId: string;
  databaseId?: string;
  range: TextRange[];
}

/** A clarification made in a text */
export interface TextClarification extends TextExtension {
  clarification: string;
}

/** A claim made in a text (conclusion or premise)
 * @prop claim: claim that is being made
 * @prop stated: whether the claim is stated or unstated
 * @prop conclusion: whether that claim is one of the text's main conclusion
 */
export interface TextClaim extends TextExtension {
  claim: Claim;
  stated: boolean;
  conclusion: boolean;
}

/** A claim, in a text or not
 * @prop translation: translations of the claim. Expected: {default: 'string', en: 'hello', fr: 'bonjour'}
 * @prop logic: the argument in a formal logical form. Expected: {lang: 'string', prolog: 'mountain(everest)'}
 */
export interface Claim {
  translation: {
    default: string;
    [lang: string]: string;
  };
  logic: {
    prolog?: string;
  };
}

/** A message that travel through the event bus */
export interface EventBusMessage {
  header: any[];
  payload: any;
}
