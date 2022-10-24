import { APIGatewayProxyHandler } from "aws-lambda";
import { getCustomerService } from "./compositionRoot";

export const getCustomers: APIGatewayProxyHandler = async (event, context) => {
  const customerService = getCustomerService();

  const result = await customerService.getAll();

  if (result.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Go Serverless v2.0! Your function executed successfully!",
        context,
        event,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      total: result.length,
      items: result,
    }),
  };
};
