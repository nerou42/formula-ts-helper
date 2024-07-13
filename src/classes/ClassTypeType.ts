import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "../BaseType";
import { Operator } from "../Operator";
import { Type } from "../Type";
import { ConstructorType } from "./ConstructorType";

/**
 * @author Timo Lehnertz
 */
export class ClassTypeType implements Type {

  private readonly constructorType: ConstructorType;

  constructor(constructorType: ConstructorType) {
    this.constructorType = constructorType;
  }

  getImplementedOperators(): Operator[] {
    return getDefaultImplementedOperators().concat([Operator.NEW]);
  }

  getCompatibleOperands(operator: Operator): Type[] {
    return getDefaultCompatibleOperands(this, operator);
  }

  toString(): string {
    return 'ClassTypeType';
  }

  equals(type: Type): boolean {
    if (type instanceof ClassTypeType) {
      return this.constructorType.equals(type.constructorType);
    }
    return false;
  }

  assignableBy(type: Type): boolean {
    return this.equals(type);
  }

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null {
    const defaultResult = getDefaultOperatorResultType(this, operator, otherType);
    if (defaultResult !== null) {
      return defaultResult;
    }
    if (operator === Operator.NEW && otherType === null) {
      return this.constructorType;
    }
    return null;
  }
}
