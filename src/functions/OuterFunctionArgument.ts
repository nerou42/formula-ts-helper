import { Type } from "../Type";

/**
 * @author Timo Lehnertz
 *
 *         Represents a function argument as seen from outside of that function
 */
export class OuterFunctionArgument {

  public readonly type: Type;

  public readonly optional: boolean;

  public readonly name: string | null;

  public readonly varg: boolean;

  constructor(type: Type, optional: boolean, varg: boolean, name: string | null = null) {
    this.type = type;
    this.optional = optional;
    this.name = name;
    this.varg = varg;
  }

  equals(other: OuterFunctionArgument): boolean {
    return this.optional === other.optional && this.type.equals(other.type);
  }

  toString(): string {
    let str = this.type.toString();
    if (this.varg) {
      str += '...';
    }
    if (this.name !== null) {
      str += ' ' + (this.optional && !this.varg ? '?' : '') + this.name;
    }
    return str;
  }
}
