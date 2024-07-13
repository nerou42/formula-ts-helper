import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "./BaseType";
import { Operator } from "./Operator";
import { Type } from "./Type";

/**
 * @author Timo Lehnertz
 */
export class NeverType implements Type {

  assignableBy(type: Type): boolean {
    return this.equals(type);
  }

  equals(type: Type): boolean {
    return type instanceof NeverType;
  }

  getImplementedOperators(): Operator[] {
    return getDefaultImplementedOperators();
  }

  getCompatibleOperands(operator: Operator): Type[] {
    return getDefaultCompatibleOperands(this, operator);
  }

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null {
    const defaultResult = getDefaultOperatorResultType(this, operator, otherType);
    if(defaultResult !== null) {
      return defaultResult;
    }
    return getDefaultOperatorResultType(this, operator, otherType);
  }

  toString(): string {
    return 'never';
  }
}