import { Operator } from "./Operator";

export class OperatorParser {
  static parseOperator(id: number): Operator {
    switch (id) {
      case 0: return Operator.ADDITION;
      case 1: return Operator.SUBTRACTION;
      case 2: return Operator.UNARY_PLUS;
      case 3: return Operator.UNARY_MINUS;
      case 4: return Operator.MULTIPLICATION;
      case 5: return Operator.DIVISION;
      case 6: return Operator.MODULO;
      case 7: return Operator.EQUALS;
      case 8: return Operator.GREATER;
      case 9: return Operator.LESS;
      case 10: return Operator.LOGICAL_AND;
      case 11: return Operator.LOGICAL_OR;
      case 12: return Operator.DIRECT_ASSIGNMENT;
      case 13: return Operator.DIRECT_ASSIGNMENT_OLD_VAL;
      case 14: return Operator.MEMBER_ACCESS;
      case 15: return Operator.SCOPE_RESOLUTION;
      case 16: return Operator.LOGICAL_NOT;
      case 17: return Operator.LOGICAL_XOR;
      case 18: return Operator.INSTANCEOF;
      case 19: return Operator.NEW;
      case 20: return Operator.ARRAY_ACCESS;
      case 21: return Operator.CALL;
      case 22: return Operator.TYPE_CAST;
      default: throw Error('unknown Operator index ' + id);
    }
  }
}