import { DynamoDbClient } from "src/db/DynamoDbClient";
import { CustomerService } from "./app/CustomerService";
import { DbClient } from "./app/DbClient";
import { DummyDbClient } from "./app/DummyDbClient";

const createDbClient: () => DbClient = () => {
  const dbClient =
    process.env.BEHAVIOR === "DUMMY"
      ? new DummyDbClient(process.env.MY_ENV_VAR)
      : new DynamoDbClient(process.env.DYNAMODB_CUSTOMER_TABLE);
  return dbClient;
};

export const createCustomerService = () => {
  const dbClient = createDbClient();
  const customerService = new CustomerService(dbClient);
  return customerService;
};
