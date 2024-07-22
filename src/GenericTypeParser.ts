import { parseInbuiltTypes } from "./InbuiltTypeParser";
import { Type } from "./Type";

export interface TypeDescription {
  typeName: string;
  properties?: object;
}

export type SpecificTypeParser = (genericTypeParser: GenericTypeParser, typeDescription: TypeDescription) => Type | undefined;

export class GenericTypeParser {
  
  private parsers: SpecificTypeParser[];
  
  constructor(parsers: SpecificTypeParser[] = []) {
    this.parsers = parsers;
  }

  parseType(typeDescription: TypeDescription): Type {
    const inbuilt = parseInbuiltTypes(this, typeDescription);
    if(inbuilt !== undefined) {
      return inbuilt;
    }
    for (const parser of this.parsers) {
      const result = parser(this, typeDescription);
      if (result !== undefined) {
        return result;
      }
    }
    throw new Error(`Unable to parse type ${typeDescription.typeName}. No suitable parser found`);
  }
}
