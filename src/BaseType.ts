import { BooleanType } from "./BooleanType";
import { MixedType } from "./MixedType";
import { Operator } from "./Operator";
import { StringType } from "./StringType";
import { Type } from "./Type";
import { TypeType } from "./TypeType";


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


export function getDefaultCompatibleOperands(self: Type, operator: Operator): Type[] {
  const compatible: Type[] = [];
  switch (operator) {
    case Operator.DIRECT_ASSIGNMENT:
    case Operator.DIRECT_ASSIGNMENT_OLD_VAL:
    case Operator.EQUALS:
      compatible.push(self);
      break;
    case Operator.TYPE_CAST:
      compatible.push(new TypeType(new BooleanType()));
      compatible.push(new TypeType(new StringType()));
      break;
    case Operator.LOGICAL_AND:
    case Operator.LOGICAL_OR:
    case Operator.LOGICAL_XOR:
      compatible.push(new MixedType());
      break;
    case Operator.LOGICAL_NOT:
      // unary
      break;
  }
  return compatible;
}

export function getDefaultOperatorResultType(self: Type, operator: Operator, otherType: Type | null): Type | null {
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
      return new BooleanType();
    case Operator.TYPE_CAST:
      if (otherType instanceof TypeType) {
        if (otherType.getType() instanceof BooleanType) {
          return new BooleanType();
        }
        if (otherType.getType().equals(new StringType())) {
          return new StringType();
        }
      }
      break;
    case Operator.LOGICAL_AND:
    case Operator.LOGICAL_OR:
    case Operator.LOGICAL_XOR:
      if (otherType !== null) {
        return new BooleanType();
      }
      break;
    case Operator.LOGICAL_NOT:
      if (otherType === null) {
        return new BooleanType();
      }
      break;
  }
  return null;
}
