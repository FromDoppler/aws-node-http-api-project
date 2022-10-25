import { APIGatewayProxyHandler } from "aws-lambda";
import { getCustomerService, getJwtFilter } from "./compositionRoot";

export const createCustomer: APIGatewayProxyHandler = async (
  event,
  context
) => {
  // TODO: validate JWT Data (if isSU, accept any email, if not, only matching email)
  const customerService = getCustomerService();
  const jwtFilter = getJwtFilter();

  return jwtFilter.apply(event, { allowSuperUser: true }, async () => {
    const body = JSON.parse(Buffer.from(event.body, "base64").toString());
    await customerService.create({
      name: body.name,
      email: body.email,
      lastVisit: null,
    });

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
