import { getDefaultImplementedOperators, getDefaultOperatorResultType } from "./BaseType";
import { IntegerType } from "./IntegerType";
import { Operator } from "./Operator";
import { Type } from "./Type";
import { ClassType } from "./classes/ClassType";
import { FieldType } from "./classes/FieldType";

/**
 * @author Timo Lehnertz
 */
export class StringType extends ClassType {

  constructor() {
    const lengthField = new FieldType(true, new IntegerType());
    super(null, 'String', new Map([['length', lengthField]]));
  }

  assignableBy(type: Type): boolean {
    return this.equals(type);
  }

  equals(type: Type): boolean {
    return type instanceof StringType;
  }

  getImplementedOperators(): Operator[] {
    return getDefaultImplementedOperators().concat([Operator.ADDITION]);
  }

  getCompatibleOperands(operator: Operator): Type[] {
    const compatible = super.getCompatibleOperands(operator);
    if (operator === Operator.ADDITION) {
      compatible.push(new StringType());
    }
    return compatible;
  }

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null {
    const defaultResult = super.getOperatorResultType(operator, otherType);
    if(defaultResult !== null) {
      return defaultResult;
    }
    if (operator === Operator.ADDITION && otherType instanceof StringType) {
      return new StringType();
    } else {
      return super.getOperatorResultType(operator, otherType);
    }
  }

  toString(): string {
    return 'String';
  }
}
