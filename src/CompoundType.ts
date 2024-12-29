import { getDefaultOperatorResultType } from "./BaseType";
import { CompoundTypeDescription } from "./InbuiltTypeParser";
import { NeverType } from "./NeverType";
import { Operator, OperatorHelper, OperatorType } from "./Operator";
import { Type } from "./Type";
import { TypeProvider } from "./TypeProvider";

/**
 * @author Timo Lehnertz
 */
export class CompoundType implements Type {

  private readonly types: Type[];

  public constructor(types: Type[]) {
    this.types = types;
  }

  static buildFromTypes(types: Type[]): Type {
    if (types.length === 0) {
      return new NeverType();
    }
    // flatten
    let notCompoundTypes: Type[] = [];
    for (const type of types) {
      if (type instanceof CompoundType) {
        notCompoundTypes = notCompoundTypes.concat(type.types);
      } else {
        notCompoundTypes.push(type);
      }
    }
    const uniqueTypes: Type[] = [];
    // eliminate clones
    for (const type of notCompoundTypes) {
      let found = false;
      for (const uniqueType of uniqueTypes) {
        if (uniqueType.equals(type)) {
          found = true;
          break;
        }
      }
      if (!found) {
        uniqueTypes.push(type);
      }
    }
    if (uniqueTypes.length === 1) {
      return uniqueTypes[0];
    } else {
      return new CompoundType(uniqueTypes);
    }
  }

  getImplementedOperators(): Operator[] {
    const operatorLists: Operator[][] = [];
    for (const type of this.types) {
      operatorLists.push(type.getImplementedOperators());
    }
    let intersection: Operator[] = operatorLists[0];
    for (const list of operatorLists) {
      intersection = intersection.filter((operator) => list.includes(operator))
    }
    const out: Operator[] = [];
    for (const operator of intersection) {
      const operatorHelper = new OperatorHelper(operator);
      if (operatorHelper.getOperatorType() !== OperatorType.InfixOperator || this.getCompatibleOperands(operator).length > 0) {
        out.push(operator);
      }
    }
    out.push(Operator.DIRECT_ASSIGNMENT);
    out.push(Operator.DIRECT_ASSIGNMENT_OLD_VAL);
    out.push(Operator.EQUALS);
    return out;
  }

  getCompatibleOperands(operator: Operator): Type[] {
    const operandLists: Type[][] = [];
    for (const type of this.types) {
      operandLists.push(type.getCompatibleOperands(operator));
    }
    let intersection: Type[] = operandLists[0];
    for (const list of operandLists) {
      intersection = intersection.filter((a) => list.filter((b) => a.equals(b)).length > 0)
    }
    switch (operator) {
      case Operator.DIRECT_ASSIGNMENT:
      case Operator.DIRECT_ASSIGNMENT_OLD_VAL:
      case Operator.EQUALS:
        for (const type of this.types) {
          intersection.push(type);
        }
        break;
    }
    return intersection;
  }

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null {
    const defaultResult = getDefaultOperatorResultType(new TypeProvider(), this, operator, otherType);
    if (defaultResult !== null) {
      return defaultResult;
    }
    const resultTypes: Type[] = [];
    for (const type of this.types) {
      const result = type.getOperatorResultType(operator, otherType);
      if (result !== null) {
        resultTypes.push(result);
      }
    }
    if (resultTypes.length === 0) {
      return null;
    }
    return CompoundType.buildFromTypes(resultTypes);
  }

  toString(): string {
    let identifier = '';
    let delimiter = '';
    for (const type of this.types) {
      identifier += delimiter + type.toString();
      delimiter = ' | ';
    }
    return identifier;
  }

  assignableBy(type: Type): boolean {
    if (type instanceof CompoundType) {
      for (const otherType of type.types) {
        if (!this.assignableBy(otherType)) {
          return false;
        }
      }
      return true;
    } else {
      for (const ownType of this.types) {
        if (ownType.assignableBy(type)) {
          return true;
        }
      }
      return false;
    }
  }

  equals(type: Type): boolean {
    if (type instanceof CompoundType) {
      if (type.types.length !== this.types.length) {
        return false;
      }
      for (const otherType of type.types) {
        let found = false;
        for (const ownType of this.types) {
          if (ownType.equals(otherType)) {
            found = true;
            break;
          }
        }
        if (!found) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  eliminateType(type: Type): Type {
    const newTypes: Type[] = [];
    for (const ownType of this.types) {
      if (!ownType.equals(type)) {
        newTypes.push(ownType);
      }
    }
    return CompoundType.buildFromTypes(newTypes);
  }

  getTypes(): Type[] {
    return this.types;
  }

  getInterfaceType(): CompoundTypeDescription {
    return {
      typeName: 'CompoundType',
      properties: {
        types: this.types.map(t => t.getInterfaceType())
      }
    }
  }
}
