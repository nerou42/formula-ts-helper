import { Type } from "../Type";

/**
 * @author Timo Lehnertz
 *
 *         Represents a function argument as seen from inside a function
 */
export class InnerFunctionArgument {

  public readonly final: boolean;

  public readonly type: Type;

  public readonly name: string;

  public readonly defaultExpression: null|string;

  constructor(final: boolean, type: Type, name: string, defaultExpression: string|null) {
    this.final = final;
    this.type = type;
    this.name = name;
    this.defaultExpression = defaultExpression;
  }

  toString(): string {
    if(this.defaultExpression === null) {
      return (this.final ? 'final ' : '') + this.type.toString()+' '+this.name;
    } else {
      return (this.final ? 'final ' : '') +this.type.toString()+' '+this.name+' = '+this.defaultExpression;
    }
  }

  isOptional(): boolean {
    return this.defaultExpression !== null;
  }
}
