import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "./BaseType";
import { IntegerType } from "./IntegerType";
import { Operator } from "./Operator";
import { Type } from "./Type";
import { TypeProvider } from "./TypeProvider";
import { TypeType } from "./TypeType";

/**
 * @author Timo Lehnertz
 */
export class DateIntervalType implements Type {

  assignableBy(type: Type): boolean {
    return this.equals(type);
  }

  equals(type: Type): boolean {
    return type instanceof DateIntervalType;
  }

  getImplementedOperators(): Operator[] {
    return getDefaultImplementedOperators().concat([Operator.UNARY_PLUS, Operator.UNARY_MINUS]);
  }

  getCompatibleOperands(operator: Operator): Type[] {
    const implemented = getDefaultCompatibleOperands(new TypeProvider(), this, operator);;
    switch (operator) {
      case Operator.TYPE_CAST:
        implemented.push(new TypeType(new IntegerType()));
    }
    return implemented;
  }

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null {
    const defaultResult = getDefaultOperatorResultType(new TypeProvider(), this, operator, otherType);
    if (defaultResult !== null) {
      return defaultResult;
    }
    switch (operator) {
      case Operator.TYPE_CAST:
        if (otherType instanceof TypeType) {
          const castType = otherType.getType();
          if (castType instanceof IntegerType) {
            return new IntegerType();
          }
        }
        break;
      case Operator.UNARY_PLUS:
      case Operator.UNARY_MINUS:
        if(otherType === null) {
          return new DateIntervalType();
        }
    }
    return null;
  }

  toString(): string {
    return 'DateInterval';
  }
}
