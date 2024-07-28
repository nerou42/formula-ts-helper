import { ArrayType } from "./ArrayType";
import { BooleanType } from "./BooleanType";
import { CompoundType } from "./CompoundType";
import { DateIntervalType } from "./DateIntervalType";
import { DateTimeImmutableType } from "./DateTimeImmutableType";
import { EnumInstanceType } from "./EnumInstanceType";
import { EnumTypeType } from "./EnumTypeType";
import { FloatType } from "./FloatType";
import { GenericTypeParser, SpecificReturnTypeParser, SpecificTypeParser, TypeDescription } from "./GenericTypeParser";
import { IntegerType } from "./IntegerType";
import { MemberAccsessType } from "./MemberAccsessType";
import { MixedType } from "./MixedType";
import { NeverType } from "./NeverType";
import { NullType } from "./NullType";
import { StringType } from "./StringType";
import { Type } from "./Type";
import { TypeType } from "./TypeType";
import { VoidType } from "./VoidType";
import { ClassType } from "./classes/ClassType";
import { ClassTypeType } from "./classes/ClassTypeType";
import { ConstructorType } from "./classes/ConstructorType";
import { FieldType } from "./classes/FieldType";
import { FunctionType, SpecificReturnType } from "./functions/FunctionType";
import { OuterFunctionArgument } from "./functions/OuterFunctionArgument";
import { OuterFunctionArgumentListType } from "./functions/OuterFunctionArgumentListType";

interface ClassTypeDescriptionAbstract {
  properties: {
    parentType: ClassTypeDescription | null;
    identifier: string;
    fields: {
      identifier: string;
      type: ClassTypeDescription;
      final: boolean;
    }[];
  }
}

interface ClassTypeDescription extends ClassTypeDescriptionAbstract {
  typeName: 'ClassType';
}

interface ClassTypeTypeDescription {
  typeName: 'ClassTypeType';
  properties: {
    constructorType: ConstructorTypeDescription;
  }
}

interface FunctionTypeDescriptionAbstract {
  properties: {
    arguments: OuterFunctionArgumentListTypeDescription;
    generalReturnType: TypeDescription;
    specificReturnType: string | null;
  }
}

interface ConstructorTypeDescription extends FunctionTypeDescriptionAbstract {
  typeName: 'ConstructorType';
}


interface FunctionTypeDescription extends FunctionTypeDescriptionAbstract {
  typeName: 'FunctionType';
}

interface OuterFunctionArgumentListTypeDescription {
  typeName: 'OuterFunctionArgumentListType';
  properties: {
    varg: boolean;
    arguments: {
      name: string;
      optional: boolean;
      type: TypeDescription;
    }[];
  }
}

interface ArrayTypeDescription {
  typeName: 'ArrayType';
  properties: {
    keyType: TypeDescription;
    elementsType: TypeDescription;
  }
}


interface BooleanTypeDescription {
  typeName: 'BooleanType';
  properties: {
    keyType: TypeDescription;
    elementsType: TypeDescription;
  }
}

interface CompoundTypeDescription {
  typeName: 'CompoundType';
  properties: {
    types: TypeDescription[];
  }
}

interface DateIntervalTypeDescription {
  typeName: 'DateIntervalType';
}

interface DateTimeImmutableTypeDescription {
  typeName: 'DateTimeImmutableType';
}

interface EnumInstanceTypeDescription {
  typeName: 'EnumInstanceType';
  properties: {
    enumType: EnumTypeTypeDescription;
  }
}

interface EnumTypeTypeDescription extends ClassTypeDescriptionAbstract {
  typeName: 'EnumTypeType';
}

interface FloatTypeDescription {
  typeName: 'FloatType';
}

interface IntegerTypeDescription {
  typeName: 'IntegerType';
}

interface MemberAccsessTypeDescription {
  typeName: 'MemberAccsessType';
  properties: {
    memberIdentifier: string;
  }
}

interface MixedTypeDescription {
  typeName: 'MixedType';
}

interface NeverTypeDescription {
  typeName: 'NeverType';
}

interface NullTypeDescription {
  typeName: 'NullType';
}

interface StringTypeDescription {
  typeName: 'StringType';
}

interface TypeTypeDescription {
  typeName: 'TypeType';
  properties: {
    type: TypeDescription;
  }
}

interface VoidTypeDescription {
  typeName: 'VoidType';
}

export function parseInbuildSpecificReturnType(specificReturnType: string): SpecificReturnType | undefined {
  switch (specificReturnType) {
    case 'FORMULA_REDUCE':
    case 'FORMULA_ARRAY_FILTER':
      return (args: OuterFunctionArgumentListType) => args.getArgumentType(0);
    case 'FORMULA_FIRST_OR_NULL':
      return (args: OuterFunctionArgumentListType) => {
        const type = args.getArgumentType(0);
        if (type instanceof ArrayType) {
          if (type.getElementsType() instanceof NeverType) {
            return new NullType();
          }
          return CompoundType.buildFromTypes([new NullType(), type.getElementsType()]);
        } else {
          throw new Error('Invalid type ' + type);
        }
      }
    case 'FORMULA_EARLY_RETURN_IF_NULL':
      return (args: OuterFunctionArgumentListType) => {
        const type = args.getArgumentType(0);
        if (type instanceof CompoundType) {
          return type.eliminateType(new NullType());
        } else if (type instanceof NullType) {
          return new NeverType();
        } else {
          return type;
        }
      }
    default: return undefined;
  }
}

