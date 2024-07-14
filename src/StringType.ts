import { IntegerType } from "./IntegerType";
import { Operator } from "./Operator";
import { Type } from "./Type";
import { ClassType } from "./classes/ClassType";
import { FieldType } from "./classes/FieldType";

/**
 * @author Timo Lehnertz
 */
export class StringType {

  private classType: ClassType;

  constructor() {
    const lengthField = new FieldType(true, new IntegerType());
    // super(null, 'String', new Map([['length', lengthField]]));
    this.classType = new ClassType(null, 'String', new Map([['length', lengthField]]));
  }

  assignableBy(type: Type): boolean {
    return this.equals(type);
  }

  equals(type: Type): boolean {
    return type instanceof StringType;
  }

  getImplementedOperators(): Operator[] {
    return this.classType.getImplementedOperators().concat([Operator.ADDITION]);
  }

  getCompatibleOperands(operator: Operator): Type[] {
    const compatible = this.classType.getCompatibleOperands(operator);
    if (operator === Operator.ADDITION) {
      compatible.push(new StringType());
    }
    return compatible;
  }

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null {
    const defaultResult = this.classType.getOperatorResultType(operator, otherType);
    if (defaultResult !== null) {
      return defaultResult;
    }
    if (operator === Operator.ADDITION && otherType instanceof StringType) {
      return new StringType();
    }
    return null;
  }

  toString(): string {
    return 'String';
  }
}
