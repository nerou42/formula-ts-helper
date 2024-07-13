import { getDefaultCompatibleOperands, getDefaultImplementedOperators, getDefaultOperatorResultType } from "./BaseType";
import { BooleanType } from "./BooleanType";
import { FloatType } from "./FloatType";
import { IntegerType } from "./IntegerType";
import { Operator } from "./Operator";
import { Type } from "./Type";
import { TypeType } from "./TypeType";

/**
 * @author Timo Lehnertz
 */
export class NumberValueHelper {

  static getMostPreciseNumberType(a: Type, b: Type): Type {
    if (b instanceof FloatType) {
      return b;
    }
    return a;
  }

  static getImplementedOperators(self: IntegerType | FloatType): Operator[] {
    if (self instanceof IntegerType) {
      return getDefaultImplementedOperators().concat([
        Operator.ADDITION,
        Operator.SUBTRACTION,
        Operator.MULTIPLICATION,
        Operator.DIVISION,
        Operator.LESS,
        Operator.GREATER,
        Operator.MODULO,
        Operator.TYPE_CAST,
        Operator.UNARY_MINUS,
        Operator.UNARY_PLUS,
      ]);
    } else {
      return getDefaultImplementedOperators().concat([
        Operator.ADDITION,
        Operator.SUBTRACTION,
        Operator.MULTIPLICATION,
        Operator.DIVISION,
        Operator.LESS,
        Operator.GREATER,
        Operator.TYPE_CAST,
        Operator.UNARY_MINUS,
        Operator.UNARY_PLUS,
      ]);
    }
  }

  static getCompatibleOperands(self: IntegerType | FloatType, operator: Operator): Type[] {
    const compatible = getDefaultCompatibleOperands(self, operator);
    switch (operator) {
      case Operator.ADDITION:
      case Operator.SUBTRACTION:
      case Operator.MULTIPLICATION:
      case Operator.DIVISION:
      case Operator.LESS:
      case Operator.GREATER:
        compatible.push(new IntegerType(), new FloatType());
        break;
      case Operator.MODULO:
        if (self instanceof IntegerType) {
          compatible.push(new IntegerType());
        }
        break;
      case Operator.TYPE_CAST:
        if (self instanceof IntegerType) {
          compatible.push(new TypeType(new FloatType()));
        } else {
          compatible.push(new TypeType(new IntegerType()));
        }
        break;
    }
    return compatible;
  }

  static getOperatorResultType(typeA: IntegerType | FloatType, operator: Operator, typeB: Type | null): Type | null {
    const defaultType = getDefaultOperatorResultType(typeA, operator, typeB);
    if(defaultType !== null) {
      return defaultType;
    }
    // unary operations
    if(typeB === null) {
      switch (operator) {
        case Operator.UNARY_MINUS:
        case Operator.UNARY_PLUS:
          return typeA;
      }
    }
    // binary operations
    if (typeB === null) {
      return null;
    }
    if (operator === Operator.TYPE_CAST) {
      if (typeB instanceof TypeType) {
        if (typeB.getType() instanceof FloatType) {
          return new FloatType();
        }
        if (typeB.getType() instanceof IntegerType) {
          return new IntegerType();
        }
      }
      return null;
    }
    // number operations
    if (!(typeB instanceof IntegerType) && !(typeB instanceof FloatType)) {
      return null;
    }
    switch (operator) {
      case Operator.ADDITION:
      case Operator.SUBTRACTION:
      case Operator.MULTIPLICATION:
        return this.getMostPreciseNumberType(typeA, typeB);
      case Operator.DIVISION:
        return new FloatType();
      case Operator.MODULO:
        if (typeA instanceof IntegerType && typeB instanceof IntegerType) {
          return new IntegerType();
        }
        break;
      case Operator.GREATER:
      case Operator.LESS:
        return new BooleanType();
    }
    return null;
  }
}
