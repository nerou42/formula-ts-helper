import { ConstructorTypeDescription } from "../InbuiltTypeParser";
import { FunctionType } from "../functions/FunctionType";
import { OuterFunctionArgumentListType } from "../functions/OuterFunctionArgumentListType";
import { ClassType } from "./ClassType";

/**
 * @author Timo Lehnertz
 */
export class ConstructorType extends FunctionType {

  constructor(outerArguments: OuterFunctionArgumentListType, classType: ClassType) {
    super(outerArguments, classType);
  }

  override getInterfaceType(): ConstructorTypeDescription {
    return {
      typeName: 'ConstructorType',
      properties: {
        arguments: this.arguments.getInterfaceType(),
        generalReturnType: this.generalReturnType.getInterfaceType(),
        specificReturnType: null, // @fixme
      }
    }
  }
}
