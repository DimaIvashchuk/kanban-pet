import FlakeId = require('flake-idgen');
import intformat = require('biguint-format');

export interface FlakeidOptions {
  datacenter?: number | undefined;
  worker?: number | undefined;
  id?: number | undefined;
  epoch?: number | undefined;
  seqMask?: number | undefined;
}

export default class Flakeid {
  private static instance: FlakeId;

  constructor(options: FlakeidOptions = {}) {
    Flakeid.instance = Flakeid.instance || new FlakeId(options);
  }

  gen(): string {
    const buffer = Flakeid.instance.next();
    return intformat(buffer, 'dec');
  }
}
