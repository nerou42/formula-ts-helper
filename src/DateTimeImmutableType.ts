import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "./BaseType";
import { DateIntervalType } from "./DateIntervalType";
import { DateTimeImmutableTypeDescription } from "./InbuiltTypeParser";
import { IntegerType } from "./IntegerType";
import { Operator } from "./Operator";
import { Type } from "./Type";
import { TypeProvider } from "./TypeProvider";
import { TypeType } from "./TypeType";

/**
 * @author Timo Lehnertz
 */
export class DateTimeImmutableType implements Type {

  assignableBy(type: Type): boolean {
    return this.equals(type);
  }

  equals(type: Type): boolean {
    return type instanceof DateTimeImmutableType;
  }

  getImplementedOperators(): Operator[] {
    return getDefaultImplementedOperators().concat([Operator.ADDITION, Operator.SUBTRACTION]);
  }

  getCompatibleOperands(operator: Operator): Type[] {
    const compatible = getDefaultCompatibleOperands(new TypeProvider(), this, operator);
    switch (operator) {
      case Operator.ADDITION:
      case Operator.SUBTRACTION:
        compatible.push(new DateIntervalType());
        break;
      case Operator.TYPE_CAST:
        compatible.push(new TypeType(new IntegerType()));
        break;
    }
    return compatible;
  }

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null {
    const defaultResult = getDefaultOperatorResultType(new TypeProvider(), this, operator, otherType);
    if (defaultResult !== null) {
      return defaultResult;
    }
    switch (operator) {
      case Operator.ADDITION:
      case Operator.SUBTRACTION:
        if (otherType instanceof DateIntervalType) {
          return new DateTimeImmutableType();
        }
        break;
      case Operator.TYPE_CAST:
        if(otherType !== null && otherType instanceof TypeType && otherType.getType() instanceof IntegerType) {
          return new IntegerType();
        }
        break;
    }
    return null;
  }

  toString(): string {
    return 'DateTimeImmutable';
  }

  getInterfaceType(): DateTimeImmutableTypeDescription {
    return {
      typeName: 'DateTimeImmutableType',
    }
  }
}
