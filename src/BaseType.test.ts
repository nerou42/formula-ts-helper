import { ArrayType } from "./ArrayType";
import { BooleanType } from "./BooleanType";
import { CompoundType } from "./CompoundType";
import { DateIntervalType } from "./DateIntervalType";
import { DateTimeImmutableType } from "./DateTimeImmutableType";
import { EnumInstanceType } from "./EnumInstanceType";
import { EnumTypeType } from "./EnumTypeType";
import { FloatType } from "./FloatType";
import { IntegerType } from "./IntegerType";
import { MemberAccsessType } from "./MemberAccsessType";
import { MixedType } from "./MixedType";
import { NeverType } from "./NeverType";
import { NullType } from "./NullType";
import { Operator } from "./Operator";
import { StringType } from "./StringType";
import { Type } from "./Type";
import { TypeType } from "./TypeType";
import { VoidType } from "./VoidType";
import { ClassType } from "./classes/ClassType";
import { ClassTypeType } from "./classes/ClassTypeType";
import { ConstructorType } from "./classes/ConstructorType";
import { FieldType } from "./classes/FieldType";
import { FunctionType } from "./functions/FunctionType";
import { OuterFunctionArgument } from "./functions/OuterFunctionArgument";
import { OuterFunctionArgumentListType } from "./functions/OuterFunctionArgumentListType";

const testClassType = new ClassType(null, 'TestClass', new Map([['length', new FieldType(false, new IntegerType())]]));

