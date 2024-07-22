import { getDefaultImplementedOperators } from "./BaseType";
import { CompoundType } from "./CompoundType";
import { IntegerType } from "./IntegerType";
import { IteratableType } from "./IteratableType";
import { NeverType } from "./NeverType";
import { Operator } from "./Operator";
import { Type } from "./Type";
import { TypeType } from "./TypeType";
import { ClassType } from "./classes/ClassType";
import { FieldType } from "./classes/FieldType";

/**
 * @author Timo Lehnertz
 */
export class ArrayType extends ClassType implements IteratableType {

  private readonly keyType: Type;

  private readonly elementsType: Type;

  constructor(keyType: Type, elementsType: Type) {
    super(null, 'array', new Map([['length', new FieldType(true, new IntegerType())]]));
    this.keyType = keyType;
    this.elementsType = elementsType;
  }

  assignableBy(type: Type): boolean {
    if (!(type instanceof ArrayType)) {
      return false;
    }
    const keysCompatible = this.keyType.assignableBy(type.keyType) || (type.keyType instanceof NeverType);
    const elementsCompatible = this.elementsType.assignableBy(type.elementsType) || (type.elementsType instanceof NeverType);
    return keysCompatible && elementsCompatible;
  }

  equals(type: Type): boolean {
    if (!(type instanceof ArrayType)) {
      return false;
    }
    return this.keyType.equals(type.keyType) && this.elementsType.equals(type.elementsType);
  }

  toString(): string {
    if (this.keyType instanceof IntegerType) {
      if (this.elementsType instanceof CompoundType) {
        return '(' + this.elementsType.toString() + ')';
      } else {
        return this.elementsType.toString() + '[]';
      }
    } else {
      return 'array<' + this.keyType.toString() + ',' + this.elementsType.toString() + '>';
    }
  }

  getImplementedOperators(): Operator[] {
    return getDefaultImplementedOperators().concat([Operator.ARRAY_ACCESS, Operator.MEMBER_ACCESS, Operator.ADDITION, Operator.SUBTRACTION, Operator.MULTIPLICATION, Operator.DIVISION, Operator.UNARY_PLUS, Operator.UNARY_MINUS, Operator.MODULO, Operator.TYPE_CAST]);
  }

  getCompatibleOperands(operator: Operator): Type[] {
    const compatible = super.getCompatibleOperands(operator);
    switch (operator) {
      case Operator.ARRAY_ACCESS:
        compatible.push(this.keyType);
        break;
      case Operator.ADDITION:
      case Operator.SUBTRACTION:
      case Operator.MULTIPLICATION:
      case Operator.DIVISION:
      case Operator.UNARY_PLUS:
      case Operator.UNARY_MINUS:
      case Operator.MODULO:
        const operands = this.elementsType.getCompatibleOperands(operator);
        compatible.push(...operands, new ArrayType(this.keyType, CompoundType.buildFromTypes(operands)));
        break;
      case Operator.TYPE_CAST:
        const elementCasts = this.elementsType.getCompatibleOperands(operator);
        for (const elementCast of elementCasts) {
          if (elementCast instanceof TypeType) {
            compatible.push(new TypeType(new ArrayType(this.keyType, elementCast.getType())));
          }
        }
        break;
    }
    return compatible;
  }

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null {
    const defaultResult = super.getOperatorResultType(operator, otherType);
    if (defaultResult !== null) {
      return defaultResult;
    }
    switch (operator) {
      case Operator.ARRAY_ACCESS:
        if (otherType !== null && this.keyType.assignableBy(otherType)) {
          return this.elementsType;
        }
        break;
      case Operator.ADDITION:
      case Operator.SUBTRACTION:
      case Operator.MULTIPLICATION:
      case Operator.DIVISION:
      case Operator.UNARY_PLUS:
      case Operator.UNARY_MINUS:
      case Operator.MODULO:
        if (otherType instanceof ArrayType) {
          otherType = otherType.elementsType;
        }
        const result = this.elementsType.getOperatorResultType(operator, otherType);
        if (result !== null) {
          return new ArrayType(this.keyType, result);
        }
        break;
      case Operator.TYPE_CAST:
        if ((otherType instanceof TypeType) && otherType.getType() instanceof ArrayType) {
          const result = this.elementsType.getOperatorResultType(operator, new TypeType((otherType.getType() as ArrayType).elementsType));
          if (result !== null) {
            return new ArrayType(this.keyType, result);
          }
        }
        break;
    }
    return null;
  }

  getKeyType(): Type {
    return this.keyType;
  }

  getElementsType(): Type {
    return this.elementsType;
  }
}
