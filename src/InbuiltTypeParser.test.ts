
import { ArrayType } from "./ArrayType";
import { BooleanType } from "./BooleanType";
import { CompoundType } from "./CompoundType";
import { DateIntervalType } from "./DateIntervalType";
import { DateTimeImmutableType } from "./DateTimeImmutableType";
import { FloatType } from "./FloatType";
import { GenericTypeParser } from "./GenericTypeParser";
import { IntegerType } from "./IntegerType";
import { MemberAccsessType } from "./MemberAccsessType";
import { MixedType } from "./MixedType";
import { NeverType } from "./NeverType";
import { NullType } from "./NullType";
import { StringType } from "./StringType";
import { Type } from "./Type";
import { TypeType } from "./TypeType";
import { VoidType } from "./VoidType";

describe('inbuildTypeParser', () => {

  const types: Type[] = [
    new ArrayType(new IntegerType(), new StringType()),
    new BooleanType(),
    CompoundType.buildFromTypes([new StringType(), new FloatType()]),
    new DateIntervalType(),
    new DateTimeImmutableType(),
    new FloatType(),
    new IntegerType(),
    new MemberAccsessType('abc'),
    new MixedType(),
    new NeverType(),
    new NullType(),
    new StringType(),
    new TypeType(new FloatType()),
    new VoidType(),
  ];

  const parser = new GenericTypeParser();

  for (const type of types) {
    test('serialize ' + type.toString(), () => {
      const serialization = JSON.stringify(type.getInterfaceType());
      const deserializedType = parser.parseType(JSON.parse(serialization));
      expect(deserializedType.equals(type)).toBeTruthy();
      expect(deserializedType).toEqual(type);
    })
  }
});