function parseClassType(genericTypeParser: GenericTypeParser, typeDescription: ClassTypeDescription): ClassType {
  const parentType = typeDescription.properties.parentType !== null ? parseClassType(genericTypeParser, typeDescription.properties.parentType) : null;
  const fields = new Map<string, FieldType>();
  for (const field of typeDescription.properties.fields) {
    fields.set(field.identifier, new FieldType(field.final, genericTypeParser.parseType(field.type)));
  }
  return new ClassType(parentType, typeDescription.properties.identifier, fields);
}

function parseCompoundType(genericTypeParser: GenericTypeParser, typeDescription: CompoundTypeDescription): CompoundType {
  const types = [];
  for (const type of typeDescription.properties.types) {
    types.push(genericTypeParser.parseType(type));
  }
  return new CompoundType(types);
}

function parseOuterArgumentsType(genericTypeParser: GenericTypeParser, typeDescription: OuterFunctionArgumentListTypeDescription): OuterFunctionArgumentListType {
  const outerArguments = [];
  let i = 0;
  for (const argument of typeDescription.properties.arguments) {
    let varg = i === typeDescription.properties.arguments.length - 1 && typeDescription.properties.varg;
    outerArguments.push(new OuterFunctionArgument(genericTypeParser.parseType(argument.type), argument.optional, varg, argument.name));
    i++;
  }
  return new OuterFunctionArgumentListType(outerArguments, typeDescription.properties.varg);
}

function parseConstructorType(genericTypeParser: GenericTypeParser, typeDescription: ConstructorTypeDescription): ConstructorType {
  const outerArguments = parseOuterArgumentsType(genericTypeParser, typeDescription.properties.arguments);
  return new ConstructorType(outerArguments, parseClassType(genericTypeParser, typeDescription.properties.generalReturnType as ClassTypeDescription));
}

function parseFunctionType(genericTypeParser: GenericTypeParser, typeDescription: FunctionTypeDescription, specificReturnTypeParser: SpecificReturnTypeParser): FunctionType | undefined {
  const outerArguments = parseOuterArgumentsType(genericTypeParser, typeDescription.properties.arguments);
  let specificReturnType = null;
  if(typeDescription.properties.specificReturnType !== null) {
    specificReturnType = specificReturnTypeParser(typeDescription.properties.specificReturnType);
    if (specificReturnType === undefined) {
      return undefined;
    }
  }
  return new FunctionType(outerArguments, genericTypeParser.parseType(typeDescription.properties.generalReturnType), specificReturnType);
}

function parseEnumTypeType(genericTypeParser: GenericTypeParser, typeDescription: EnumTypeTypeDescription): EnumTypeType {
  const cases = [];
  for (const field of typeDescription.properties.fields) {
    cases.push(field.identifier);
  }
  return new EnumTypeType(typeDescription.properties.identifier, cases);
}

type InbuiltTypeDescription = ClassTypeDescription | ClassTypeTypeDescription | ConstructorTypeDescription | FunctionTypeDescription | OuterFunctionArgumentListTypeDescription | ArrayTypeDescription | BooleanTypeDescription | CompoundTypeDescription | DateIntervalTypeDescription | DateTimeImmutableTypeDescription | EnumInstanceTypeDescription | EnumTypeTypeDescription | FloatTypeDescription | IntegerTypeDescription | MemberAccsessTypeDescription | MixedTypeDescription | NeverTypeDescription | NullTypeDescription | StringTypeDescription | TypeTypeDescription | VoidTypeDescription;

export const parseInbuiltTypes: SpecificTypeParser = ((parser: GenericTypeParser, type: InbuiltTypeDescription, specificReturnTypeParser: SpecificReturnTypeParser): Type | undefined => {
  switch (type.typeName) {
    case 'ArrayType':
      return new ArrayType(parser.parseType(type.properties.keyType), parser.parseType(type.properties.elementsType));
    case 'BooleanType':
      return new BooleanType();
    case 'ClassType':
      return parseClassType(parser, type);
    case 'ClassTypeType':
      return new ClassTypeType(parseConstructorType(parser, type.properties.constructorType));
    case 'CompoundType':
      return parseCompoundType(parser, type);
    case 'ConstructorType':
      return parseConstructorType(parser, type);
    case 'FunctionType':
      return parseFunctionType(parser, type, specificReturnTypeParser);
    case 'DateIntervalType':
      return new DateIntervalType();
    case 'DateTimeImmutableType':
      return new DateTimeImmutableType();
    case 'EnumInstanceType':
      return new EnumInstanceType(parseEnumTypeType(parser, type.properties.enumType));
    case 'EnumTypeType':
      return parseEnumTypeType(parser, type);
    case 'FloatType':
      return new FloatType();
    case 'IntegerType':
      return new IntegerType();
    case 'MemberAccsessType':
      return new MemberAccsessType(type.properties.memberIdentifier);
    case 'MixedType':
      return new MixedType();
    case 'NeverType':
      return new NeverType();
    case 'NullType':
      return new NullType();
    case 'OuterFunctionArgumentListType':
      return parseOuterArgumentsType(parser, type);
    case 'StringType':
      return new StringType();
    case 'TypeType':
      return new TypeType(parser.parseType(type.properties.type));
    case 'VoidType':
      return new VoidType();
    default:
      return undefined;
  }
}) as SpecificTypeParser; // the type of typeDescription doesn't quite match the expected Type TypeDescription but as long as there are no custom defined types with ambiguous typeNames we are fine with this little lie