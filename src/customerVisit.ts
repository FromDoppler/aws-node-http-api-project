import { APIGatewayProxyHandler } from "aws-lambda";
import { getCustomerService, getJwtFilter } from "./compositionRoot";

export const customerVisit: APIGatewayProxyHandler = async (event, context) => {
  // TODO: validate JWT Data (if isSU, accept any email, if not, only matching email)
  const customerService = getCustomerService();
  const jwtFilter = getJwtFilter();

  return jwtFilter.apply(event, async () => {
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
  });
};
