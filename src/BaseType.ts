import { Operator } from "./Operator";
import { Type } from "./Type";
import { TypeProviderInterface } from "./TypeProviderInterface";


export function getDefaultImplementedOperators(): Operator[] {
  return [
    Operator.DIRECT_ASSIGNMENT,
    Operator.DIRECT_ASSIGNMENT_OLD_VAL,
    Operator.TYPE_CAST,
    Operator.LOGICAL_AND,
    Operator.LOGICAL_OR,
    Operator.LOGICAL_XOR,
    Operator.LOGICAL_NOT,
    Operator.EQUALS,
  ];
}


export function getDefaultCompatibleOperands(typeProvider: TypeProviderInterface, self: Type, operator: Operator): Type[] {
  const compatible: Type[] = [];
  switch (operator) {
    case Operator.DIRECT_ASSIGNMENT:
    case Operator.DIRECT_ASSIGNMENT_OLD_VAL:
    case Operator.EQUALS:
      compatible.push(self);
      break;
    case Operator.TYPE_CAST:
      compatible.push(typeProvider.buildTypeType(typeProvider.buildBooleanType()));
      compatible.push(typeProvider.buildTypeType(typeProvider.buildStringType()));
      break;
    case Operator.LOGICAL_AND:
    case Operator.LOGICAL_OR:
    case Operator.LOGICAL_XOR:
      compatible.push(typeProvider.buildMixedType());
      break;
    case Operator.LOGICAL_NOT:
      // unary
      break;
  }
  return compatible;
}

export function getDefaultOperatorResultType(typeProvider: TypeProviderInterface, self: Type, operator: Operator, otherType: Type | null): Type | null {
  switch (operator) {
    case Operator.DIRECT_ASSIGNMENT:
    case Operator.DIRECT_ASSIGNMENT_OLD_VAL:
      if (otherType !== null && self.assignableBy(otherType)) {
        return self;
      }
      break;
    case Operator.EQUALS:
      if (otherType === null || !self.assignableBy(otherType)) {
        break;
      }
      return typeProvider.buildBooleanType();
    case Operator.TYPE_CAST:
      if (otherType !== null && typeProvider.isTypeType(otherType)) {
        if (typeProvider.isBooleanType(typeProvider.getTypeTypeType(otherType))) {
          return typeProvider.buildBooleanType();
        }
        if (typeProvider.isStringType(typeProvider.getTypeTypeType(otherType))) {
          return typeProvider.buildStringType();
        }
      }
      break;
    case Operator.LOGICAL_AND:
    case Operator.LOGICAL_OR:
    case Operator.LOGICAL_XOR:
      if (otherType !== null) {
        return typeProvider.buildBooleanType();
      }
      break;
    case Operator.LOGICAL_NOT:
      if (otherType === null) {
        return typeProvider.buildBooleanType();
      }
      break;
  }
  return null;
}
