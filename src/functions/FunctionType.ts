import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "../BaseType";
import { Operator } from "../Operator";
import { Type } from "../Type";
import { OuterFunctionArgumentListType } from "./OuterFunctionArgumentListType";

export type ReturnTypeCallback = ((outerFunctionArgumentListType: OuterFunctionArgumentListType) => null | Type);

/**
 * @author Timo Lehnertz
 */
export class FunctionType implements Type {

  public readonly arguments: OuterFunctionArgumentListType;

  public readonly generalReturnType: Type;

  private readonly specificReturnType: ReturnTypeCallback | null;

  constructor(outerArguments: OuterFunctionArgumentListType, generalReturnType: Type, specificReturnType: ReturnTypeCallback | null = null) {
    this.arguments = outerArguments;
    this.generalReturnType = generalReturnType;
    this.specificReturnType = specificReturnType;
  }

  assignableBy(type: Type): boolean {
    if (!(type instanceof FunctionType)) {
      return false;
    }
    return this.arguments.assignableBy(type.arguments) && this.generalReturnType.assignableBy(type.generalReturnType);
  }

  equals(type: Type): boolean {
    if (type instanceof FunctionType) {
      return this.arguments.equals(type.arguments) && this.generalReturnType.equals(type.generalReturnType) && this.specificReturnType == type.specificReturnType;
    } else {
      return false;
    }
  }

  toString(): string {
    return 'function' + this.arguments.toString() + ' -> ' + this.generalReturnType.toString();
  }

  getImplementedOperators(): Operator[] {
    return getDefaultImplementedOperators().concat([Operator.CALL]);
  }

  getCompatibleOperands(operator: Operator): Type[] {
    const compatible = getDefaultCompatibleOperands(this, operator);
    if (operator === Operator.CALL) {
      compatible.push(this.arguments);
    }
    return compatible;
  }

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null {
    const defaultResult = getDefaultOperatorResultType(this, operator, otherType);
    if(defaultResult !== null) {
      return defaultResult;
    }
    if (operator === Operator.CALL) {
      if (otherType instanceof OuterFunctionArgumentListType && this.arguments.assignableBy(otherType)) {
        if (this.specificReturnType === null) {
          return this.generalReturnType;
        } else {
          return this.specificReturnType(otherType);
        }
      }
    }
    return null;
  }
}
