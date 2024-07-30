import {
  parseInbuildSpecificReturnType,
  parseInbuiltTypes,
} from "./InbuiltTypeParser";
import { Type } from "./Type";
import { SpecificReturnType } from "./functions/FunctionType";

export interface TypeDescription {
  typeName: string;
  properties?: object;
}

export type SpecificReturnTypeParser = (
  identifier: string
) => SpecificReturnType | undefined;

export type SpecificTypeParser = (
  genericTypeParser: GenericTypeParser,
  typeDescription: TypeDescription,
  specificReturnTypeParser: SpecificReturnTypeParser
) => Type | undefined;

export class GenericTypeParser {
  private parsers: SpecificTypeParser[];

  private specificReturnTypeParsers: SpecificReturnTypeParser[];

  constructor(
    parsers: SpecificTypeParser[] = [],
    specificReturnTypeParsers: SpecificReturnTypeParser[] = []
  ) {
    this.parsers = parsers;
    this.specificReturnTypeParsers = [parseInbuildSpecificReturnType].concat(
      specificReturnTypeParsers
    );
  }

  private parseSpecificReturnType(identifier: string): SpecificReturnType | undefined {
    for (const parser of this.specificReturnTypeParsers) {
      const result = parser(identifier);
      if (result) {
        return result;
      }
    }
    return undefined;
  }

  parseType(typeDescription: TypeDescription): Type {
    const parseSpecific = (identifier: string) =>
      this.parseSpecificReturnType(identifier);
    const inbuilt = parseInbuiltTypes(this, typeDescription, parseSpecific);
    if (inbuilt !== undefined) {
      return inbuilt;
    }
    for (const parser of this.parsers) {
      const result = parser(this, typeDescription, parseSpecific);
      if (result !== undefined) {
        return result;
      }
    }
    throw new Error(
      `Unable to parse type ${typeDescription.typeName}. No suitable parser found`
    );
  }
}
