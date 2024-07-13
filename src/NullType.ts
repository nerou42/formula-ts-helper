import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "./BaseType";
import { Operator } from "./Operator";
import { Type } from "./Type";

/**
 * @author Timo Lehnertz
 */
export class NullType implements Type {

  assignableBy(type: Type): boolean {
    return this.equals(type);
  }

  equals(type: Type): boolean {
    return type instanceof NullType;
  }

  getImplementedOperators(): Operator[] {
    return getDefaultImplementedOperators();
  }

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null {
    const defaultResult = getDefaultOperatorResultType(this, operator, otherType);
    if(defaultResult !== null) {
      return defaultResult;
    }
    return getDefaultOperatorResultType(this, operator, otherType);
  }

  getCompatibleOperands(operator: Operator): Type[] {
    return getDefaultCompatibleOperands(this, operator);
  }

  toString(): string {
    return 'null';
  }
}
