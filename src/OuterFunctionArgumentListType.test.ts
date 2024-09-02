import { FloatType } from "./FloatType";
import { IntegerType } from "./IntegerType";
import { StringType } from "./StringType";
import { OuterFunctionArgument } from "./functions/OuterFunctionArgument";
import { OuterFunctionArgumentListType } from "./functions/OuterFunctionArgumentListType";

describe('OuterFunctionArgumentListType', () => {
  it('should throw an error because vargs need at least one argument', () => {
    expect(() => new OuterFunctionArgumentListType([], true)).toThrow('Vargs argument must have at least one argument');
  });

  it('should throw an error because varg parameter must be optional', () => {
    expect(() => new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), false, true, 'i')], true)).toThrow('Varg parameter must be optional');
  });

  it('should throw an error because Optional parameter can\'t be followed by VArgs', () => {
    expect(() => new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), true, false, 'i'), new OuterFunctionArgument(new IntegerType(), true, true, 'i')], true)).toThrow('Optional parameter can\'t be followed by VArgs');
  });

  it('should throw an error because Not optional parameter cannot follow optional parameter', () => {
    expect(() => new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), true, false, 'i'), new OuterFunctionArgument(new IntegerType(), false, false, 'i')], false)).toThrow('Not optional parameter cannot follow optional parameter');
  });

  test('getMaxArgumentCount', () => {
    expect(new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), true, true, 'i')], true).getMaxArgumentCount()).toBe(Number.MAX_SAFE_INTEGER);
    expect(new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), true, false, 'i')], false).getMaxArgumentCount()).toBe(1);
  });

  test('getMinArgumentCount', () => {
    expect(new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), true, true, 'i')], true).getMinArgumentCount()).toBe(0);
    expect(new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), false, false, 'i')], false).getMinArgumentCount()).toBe(1);
  });

  test('getArgument', () => {
    expect(new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), true, true, 'i')], true).getArgument(0).type).toBeInstanceOf(IntegerType);
    expect(new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), true, true, 'i')], true).getArgument(10).type).toBeInstanceOf(IntegerType);
    expect(() => new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), false, false, 'i')], false).getArgument(10).type).toThrow('Index out of bounds');
  });

  describe('assignableBy', () => {
    it('should be assignable', () => {
      const typeA = new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), false, false, 'i')], false);
      const typeB = new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), false, false, 'i')], false);
      expect(typeA.assignableBy(typeB)).toBeTruthy();
    });

    it('should be assignable with cast', () => {
      const typeA = new OuterFunctionArgumentListType([new OuterFunctionArgument(new FloatType(), false, false, 'i')], false);
      const typeB = new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), false, false, 'i')], false);
      expect(typeA.assignableBy(typeB)).toBeTruthy();
    });

    it('should be assignable by extending optional arguments', () => {
      const typeA = new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), true, true, 'i')], true);
      const typeB = new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), false, false, 'i'), new OuterFunctionArgument(new IntegerType(), true, true, 'i')], true);
      expect(typeA.assignableBy(typeB)).toBeTruthy();
    });

    it('should not be assignable', () => {
      const typeA = new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), false, false, 'i'), new OuterFunctionArgument(new IntegerType(), false, false, 'i')], false);
      const typeB = new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), true, true, 'i')], true);
      expect(typeA.assignableBy(typeB)).toBeFalsy();
    });

    it('should not be assignable because of differing types', () => {
      const typeA = new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), false, false, 'i')], false);
      const typeB = new OuterFunctionArgumentListType([new OuterFunctionArgument(new StringType(), false, false, 'i')], false);
      expect(typeA.assignableBy(typeB)).toBeFalsy();
    });
  })

  describe('equals', () => {
    it('should equal', () => {
      const typeA = new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), false, false, 'i')], false);
      const typeB = new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), false, false, 'i')], false);
      expect(typeA.equals(typeB)).toBeTruthy();
    });

    it('should not equal', () => {
      const typeA = new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), false, false, 'i')], false);
      const typeB = new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), true, true, 'i')], true);
      expect(typeA.equals(typeB)).toBeFalsy();
    });

    it('should not equal because of differing types', () => {
      const typeA = new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), false, false, 'i')], false);
      const typeB = new OuterFunctionArgumentListType([new OuterFunctionArgument(new StringType(), false, false, 'i')], false);
      expect(typeA.equals(typeB)).toBeFalsy();
    });
  });

  test('toString', () => {
    const typeA = new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), true, true, 'i')], true);
    expect(typeA.toString()).toBe('(int... i)');
  })
});