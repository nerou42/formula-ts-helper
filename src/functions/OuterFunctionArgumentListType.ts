import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "../BaseType";
import { Operator } from "../Operator";
import { Type } from "../Type";
import { TypeProvider } from "../TypeProvider";
import { TypeType } from "../TypeType";
import { OuterFunctionArgument } from "./OuterFunctionArgument";

/**
 * @author Timo Lehnertz
 */
export class OuterFunctionArgumentListType implements Type {

  private readonly arguments: OuterFunctionArgument[];

  public readonly isVArgs: boolean;

  constructor(outerArguments: OuterFunctionArgument[], isVArgs: boolean) {
    this.arguments = outerArguments;
    this.isVArgs = isVArgs;
    // check that optional parameters are at the end
    let optional = false;
    for (let i = 0; i < outerArguments.length; i++) {
      const argument = outerArguments[i];
      if (optional && !argument.optional) {
        throw Error('Not optional parameter cannot follow optional parameter');
      }
      if (argument.optional) {
        if (isVArgs && i < outerArguments.length - 1) {
          throw Error('Optional parameter can\'t be followed by VArgs');
        }
        optional = true;
      }
      if (i === outerArguments.length - 1 && isVArgs && !argument.optional) {
        throw Error('Varg parameter must be optional');
      }
    }
    // check that vargs are valid
    if (isVArgs && outerArguments.length === 0) {
      throw new Error('Vargs argument must have at least one argument');
    }
  }

  getMaxArgumentCount(): number {
    if (this.isVArgs) {
      return Number.MAX_SAFE_INTEGER;
    } else {
      return this.arguments.length;
    }
  }

  getMinArgumentCount(): number {
    let count = 0;
    for (const argument of this.arguments) {
      if (argument.optional) {
        break;
      }
      count++;
    }
    return count;
  }

  getArgument(index: number): OuterFunctionArgument {
    if (this.arguments[index] !== undefined) {
      return this.arguments[index];
    } else if (this.isVArgs) {
      return this.arguments[this.arguments.length - 1];
    } else {
      throw new Error('Index out of bounds');
    }
  }

  private canCastTo(sourceType: Type, targetType: Type) {
    if (targetType.assignableBy(sourceType)) {
      return true;
    }
    const castableTypes = sourceType.getCompatibleOperands(Operator.TYPE_CAST) as TypeType[];
    for (const castableType of castableTypes) {
      if (targetType.assignableBy(castableType.getType())) {
        return true;
      }
    }
    return false;
  }

  assignableBy(type: Type): boolean {
    if (!(type instanceof OuterFunctionArgumentListType)) {
      return false;
    }
    // check argument count
    if (type.arguments.length > this.getMaxArgumentCount() || type.arguments.length < this.getMinArgumentCount()) {
      return false;
    }
    // check invalid types
    for (let i = 0; i < type.arguments.length; i++) {
      const sourceType = type.arguments[i].type;
      const targetType = this.getArgument(i);
      if (!targetType.type.assignableBy(sourceType) && !this.canCastTo(sourceType, targetType.type)) {
        return false;
      }
    }
    return true;
  }

  equals(type: Type): boolean {
    if (!(type instanceof OuterFunctionArgumentListType)) {
      return false;
    }
    if (this.isVArgs !== type.isVArgs || this.arguments.length !== type.arguments.length) {
      return false;
    }
    for (let i = 0; i < type.arguments.length; i++) {
      if (!type.arguments[i].equals(this.arguments[i])) {
        return false;
      }
    }
    return true;
  }

  toString(): string {
    let identifier = '';
    let delimiter = '';
    for (let i = 0; i < this.arguments.length; i++) {
      identifier += delimiter + this.arguments[i].toString();
      delimiter = ',';
    }
    return '(' + identifier + ')';
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
}
