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
 * @prop idLocal: ID used within the frontend application
 * @prop idDatabase: ID used in the database
 * @prop range: list of text ranges concerned by the extension
 */
export interface TextExtension {
  idLocal: string;
  idDatabase?: string;
  range: TextRange[];
}

/** A clarification made in a text */
export interface TextClarification extends TextExtension {
  clarification: string;
}

/** A claim-group that is used as premises to a conclusion
 * @prop group: list of claims in the group, with metadata
 * @prop group[i].claim: the claim itself
 * @prop group[i].number: the number shown in the reduced form
 * @prop group[i].index: the index of the claim within the group
 * @prop group: indicate if the group is a leaf in the diagram
 * @prop x: horizontal position
 * @prop y: vertical position
 * @prop width: width of the group
 * @prop height: height of the group
 */
export interface TextClaimGroup {
  group: {
    claim: Claim;
    number: number;
    index: number;
  }[];
  leaf: boolean;
  width: number;
  height: number;
  x?: number;
  y?: number;
}

/** A claim made in a text (conclusion or premise)
 * @prop claim: claim that is being made
 * @prop stated: whether the claim is stated or unstated
 * @prop conclusion: whether that claim is one of the text's main conclusion
 * @prop number: the number attributed to this claim within the text
 */
export interface TextClaim extends TextExtension {
  claim: Claim;
  stated: boolean;
  conclusion: boolean;
  number: number;
}

/** A claim: something asserted as a fact
 * @prop translation: translations of the claim. Expected: {default: 'string', en: 'hello', fr: 'bonjour'}
 * @prop logic: the argument in a formal logical form. Expected: {lang: 'string', prolog: 'mountain(everest)'}
 */
export interface Claim {
  idLocal: string;
  idDatabase?: string;
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
