import { EnDictionary } from './EnDictionary';

type KEY = string | number | symbol;

interface Dictionary<K extends KEY, V> {
  getKeys(): K[];
  getValues(): V[];
  get(key: K): V | null;
  put(key: K, val: V): void; // or boolean?
}

export class JSDict<K extends KEY, V> implements Dictionary<K, V> {
  public static Create<Keys extends KEY, Values>() {
    return new JSDict<Keys, Values>();
  }

  private dict: { [key in K]?: V };

  constructor() {
    this.dict = {};
  }

  public getKeys() {
    const keys: K[] = [];
    for (const key in this.dict) {
      if (this.dict.hasOwnProperty(key)) {
        keys.push(key);
      }
    }

    return keys;
  }

  public getValues() {
    const vals: V[] = [];
    for (const key in this.dict) {
      if (this.dict.hasOwnProperty(key)) {
        const v = this.dict[key];

        if (this.exists(v)) {
          vals.push(v);
        }
      }
    }

    return vals;
  }

  public get(key: K) {
    const v = this.dict[key];

    return this.exists(v) ? v : null;
  }

  public put(key: K, val: V) {
    this.dict[key] = val;
  }

  // Type predicate to ensure v exists
  private exists(v: V | undefined): v is V {
    return v != null && typeof v !== 'undefined';
  }
}

export type ResourceId =
  | 'ACCOUNT_EXIST'
  | 'BAD_TOKEN'
  | 'COULD_NOT_FIND_USER_BY_EMAIL'
  | 'COULD_NOT_VERIFY_USER'
  | 'EMAIL_NOT_VERIFIED'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'INTERNAL_ERROR'
  | 'NO_ACTIVE_CALL_FOUND'
  | 'NO_PROPOSER_ON_THE_PROPOSAL'
  | 'NOT_ALLOWED_PROPOSAL_SUBMITTED'
  | 'NOT_ALLOWED'
  | 'NOT_AUTHORIZED'
  | 'NOT_LOGGED_IN'
  | 'NOT_LOGGED'
  | 'NOT_REVIEWER_OF_PROPOSAL'
  | 'NOT_USER_OFFICER'
  | 'ORCID_HASH_MISMATCH'
  | 'PROPOSAL_DOES_NOT_EXIST'
  | 'TOO_SHORT_ABSTRACT'
  | 'TOO_SHORT_NAME'
  | 'TOO_SHORT_TITLE'
  | 'USER_DOES_NOT_EXIST'
  | 'VALUE_CONSTRAINT_REJECTION'
  | 'WRONG_EMAIL_OR_PASSWORD'
  | 'UNFEASIBLE'
  | 'PARTIALLY_FEASIBLE'
  | 'FEASIBLE'
  | 'NOT_FOUND'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'RESERVED';

const dictionary = new EnDictionary();

export function getTranslation(id: ResourceId): string {
  return dictionary.map.get(id) || id;
}
