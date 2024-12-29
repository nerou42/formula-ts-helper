import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "./BaseType";
import { StringTypeDescription } from "./InbuiltTypeParser";
import { IntegerType } from "./IntegerType";
import { MemberAccsessType } from "./MemberAccsessType";
import { Operator } from "./Operator";
import { Type } from "./Type";
import { TypeProvider } from "./TypeProvider";

/**
 * @author Timo Lehnertz
 * 
 * normally this class would extend ClassType but this leads to a breaking circular dependency
 */
export class StringType implements Type {

  assignableBy(type: Type): boolean {
    return this.equals(type);
  }

  equals(type: Type): boolean {
    return type instanceof StringType;
  }

  getImplementedOperators(): Operator[] {
    return getDefaultImplementedOperators().concat([Operator.MEMBER_ACCESS, Operator.ADDITION]);
  }

  getCompatibleOperands(operator: Operator): Type[] {
    const compatible = getDefaultCompatibleOperands(new TypeProvider(), this, operator);
    switch (operator) {
      case Operator.ADDITION:
        compatible.push(new StringType());
        break;
      case Operator.MEMBER_ACCESS:
        compatible.push(new MemberAccsessType('length'));
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
        if (otherType instanceof StringType) {
          return new StringType();
        }
        break;
      case Operator.MEMBER_ACCESS:
        if(otherType instanceof MemberAccsessType && otherType.getMemberIdentifier() === 'length') {
          return new IntegerType();
        }
        break;
    }
    return null;
  }

  toString(): string {
    return 'String';
  }

  getInterfaceType(): StringTypeDescription {
    return {
      typeName: 'StringType',
    }
  }
}
