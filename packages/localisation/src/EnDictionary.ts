import { JSDict, ResourceId } from './StringResources';
export class EnDictionary {
  public map = JSDict.Create<ResourceId, string>();
  constructor() {
    this.map.put('ACCOUNT_EXIST', 'Account already exists');
    this.map.put('BAD_TOKEN', 'Bad token');
    this.map.put(
      'COULD_NOT_FIND_USER_BY_EMAIL',
      'Could not find user by email'
    );
    this.map.put('COULD_NOT_VERIFY_USER', 'Could not verify user');
    this.map.put('EMAIL_NOT_VERIFIED', 'Email not verified');
    this.map.put('INSUFFICIENT_PERMISSIONS', 'Insufficient permissions');
    this.map.put('INTERNAL_ERROR', 'Internal server error');
    this.map.put('NO_PROPOSER_ON_THE_PROPOSAL', 'Proposal has no proposer');
    this.map.put(
      'NOT_ALLOWED_PROPOSAL_SUBMITTED',
      'The operation is not allowed, because the proposal is already submitted'
    );
    this.map.put('NOT_ALLOWED', 'The operation is not allowed');
    this.map.put('NOT_AUTHORIZED', 'Not authorized');
    this.map.put('NOT_LOGGED_IN', 'Not logged in');
    this.map.put('NOT_LOGGED_IN', 'Not logged in');
    this.map.put(
      'NOT_REVIEWER_OF_PROPOSAL',
      'You are not reviewer of the proposal'
    );
    this.map.put('NOT_USER_OFFICER', 'Not a user officer');
    this.map.put('ORCID_HASH_MISMATCH', 'ORCID hash mismatch');
    this.map.put('PROPOSAL_DOES_NOT_EXIST', 'Proposal does not exist');
    this.map.put('TOO_SHORT_ABSTRACT', 'The abstract is too short');
    this.map.put('TOO_SHORT_NAME', 'The name is too short');
    this.map.put('TOO_SHORT_TITLE', 'Title is too short');
    this.map.put('USER_DOES_NOT_EXIST', 'User does not exist');
    this.map.put(
      'VALUE_CONSTRAINT_REJECTION',
      'Value does not match constraints'
    );
    this.map.put('WRONG_EMAIL_OR_PASSWORD', 'Wrong email or password');
    this.map.put('FEASIBLE', 'Feasible');
    this.map.put('PARTIALLY_FEASIBLE', 'Partially feasible');
    this.map.put('UNFEASIBLE', 'Unfeasible');
    this.map.put('NOT_FOUND', 'Not found');
    this.map.put('ACCEPTED', 'Accepted');
    this.map.put('REJECTED', 'Rejected');
    this.map.put('RESERVED', 'Reserved');
    this.map.put('UPDATED', 'Updated');
  }
}
