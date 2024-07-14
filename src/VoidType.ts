import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "./BaseType";
import { Operator } from "./Operator";
import { Type } from "./Type";
import { TypeProvider } from "./TypeProvider";

/**
 * @author Timo Lehnertz
 */
export class VoidType implements Type {

  assignableBy(type: Type): boolean {
    return type instanceof VoidType;
  }

  equals(type: Type): boolean {
    return type instanceof VoidType;
  }

  getImplementedOperators(): Operator[] {
    return getDefaultImplementedOperators();
  }

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null {
    const defaultResult = getDefaultOperatorResultType(new TypeProvider(), this, operator, otherType);
    if(defaultResult !== null) {
      return defaultResult;
    }
    return getDefaultOperatorResultType(new TypeProvider(), this, operator, otherType);
  }

  getCompatibleOperands(operator: Operator): Type[] {
    return getDefaultCompatibleOperands(new TypeProvider(), this, operator);
  }

  toString(): string {
    return 'void';
  }
}
