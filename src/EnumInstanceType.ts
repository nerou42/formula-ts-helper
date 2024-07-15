import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "./BaseType";
import { EnumTypeType } from "./EnumTypeType";
import { Operator } from "./Operator";
import { Type } from "./Type";
import { TypeProvider } from "./TypeProvider";

/**
 * @author Timo Lehnertz
 */
export class EnumInstanceType implements Type {

  private readonly enumType: EnumTypeType;

  public constructor(enumType: EnumTypeType) {
    this.enumType = enumType;
  }

  assignableBy(type: Type): boolean {
    return type instanceof EnumInstanceType && this.enumType.equals(type.enumType);
  }

  equals(type: Type): boolean {
    return type instanceof EnumInstanceType && this.enumType.equals(type.enumType);
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

  public toString(): string {
    return 'EnumInstanceType(' + this.enumType.toString() + ')';
  }
}