const typeDescriptions: TypeDescription[] = [
  {
    type: new ClassType(testClassType, 'ChildClass', new Map([['stringField', new FieldType(false, new StringType())]])),
    operatorDescriptions: [
      {
        operator: Operator.MEMBER_ACCESS,
        compatibleTypes: [
          {
            operandType: new MemberAccsessType('length'),
            resultType: new IntegerType()
          }, {
            operandType: new MemberAccsessType('stringField'),
            resultType: new StringType()
          }
        ]
      }
    ],
    notEqualType: [testClassType, new IntegerType()],
  }, {
    type: new ClassTypeType(new ConstructorType(new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), false, false, 'i')], false), testClassType)),
    operatorDescriptions: [
      {
        operator: Operator.NEW,
        compatibleTypes: [
          {
            operandType: null,
            resultType: new ConstructorType(new OuterFunctionArgumentListType([new OuterFunctionArgument(new IntegerType(), false, false, 'i')], false), testClassType),
          }
        ]
      }
    ]
  }, {
    type: new FunctionType(new OuterFunctionArgumentListType([], false), new IntegerType()),
    operatorDescriptions: [
      {
        operator: Operator.CALL,
        compatibleTypes: [{
          operandType: new OuterFunctionArgumentListType([], false),
          resultType: new IntegerType()
        }]
      }
    ]
  }, {
    type: new OuterFunctionArgumentListType([], false),
  }, {
    type: new ConstructorType(new OuterFunctionArgumentListType([], false), testClassType),
    operatorDescriptions: [
      {
        operator: Operator.CALL,
        compatibleTypes: [{
          operandType: new OuterFunctionArgumentListType([], false),
          resultType: testClassType
        }]
      }
    ]
  },
  {
    type: new ArrayType(new IntegerType(), new StringType()),
    operatorDescriptions: [
      {
        operator: Operator.ARRAY_ACCESS,
        compatibleTypes: [
          {
            operandType: new IntegerType(),
            resultType: new StringType(),
          }
        ]
      }, {
        operator: Operator.TYPE_CAST,
        compatibleTypes: [
          { operandType: new TypeType(new BooleanType()), resultType: new BooleanType() },
          { operandType: new TypeType(new StringType()), resultType: new StringType() },
          { operandType: new TypeType(new ArrayType(new IntegerType(), new BooleanType())), resultType: new ArrayType(new IntegerType(), new BooleanType()) },
          { operandType: new TypeType(new ArrayType(new IntegerType(), new StringType())), resultType: new ArrayType(new IntegerType(), new StringType()) },
        ]
      }, {
        operator: Operator.ADDITION,
        compatibleTypes: [
          {
            operandType: new StringType(),
            resultType: new ArrayType(new IntegerType(), new StringType()),
          }, {
            operandType: new ArrayType(new IntegerType(), new StringType()),
            resultType: new ArrayType(new IntegerType(), new StringType()),
          }
        ]
      }
    ],
    excludeTypeCasts: true,
  },
  { type: new BooleanType() },
  {
    type: CompoundType.buildFromTypes([new ArrayType(new IntegerType(), new IntegerType()), testClassType]),
    operatorDescriptions: [{
      operator: Operator.MEMBER_ACCESS,
      compatibleTypes: [
        {
          operandType: new MemberAccsessType('length'),
          resultType: new IntegerType(),
        }
      ]
    }]
  },
  { type: new DateIntervalType() },
  {
    type: new DateTimeImmutableType(),
    operatorDescriptions: [
      {
        operator: Operator.ADDITION,
        compatibleTypes: [{
          operandType: new DateIntervalType(),
          resultType: new DateTimeImmutableType(),
        }]
      }, {
        operator: Operator.SUBTRACTION,
        compatibleTypes: [{
          operandType: new DateIntervalType(),
          resultType: new DateTimeImmutableType(),
        }]
      }
    ]
  },
  {
    type: new EnumInstanceType(new EnumTypeType('Enum', ['a', 'b'])),
  },
  {
    type: new EnumTypeType('Enum', ['a', 'b']),
    operatorDescriptions: [
      {
        operator: Operator.MEMBER_ACCESS,
        compatibleTypes: [
          {
            operandType: new MemberAccsessType('a'),
            resultType: new EnumInstanceType(new EnumTypeType('Enum', ['a', 'b'])),
          }, {
            operandType: new MemberAccsessType('b'),
            resultType: new EnumInstanceType(new EnumTypeType('Enum', ['a', 'b'])),
          }
        ]
      }
    ]
  },
  {
    type: new FloatType(),
    excludeTypeCasts: true,
    operatorDescriptions: [
      {
        operator: Operator.ADDITION,
        compatibleTypes: [
          { operandType: new IntegerType(), resultType: new FloatType() },
          { operandType: new FloatType(), resultType: new FloatType() },
        ]
      }, {
        operator: Operator.SUBTRACTION,
        compatibleTypes: [
          { operandType: new IntegerType(), resultType: new FloatType() },
          { operandType: new FloatType(), resultType: new FloatType() },
        ]
      }, {
        operator: Operator.MULTIPLICATION,
        compatibleTypes: [
          { operandType: new IntegerType(), resultType: new FloatType() },
          { operandType: new FloatType(), resultType: new FloatType() },
        ]
      }, {
        operator: Operator.DIVISION,
        compatibleTypes: [
          { operandType: new IntegerType(), resultType: new FloatType() },
          { operandType: new FloatType(), resultType: new FloatType() },
        ]
      }, {
        operator: Operator.LESS,
        compatibleTypes: [
          { operandType: new IntegerType(), resultType: new BooleanType() },
          { operandType: new FloatType(), resultType: new BooleanType() },
        ]
      }, {
        operator: Operator.GREATER,
        compatibleTypes: [
          { operandType: new IntegerType(), resultType: new BooleanType() },
          { operandType: new FloatType(), resultType: new BooleanType() },
        ]
      }, {
        operator: Operator.TYPE_CAST,
        compatibleTypes: [
          { operandType: new TypeType(new BooleanType()), resultType: new BooleanType() },
          { operandType: new TypeType(new StringType()), resultType: new StringType() },
          { operandType: new TypeType(new IntegerType()), resultType: new IntegerType() },
        ],
      }, {
        operator: Operator.UNARY_MINUS,
        compatibleTypes: [{ operandType: null, resultType: new FloatType() }],
      }, {
        operator: Operator.UNARY_PLUS,
        compatibleTypes: [{ operandType: null, resultType: new FloatType() }],
      }
    ]
  },
  {
    type: new IntegerType(),
    excludeTypeCasts: true,
    operatorDescriptions: [
      {
        operator: Operator.ADDITION,
        compatibleTypes: [
          { operandType: new IntegerType(), resultType: new IntegerType() },
          { operandType: new FloatType(), resultType: new FloatType() },
        ]
      }, {
        operator: Operator.SUBTRACTION,
        compatibleTypes: [
          { operandType: new IntegerType(), resultType: new IntegerType() },
          { operandType: new FloatType(), resultType: new FloatType() },
        ]
      }, {
        operator: Operator.MULTIPLICATION,
        compatibleTypes: [
          { operandType: new IntegerType(), resultType: new IntegerType() },
          { operandType: new FloatType(), resultType: new FloatType() },
        ]
      }, {
        operator: Operator.DIVISION,
        compatibleTypes: [
          { operandType: new IntegerType(), resultType: new FloatType() },
          { operandType: new FloatType(), resultType: new FloatType() },
        ]
      }, {
        operator: Operator.LESS,
        compatibleTypes: [
          { operandType: new IntegerType(), resultType: new BooleanType() },
          { operandType: new FloatType(), resultType: new BooleanType() },
        ]
      }, {
        operator: Operator.GREATER,
        compatibleTypes: [
          { operandType: new IntegerType(), resultType: new BooleanType() },
          { operandType: new FloatType(), resultType: new BooleanType() },
        ]
      }, {
        operator: Operator.TYPE_CAST,
        compatibleTypes: [
          { operandType: new TypeType(new BooleanType()), resultType: new BooleanType() },
          { operandType: new TypeType(new StringType()), resultType: new StringType() },
          { operandType: new TypeType(new FloatType()), resultType: new FloatType() },
        ],
      }, {
        operator: Operator.MODULO,
        compatibleTypes: [
          { operandType: new IntegerType(), resultType: new IntegerType() },
        ],
      }, {
        operator: Operator.UNARY_MINUS,
        compatibleTypes: [{ operandType: null, resultType: new IntegerType() }],
      }, {
        operator: Operator.UNARY_PLUS,
        compatibleTypes: [{ operandType: null, resultType: new IntegerType() }],
      }
    ]
  },
  { type: new MemberAccsessType('stuff') },
  { type: new MixedType(), notAssignableType: null },
  { type: new NeverType() },
  { type: new NullType() },
  {
    type: new StringType(),
    operatorDescriptions: [
      {
        operator: Operator.ADDITION,
        compatibleTypes: [{
          operandType: new StringType(),
          resultType: new StringType(),
        }]
      },{
        operator: Operator.MEMBER_ACCESS,
        compatibleTypes: [{
          operandType: new MemberAccsessType('length'),
          resultType: new IntegerType(),
        }]
      }
    ]
  },
  { type: new TypeType(new NeverType()) },
  { type: new VoidType() },
];

