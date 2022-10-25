import { DynamoDB } from "aws-sdk";
import { CustomerService } from "./app/CustomerService";
import { createDummyDynamoDbClient } from "./app/DummyDbClient";

let _dbClientSingleton: DynamoDB.DocumentClient;
function getDbClientSingleton(): DynamoDB.DocumentClient {
  return (_dbClientSingleton =
    _dbClientSingleton ||
    (process.env.BEHAVIOR === "DUMMY"
      ? createDummyDynamoDbClient({
          configurationValue: process.env.MY_ENV_VAR,
        })
      : new DynamoDB.DocumentClient()));
}

let _customerServiceSingleton: CustomerService;
export function getCustomerService(): CustomerService {
  return (_customerServiceSingleton =
    _customerServiceSingleton ||
    new CustomerService({
      customerTableName: process.env.DYNAMODB_CUSTOMER_TABLE,
      dbClient: getDbClientSingleton(),
    }));
}
