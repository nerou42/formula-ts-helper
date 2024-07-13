import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "./BaseType";
import { Operator } from "./Operator";
import { Type } from "./Type";

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
    return getDefaultOperatorResultType(this, operator, otherType);
  }
  
  getCompatibleOperands(operator: Operator): Type[] {
    return getDefaultCompatibleOperands(this, operator);
  }
  
  toString(): string {
    return 'member accsess('+this.memberIdentifier+')';
  }
}
