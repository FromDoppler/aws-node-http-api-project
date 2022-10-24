import { APIGatewayProxyHandler } from "aws-lambda";
import { getCustomerService } from "./compositionRoot";

export const createCustomer: APIGatewayProxyHandler = async (
  event,
  context
) => {
  const customerService = getCustomerService();

  const body = JSON.parse(Buffer.from(event.body, "base64").toString());
  await customerService.create({ name: body.name, email: body.email });

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Go Serverless v2.0! Your function executed successfully!",
      context,
      event,
    }),
  };
};
