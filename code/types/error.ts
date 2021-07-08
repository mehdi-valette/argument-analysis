/** error returned when the claim is not found */
export class ClaimNotFound extends Error {
  constructor(claimId: string, message: string = '') {
    if (message === '') {
      message = `claim ${claimId} not found`;
    }

    super(message);
  }
}

/** error returned when an argument is not found */
export class ArgumentNotFound extends Error {
  constructor(argumentId: string, message: string = '') {
    if (message === '') {
      message = `argument ${argumentId} not found`;
    }

    super(message);
  }
}
