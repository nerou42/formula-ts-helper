import { BooleanType } from "./BooleanType";
import { MixedType } from "./MixedType";
import { StringType } from "./StringType";
import { Type } from "./Type";
import { TypeProviderInterface } from "./TypeProviderInterface";
import { TypeType } from "./TypeType";

/**
 * @author Timo Lehnertz
 */
export class TypeProvider implements TypeProviderInterface {
  isTypeType(type: Type): boolean {
    return type instanceof TypeType;
  }

  isBooleanType(type: Type): boolean {
    return type instanceof BooleanType;
  }
  
  isStringType(type: Type): boolean {
    return type instanceof StringType;
  }

  buildMixedType(): Type {
    return new MixedType();
  }
  
  buildBooleanType(): Type {
    return new BooleanType();
  }
  
  buildStringType(): Type {
    return new StringType();
  }

  buildTypeType(type: Type): Type {
    return new TypeType(type);
  }

  getTypeTypeType(type: Type): Type {
    if(!(type instanceof TypeType)) {
      throw new Error("Not TypeType");
    } else {
      return type.getType();
    }
  }
}
