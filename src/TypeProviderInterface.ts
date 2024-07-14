import { Type } from "./Type";

/**
 * @author Timo Lehnertz
 */
export interface TypeProviderInterface {
  buildBooleanType(): Type;
  buildStringType(): Type;
  buildTypeType(type: Type): Type;
  buildMixedType(): Type;

  isTypeType(type: Type): boolean;
  isBooleanType(type: Type): boolean;
  isStringType(type: Type): boolean;
  
  getTypeTypeType(type: Type): Type;
}
