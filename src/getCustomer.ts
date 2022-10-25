import { APIGatewayProxyHandler } from "aws-lambda";
import { getCustomerService, getJwtFilter } from "./compositionRoot";

export const getCustomer: APIGatewayProxyHandler = async (event, context) => {
  // TODO: validate JWT Data (if isSU, accept any email, if not, only matching email)
  const customerService = getCustomerService();
  const jwtFilter = getJwtFilter();

  return jwtFilter.apply(
    event,
    { allowSuperUser: true, allowUserWithEmail: event.pathParameters["email"] },
    async () => {
      const result = await customerService.get(event.pathParameters["email"]);

      if (!result) {
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
        body: JSON.stringify(result),
      };
    }
  );
};
