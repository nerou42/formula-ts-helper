import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "../BaseType";
import { TypeDescription } from "../GenericTypeParser";
import { FunctionTypeDescription } from "../InbuiltTypeParser";
import { Operator } from "../Operator";
import { Type } from "../Type";
import { TypeProvider } from "../TypeProvider";
import { OuterFunctionArgumentListType } from "./OuterFunctionArgumentListType";

export type SpecificReturnType = ((outerFunctionArgumentListType: OuterFunctionArgumentListType) => null | Type);

/**
 * @author Timo Lehnertz
 */
export class FunctionType implements Type {

  public readonly arguments: OuterFunctionArgumentListType;

  public readonly generalReturnType: Type;

  private readonly specificReturnType: SpecificReturnType | null;

  constructor(outerArguments: OuterFunctionArgumentListType, generalReturnType: Type, specificReturnType: SpecificReturnType | null = null) {
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
    const compatible = getDefaultCompatibleOperands(new TypeProvider(), this, operator);
    if (operator === Operator.CALL) {
      compatible.push(this.arguments);
    }
    return compatible;
  }

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null {
    const defaultResult = getDefaultOperatorResultType(new TypeProvider(), this, operator, otherType);
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

  getInterfaceType(): TypeDescription {
    return {
      typeName: 'FunctionType',
      properties: {
        arguments: this.arguments.getInterfaceType(),
        generalReturnType: this.generalReturnType.getInterfaceType(),
        specificReturnType: null, // @fixme
      }
    }
  }
}
