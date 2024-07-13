import { Type } from "../Type";

/**
 * @author Timo Lehnertz
 */
export class FieldType {

  public readonly final: boolean;

  public readonly type: Type;

  constructor(final: boolean, type: Type) {
    this.final = final;
    this.type = type;
  }

  equals(other: FieldType): boolean {
    return this.final === other.final && this.type.equals(other.type);
  }
}
