import { EnumInstanceType } from "./EnumInstanceType";
import { Type } from "./Type";
import { ClassType } from "./classes/ClassType";
import { FieldType } from "./classes/FieldType";

/**
 * @author Timo Lehnertz
 */
export class EnumTypeType extends ClassType {

  constructor(identifier: string, cases: string[]) {
    const fields = new Map<string, FieldType>();
    super(null, identifier, fields);
    for (const caseIdentifier of cases) {
      fields.set(caseIdentifier, new FieldType(true, new EnumInstanceType(this)))
    }
  }

  assignableBy(type: Type): boolean {
    return this.equals(type);
  }

  equals(type: Type): boolean {
    return type instanceof EnumTypeType && this.identifier === type.identifier;
  }

  toString(): string {
    return 'EnumTypeType(' + this.identifier + ')';
  }
}
