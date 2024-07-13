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
}