describe('All types', () => {
  // test('a', () => {
  //   expect(testClassType.equals(testClassType)).toBeTruthy();
  // })
  for (const typeDescription of typeDescriptions) {
    test(typeDescription.type.toString(), () => {
      addDefaultOperators(typeDescription);
      testType(typeDescription);
    });
  }
});

function addDefaultOperators(typeDescription: TypeDescription): void {
  typeDescription.operatorDescriptions = (typeDescription.operatorDescriptions ?? []).concat([
    {
      operator: Operator.LOGICAL_AND,
      compatibleTypes: [{ operandType: new BooleanType(), resultType: new BooleanType() }],
      forbiddenType: null,
    }, {
      operator: Operator.LOGICAL_OR,
      compatibleTypes: [{ operandType: new BooleanType(), resultType: new BooleanType() }],
      forbiddenType: null,
    }, {
      operator: Operator.LOGICAL_XOR,
      compatibleTypes: [{ operandType: new BooleanType(), resultType: new BooleanType() }],
      forbiddenType: null,
    }, {
      operator: Operator.DIRECT_ASSIGNMENT,
      compatibleTypes: [{ operandType: typeDescription.type, resultType: typeDescription.type }],
      forbiddenType: typeDescription.type instanceof MixedType ? null : undefined,
    }, {
      operator: Operator.DIRECT_ASSIGNMENT_OLD_VAL,
      compatibleTypes: [{ operandType: typeDescription.type, resultType: typeDescription.type }],
      forbiddenType: typeDescription.type instanceof MixedType ? null : undefined,
    }, {
      operator: Operator.LOGICAL_NOT,
      compatibleTypes: [{ operandType: null, resultType: new BooleanType() }],
    }, {
      operator: Operator.EQUALS,
      compatibleTypes: [
        { operandType: typeDescription.type, resultType: new BooleanType() },
        { operandType: new NullType(), resultType: new BooleanType() }
      ],
      forbiddenType: typeDescription.type instanceof MixedType ? null : undefined,
    }
  ]);
  if (!typeDescription.excludeTypeCasts) {
    typeDescription.operatorDescriptions = (typeDescription.operatorDescriptions ?? []).concat([
      {
        operator: Operator.TYPE_CAST,
        compatibleTypes: [
          { operandType: new TypeType(new BooleanType()), resultType: new BooleanType() },
          { operandType: new TypeType(new StringType()), resultType: new StringType() }
        ],
      }]);
  }
}

const invalidType: Type = {
  equals: (type) => false,
  assignableBy: (type) => false,
  getImplementedOperators: () => [],
  getCompatibleOperands: (operator) => [],
  getOperatorResultType: (operator, otherType) => null,
}

