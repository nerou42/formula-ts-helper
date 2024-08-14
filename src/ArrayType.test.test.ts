import { ArrayType } from "./ArrayType";
import { getDefaultImplementedOperators } from "./BaseType";
import { IntegerType } from "./IntegerType";
import { MixedType } from "./MixedType";
import { Operator } from "./Operator";
import { StringType } from "./StringType";

describe('ArrayType', () => {
  describe('implementedOperators', () => {
    it('should implement numeric operators', () => {
      const type = new ArrayType(new MixedType(), new IntegerType());
      expect(compareOperators(type.getImplementedOperators(), getDefaultImplementedOperators().concat([Operator.ARRAY_ACCESS, Operator.MEMBER_ACCESS, Operator.ADDITION, Operator.SUBTRACTION, Operator.MULTIPLICATION, Operator.DIVISION, Operator.UNARY_PLUS, Operator.UNARY_MINUS, Operator.MODULO, Operator.TYPE_CAST]))).toBeTruthy();
    });

    it('should not implement numeric operators', () => {
      const type = new ArrayType(new MixedType(), new StringType());
      expect(compareOperators(type.getImplementedOperators(), getDefaultImplementedOperators().concat([Operator.ARRAY_ACCESS, Operator.MEMBER_ACCESS, Operator.ADDITION, Operator.TYPE_CAST]))).toBeTruthy();
    });
  });
});

function compareOperators(a: Operator[], b: Operator[]): boolean {
  for (const operator of a) {
    if(!b.includes(operator)) {
      return false;
    }
  }
  for (const operator of b) {
    if(!a.includes(operator)) {
      return false;
    }
  }
  return true;
}