/**
 * @author Timo Lehnertz
 */
export enum OperatorType {
  PrefixOperator,
  InfixOperator,
  PostfixOperator,
}

export enum Operator {
  ADDITION = 0,
  SUBTRACTION = 1,
  UNARY_PLUS = 2,
  UNARY_MINUS = 3,
  MULTIPLICATION = 4,
  DIVISION = 5,
  MODULO = 6,
  EQUALS = 7,
  GREATER = 8,
  LESS = 9,
  LOGICAL_AND = 10,
  LOGICAL_OR = 11,
  DIRECT_ASSIGNMENT = 12,
  DIRECT_ASSIGNMENT_OLD_VAL = 13,
  MEMBER_ACCESS = 14,
  SCOPE_RESOLUTION = 15,
  LOGICAL_NOT = 16,
  LOGICAL_XOR = 17,
  INSTANCEOF = 18,
  NEW = 19,
  ARRAY_ACCESS = 20,
  CALL = 21,
  TYPE_CAST = 22,
}

export class OperatorHelper {

  public constructor(public readonly operatorType: Operator) { }

  toString(leftExpression: null|string, rightExpression: null|string): string {
    leftExpression ??= '';
    rightExpression ??= '';
    switch (this.operatorType) {
      case Operator.SCOPE_RESOLUTION:
        return leftExpression + '::' + rightExpression;
      case Operator.MEMBER_ACCESS:
        return leftExpression + '+' + rightExpression;
      case Operator.UNARY_PLUS:
        return leftExpression + '+' + rightExpression;
      case Operator.UNARY_MINUS:
        return leftExpression + '-' + rightExpression;
      case Operator.LOGICAL_NOT:
        return leftExpression + '!' + rightExpression;
      case Operator.NEW:
        return leftExpression + 'new ' + rightExpression;
      case Operator.INSTANCEOF:
        return leftExpression + ' instanceof ' + rightExpression;
      case Operator.MULTIPLICATION:
        return leftExpression + '*' + rightExpression;
      case Operator.DIVISION:
        return leftExpression + '/' + rightExpression;
      case Operator.MODULO:
        return leftExpression + '%' + rightExpression;
      case Operator.ADDITION:
        return leftExpression + '+' + rightExpression;
      case Operator.SUBTRACTION:
        return leftExpression + '-' + rightExpression;
      case Operator.GREATER:
        return leftExpression + '>' + rightExpression;
      case Operator.LESS:
        return leftExpression + '<' + rightExpression;
      case Operator.EQUALS:
        return leftExpression + '==' + rightExpression;
      case Operator.LOGICAL_AND:
        return leftExpression + '&&' + rightExpression;
      case Operator.LOGICAL_OR:
        return leftExpression + '||' + rightExpression;
      case Operator.LOGICAL_XOR:
        return leftExpression + '^' + rightExpression;
      case Operator.DIRECT_ASSIGNMENT:
        return leftExpression + '=' + rightExpression;
      case Operator.DIRECT_ASSIGNMENT_OLD_VAL:
        return leftExpression + '=' + rightExpression;
      case Operator.TYPE_CAST:
        return leftExpression + '(' + rightExpression + ')';
      case Operator.ARRAY_ACCESS:
        return leftExpression + '[' + rightExpression + ']';
      case Operator.CALL:
        return leftExpression + '(' + rightExpression + ')';
    }
  }

  getOperatorType(): OperatorType {
    switch (this.operatorType) {
      case Operator.ADDITION:
      case Operator.SUBTRACTION:
      case Operator.MULTIPLICATION:
      case Operator.DIVISION:
      case Operator.MODULO:
      case Operator.EQUALS:
      case Operator.GREATER:
      case Operator.LESS:
      case Operator.LOGICAL_AND:
      case Operator.DIRECT_ASSIGNMENT:
      case Operator.DIRECT_ASSIGNMENT_OLD_VAL:
      case Operator.MEMBER_ACCESS:
      case Operator.SCOPE_RESOLUTION:
      case Operator.LOGICAL_XOR:
      case Operator.INSTANCEOF:
      case Operator.LOGICAL_OR:
      case Operator.CALL:
      case Operator.TYPE_CAST:
      case Operator.ARRAY_ACCESS:
        return OperatorType.InfixOperator;
      case Operator.NEW:
      case Operator.UNARY_PLUS:
      case Operator.UNARY_MINUS:
      case Operator.LOGICAL_NOT:
        return OperatorType.PrefixOperator;
    }
  }
  static getAllOperators(): Operator[] {
    return [
      Operator.ADDITION,
      Operator.SUBTRACTION,
      Operator.UNARY_PLUS,
      Operator.UNARY_MINUS,
      Operator.MULTIPLICATION,
      Operator.DIVISION,
      Operator.MODULO,
      Operator.EQUALS,
      Operator.GREATER,
      Operator.LESS,
      Operator.LOGICAL_AND,
      Operator.LOGICAL_OR,
      Operator.DIRECT_ASSIGNMENT,
      Operator.DIRECT_ASSIGNMENT_OLD_VAL,
      Operator.MEMBER_ACCESS,
      Operator.SCOPE_RESOLUTION,
      Operator.LOGICAL_NOT,
      Operator.LOGICAL_XOR,
      Operator.INSTANCEOF,
      Operator.NEW,
      Operator.ARRAY_ACCESS,
      Operator.CALL,
      Operator.TYPE_CAST,
    ];
  }
}
