import { IntegerTypeDescription } from "./InbuiltTypeParser";
import { NumberValueHelper } from "./NumberValueHelper";
import { Operator } from "./Operator";
import { Type } from "./Type";

/**
 * @author Timo Lehnertz
 */
export class IntegerType implements Type {

  assignableBy(type: Type): boolean {
    return this.equals(type);
  }

  equals(type: Type): boolean {
    return type instanceof IntegerType;
  }

  getImplementedOperators(): Operator[] {
    return NumberValueHelper.getImplementedOperators(this);
  }

  getCompatibleOperands(operator: Operator): Type[] {
    return NumberValueHelper.getCompatibleOperands(this, operator);
  }

  getOperatorResultType(operator: Operator, otherType: Type|null): Type|null {
    return NumberValueHelper.getOperatorResultType(this, operator, otherType);
  }

  toString(): string {
    return 'int';
  }

  getInterfaceType(): IntegerTypeDescription {
    return {
      typeName: 'IntegerType',
    }
  }
}
