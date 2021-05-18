import {TextDefinition, TextSelection} from '@/types/seven-steps';

/** check whether a text selected in a new definition already exists */
export function definitionExists(
  definitionList: TextDefinition[],
  newDefinition: TextDefinition
) {
  let returnValue = true;

  // aggregate all the ranges in the "definition" database
  const allRange: TextSelection[] = [];
  definitionList.forEach(definition => {
    allRange.push(...definition.range)
  });

  // verify if one of the ranges in the new selection
  // overlaps with an existing range
  const overlap = newDefinition.range.find(newRange => {

    // look for a range that overlaps
    const overlappingRange =
      allRange.find(range =>
        !(newRange.end <= range.start || newRange.start >= range.end)
      );
    
    // if overlapping range is not undefined
    // that means we found a range that overlaps
    return overlappingRange !== undefined;
  });

  // add the definition if there's no overlap with an existing range
  if(overlap === undefined) {
    returnValue = false;
  }

  return returnValue;
}