function compareImplementedOperators(expected: Operator[], actual: Operator[]): void {
  for (const expectedOperator of expected) {
    if (!actual.includes(expectedOperator)) {
      console.log(expected);
      console.log(actual);
    }
    expect(actual.includes(expectedOperator)).toBeTruthy();
  }
}

function testType(typeDescription: TypeDescription): void {
  expect(typeDescription.type.equals(typeDescription.equalType ?? typeDescription.type)).toBeTruthy();
  if(Array.isArray(typeDescription.notEqualType)) {
    for (const notEqualType of typeDescription.notEqualType) {
      expect(typeDescription.type.equals(notEqualType)).toBeFalsy();
    }
  } else {
    expect(typeDescription.type.equals(typeDescription.notEqualType ?? invalidType)).toBeFalsy();
  }


  expect(typeDescription.type.assignableBy(typeDescription.assignableType ?? typeDescription.type)).toBeTruthy();
  if (typeDescription.notAssignableType === null) {
    expect(typeDescription.type.assignableBy(invalidType)).toBeTruthy();
  } else {
    expect(typeDescription.type.assignableBy(typeDescription.notAssignableType ?? invalidType)).toBeFalsy();
  }

  compareImplementedOperators(getImplementedByTypeDescription(typeDescription), typeDescription.type.getImplementedOperators())

  for (const operatorDescription of typeDescription.operatorDescriptions ?? []) {
    const compatible = typeDescription.type.getCompatibleOperands(operatorDescription.operator);
    // console.log(operatorDescription.operator);
    // console.log(compatible);
    // console.log(getCompatibleByOperatorDescription(operatorDescription));
    // console.log(operatorDescription);
    expect(compatible.sort()).toEqual(getCompatibleByOperatorDescription(operatorDescription).sort());
    if (operatorDescription.forbiddenType !== null) {
      // if (typeDescription.type.getOperatorResultType(operatorDescription.operator, operatorDescription.forbiddenType !== undefined ? operatorDescription.forbiddenType : invalidType) !== null) {
      // console.log(typeDescription.type);
      // console.log(operatorDescription.operator);
      // console.log(typeDescription.type.getOperatorResultType(operatorDescription.operator, operatorDescription.forbiddenType !== undefined ? operatorDescription.forbiddenType : invalidType));
      // }
      expect(typeDescription.type.getOperatorResultType(operatorDescription.operator, operatorDescription.forbiddenType !== undefined ? operatorDescription.forbiddenType : invalidType)).toBeNull();
    } else {
      expect(typeDescription.type.getOperatorResultType(operatorDescription.operator, invalidType)).toBeTruthy();
    }
    let binary = true;
    for (const operatorTypeDescription of operatorDescription.compatibleTypes) {
      const resultType = typeDescription.type.getOperatorResultType(operatorDescription.operator, operatorTypeDescription.operandType);
      if (resultType === null) {
        console.log(operatorDescription.operator, operatorTypeDescription.operandType);
      }
      expect(resultType!.equals(operatorTypeDescription.resultType)).toBeTruthy();
      binary ||= operatorTypeDescription.resultType !== null;
    }
    if (!binary) {
      expect(typeDescription.type.getOperatorResultType(operatorDescription.operator, null)).toBeNull();
    }
  }
}

function getImplementedByTypeDescription(typeDescription: TypeDescription): Operator[] {
  const implemented: Operator[] = [];
  for (const operatorDescription of typeDescription.operatorDescriptions ?? []) {
    implemented.push(operatorDescription.operator);
  }
  return implemented;
}

function getCompatibleByOperatorDescription(operatorDescription: OperatorDescription): Type[] {
  let implemented: Type[] = [];
  for (const compatibleType of operatorDescription.compatibleTypes) {
    if (compatibleType.operandType) {
      if (compatibleType.operandType instanceof CompoundType) {
        implemented = implemented.concat(compatibleType.operandType.getTypes());
      } else {
        implemented.push(compatibleType.operandType);
      }
    }
  }
  return implemented;
}

interface TypeDescription {
  type: Type;
  operatorDescriptions?: OperatorDescription[];
  equalType?: Type;
  notEqualType?: Type|Type[];
  assignableType?: Type;
  notAssignableType?: Type | null;
  excludeTypeCasts?: boolean;
}

interface OperatorDescription {
  operator: Operator;
  compatibleTypes: OperatorTypeDescription[];
  forbiddenType?: Type | null;
}

interface OperatorTypeDescription {
  operandType: Type | null;
  resultType: Type;
}