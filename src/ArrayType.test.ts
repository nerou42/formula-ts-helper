import { ArrayType } from "./ArrayType";
import { NeverType } from "./NeverType";

describe('ArrayType', () => {
  it('should create an ArrayType', () => {
    expect(new ArrayType(new NeverType(), new NeverType())).toBeInstanceOf(ArrayType);
  });
});