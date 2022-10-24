import { APIGatewayProxyHandler } from "aws-lambda";
import { getCustomerService } from "./compositionRoot";

export const customerVisit: APIGatewayProxyHandler = async (event, context) => {
  const customerService = getCustomerService();

  await customerService.registerVisit(
    event.pathParameters["email"],
    new Date()
  );

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Go Serverless v2.0! Your function executed successfully!",
      context,
      event,
    }),
  };
};
