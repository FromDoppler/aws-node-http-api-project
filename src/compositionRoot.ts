import { DynamoDbClient } from "src/dynamo-db/DynamoDbClient";
import { CustomerService } from "./app/CustomerService";
import { DummyDbClient } from "./app/DummyDbClient";

const dbClientSingleton =
  process.env.BEHAVIOR === "DUMMY"
    ? new DummyDbClient(process.env.MY_ENV_VAR)
    : new DynamoDbClient(process.env.DYNAMODB_CUSTOMER_TABLE);

const customerServiceSingleton = new CustomerService(dbClientSingleton);

export const getCustomerService = () => customerServiceSingleton;
