import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "./BaseType";
import { MemberAccsessTypeDescription } from "./InbuiltTypeParser";
import { Operator } from "./Operator";
import { Type } from "./Type";
import { TypeProvider } from "./TypeProvider";

/**
 * @author Timo Lehnertz
 */
export class MemberAccsessType implements Type {

  private readonly memberIdentifier: string;

  constructor(memberIdentifier: string) {
    this.memberIdentifier = memberIdentifier;
  }

  getMemberIdentifier(): string {
    return this.memberIdentifier;
  }

  assignableBy(type: Type): boolean {
    return this.equals(type);
  }

  equals(type: Type): boolean {
    return (type instanceof MemberAccsessType) && type.memberIdentifier === this.memberIdentifier;
  }

  getImplementedOperators(): Operator[] {
    return getDefaultImplementedOperators();
  }

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null {
    return getDefaultOperatorResultType(new TypeProvider(), this, operator, otherType);
  }

  getCompatibleOperands(operator: Operator): Type[] {
    return getDefaultCompatibleOperands(new TypeProvider(), this, operator);
  }

  toString(): string {
    return 'member accsess(' + this.memberIdentifier + ')';
  }

  getInterfaceType(): MemberAccsessTypeDescription {
    return {
      typeName: 'MemberAccsessType',
      properties: {
        memberIdentifier: this.memberIdentifier
      }
    }
  }
}
