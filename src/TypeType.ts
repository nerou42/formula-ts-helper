import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "./BaseType";
import { Operator } from "./Operator";
import { Type } from "./Type";

/**
 * @author Timo Lehnertz
 */
export class TypeType implements Type {

  private readonly type: Type;

  constructor(type: Type) {
    this.type = type;
  }

  getType(): Type {
    return this.type;
  }

  assignableBy(type: Type): boolean {
    return this.equals(type);
  }

  equals(type: Type): boolean {
    return (type instanceof TypeType) && type.type.equals(this.type);
  }

  getImplementedOperators(): Operator[] {
    return getDefaultImplementedOperators();
  }

  getCompatibleOperands(operator: Operator): Type[] {
    return getDefaultCompatibleOperands(this, operator);
  }

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null {
    return getDefaultOperatorResultType(this, operator, otherType);
  }

  toString(): string {
    return 'TypeType(' + this.type.toString() + ')';
  }
}
