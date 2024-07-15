import { Operator, OperatorHelper } from "./Operator";

const allOperators = [
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

describe('Operator', () => {
  test('toString', () => {
    for (const operator of allOperators) {
      if (operator === Operator.TYPE_CAST) {
        expect(new OperatorHelper(operator).toString('abc', 'def')).toBe(`abc(def)`);
      } else if (operator === Operator.ARRAY_ACCESS) {
        expect(new OperatorHelper(operator).toString('abc', 'def')).toBe(`abc[def]`);
      } else if (operator === Operator.CALL) {
        expect(new OperatorHelper(operator).toString('abc', 'def')).toBe(`abc(def)`);
      } else {
        expect(new OperatorHelper(operator).toString('abc', 'def')).toBe(`abc${stringifyOperator(operator as Operator)}def`);
        expect(new OperatorHelper(operator).toString(null, null)).toBe(stringifyOperator(operator as Operator));
      }
    }
  });
});

function stringifyOperator(operator: Operator) {
  switch (operator) {
    case Operator.SCOPE_RESOLUTION:
      return '::';
    case Operator.MEMBER_ACCESS:
      return '+';
    case Operator.UNARY_PLUS:
      return '+';
    case Operator.UNARY_MINUS:
      return '-';
    case Operator.LOGICAL_NOT:
      return '!';
    case Operator.NEW:
      return 'new ';
    case Operator.INSTANCEOF:
      return ' instanceof ';
    case Operator.MULTIPLICATION:
      return '*';
    case Operator.DIVISION:
      return '/';
    case Operator.MODULO:
      return '%';
    case Operator.ADDITION:
      return '+';
    case Operator.SUBTRACTION:
      return '-';
    case Operator.GREATER:
      return '>';
    case Operator.LESS:
      return '<';
    case Operator.EQUALS:
      return '==';
    case Operator.LOGICAL_AND:
      return '&&';
    case Operator.LOGICAL_OR:
      return '||';
    case Operator.LOGICAL_XOR:
      return '^';
    case Operator.DIRECT_ASSIGNMENT:
      return '=';
    case Operator.DIRECT_ASSIGNMENT_OLD_VAL:
      return '=';
    default:
      console.log(typeof operator);
      throw new Error('unknown operator ' + operator);
  }
}