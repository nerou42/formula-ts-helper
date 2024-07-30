import { GenericTypeParser } from "./GenericTypeParser";
import { FunctionTypeDescription } from "./InbuiltTypeParser";
import { Operator } from "./Operator";
import { StringType } from "./StringType";
import { FunctionType } from "./functions/FunctionType";
import { OuterFunctionArgument } from "./functions/OuterFunctionArgument";
import { OuterFunctionArgumentListType } from "./functions/OuterFunctionArgumentListType";

test("FunctionType", () => {
  const functionTypeDescription: FunctionTypeDescription = {
    typeName: "FunctionType",
    properties: {
      arguments: {
        typeName: "OuterFunctionArgumentListType",
        properties: {
          arguments: [
            { name: "i", optional: false, type: { typeName: "StringType" } },
          ],
          varg: false,
        },
      },
      generalReturnType: {
        typeName: "IntegerType",
      },
      specificReturnType: "FORMULA_REDUCE",
    },
  };
  const parsedType = new GenericTypeParser().parseType(functionTypeDescription);
  expect(parsedType).toBeInstanceOf(FunctionType);
  const specificReturnType = parsedType.getOperatorResultType(
    Operator.CALL,
    new OuterFunctionArgumentListType(
      [new OuterFunctionArgument(new StringType(), false, false)],
      false
    )
  );
  expect(specificReturnType).toBeInstanceOf(StringType);
});
