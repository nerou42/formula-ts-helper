import { Type } from "./Type";

export interface TypeDescription {
  typeName: string;
  properties?: object;
}

export class GenericTypeParser {
  
  private parsers: SpecificTypeParser[];
  
  constructor(parsers: SpecificTypeParser[] = []) {
    this.parsers = parsers;
  }

  parseType(typeDescription: TypeDescription): Type {
    for (const parser of this.parsers) {
      const result = parser(this, typeDescription);
      if (result !== undefined) {
        return result;
      }
    }
    throw new Error(`Unable to parse type ${typeDescription.typeName}. No suitable parser found`);
  }
}

export type SpecificTypeParser = (genericTypeParser: GenericTypeParser, typeDescription: TypeDescription) => Type | undefined;
