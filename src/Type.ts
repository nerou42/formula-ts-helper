import { TypeDescription } from "./GenericTypeParser";
import { Operator } from "./Operator";

/**
 * @author Timo Lehnertz
 */
export interface Type {

  equals(type: Type): boolean;

  assignableBy(type: Type): boolean;

  getImplementedOperators(): Operator[];

  getCompatibleOperands(operator: Operator): Type[];

  getOperatorResultType(operator: Operator, otherType: Type | null): Type | null;

  toString(): string;

  getInterfaceType(): TypeDescription;
}
