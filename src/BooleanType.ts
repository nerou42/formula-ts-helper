import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "./BaseType";
import { Operator } from "./Operator";
import { Type } from "./Type";
import { TypeProvider } from "./TypeProvider";

/**
 * @author Timo Lehnertz
 */
export class BooleanType implements Type {

  assignableBy(type: Type): boolean {
    return this.equals(type);
  }

  equals(type: Type): boolean {
    return type instanceof BooleanType;
  }

  getImplementedOperators(): Operator[] {
    return getDefaultImplementedOperators();
  }

  getCompatibleOperands(operator: Operator): Type[] {
    return getDefaultCompatibleOperands(new TypeProvider(), this, operator);
  }

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null {
    return getDefaultOperatorResultType(new TypeProvider(), this, operator, otherType);
  }

  toString(): string {
    return 'boolean';
  }
}
