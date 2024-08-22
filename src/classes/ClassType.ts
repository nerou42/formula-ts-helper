import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "../BaseType";
import { MemberAccsessType } from "../MemberAccsessType";
import { Operator } from "../Operator";
import { Type } from "../Type";
import { TypeProvider } from "../TypeProvider";
import { FieldType } from "./FieldType";

/**
 * @author Timo Lehnertz
 */
export class ClassType implements Type {

  public readonly parentType: ClassType | null;

  public readonly identifier: string;

  public readonly fields: Map<string, FieldType>;

  constructor(parentType: ClassType | null, identifier: string, fields: Map<string, FieldType>) {
    this.parentType = parentType;
    this.identifier = identifier;
    if (this.parentType !== null) {
      this.fields = new Map([...this.parentType.fields].concat([...fields]));
    } else {
      this.fields = fields;
    }
  }

  assignableBy(type: Type): boolean {
    if (!(type instanceof ClassType)) {
      return false;
    }
    return type.extends(this) || this.equals(type);
  }

  extends(classType: ClassType): boolean {
    if (this.parentType === null) {
      return false;
    }
    if (this.parentType.equals(classType)) {
      return true;
    }
    return this.parentType.extends(classType);
  }

  equals(type: Type): boolean {
    if (!(type instanceof ClassType)) {
      return false;
    }
    if (this.identifier !== type.identifier) {
      return false;
    }
    if (this.fields.size !== type.fields.size) {
      return false;
    }
    for (const [identifier, field] of this.fields) {
      const field = type.fields.get(identifier);
      if (field === undefined || !field.equals(field)) {
        return false;
      }
    }
    return true;
  }

  getImplementedOperators(): Operator[] {
    return getDefaultImplementedOperators().concat([Operator.MEMBER_ACCESS]);
  }

  getCompatibleOperands(operator: Operator): Type[] {
    const compatible = getDefaultCompatibleOperands(new TypeProvider(), this, operator);
    if (operator === Operator.MEMBER_ACCESS) {
      for (const [identifier, field] of this.fields) {
        compatible.push(new MemberAccsessType(identifier));
      }
    }
    return compatible;
  }

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null {
    const defaultResult = getDefaultOperatorResultType(new TypeProvider(), this, operator, otherType);
    if(defaultResult !== null) {
      return defaultResult;
    }
    switch (operator) {
      case Operator.MEMBER_ACCESS:
        if (!(otherType instanceof MemberAccsessType)) {
          break;
        }
        if (!this.fields.has(otherType.getMemberIdentifier())) {
          break;
        }
        return this.fields.get(otherType.getMemberIdentifier())!.type;
    }
    return null;
  }

  toString(): string {
    return 'classType(' + this.identifier + ')';
  }
}
