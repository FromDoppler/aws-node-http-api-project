import { DynamoDB } from "aws-sdk";
import { CustomerService } from "./app/CustomerService";
import { createDummyDynamoDbClient } from "./app/DummyDbClient";
import { JwtFilter } from "./doppler-security/JwtFilter";
import { JwtVerifier } from "./doppler-security/JwtVerifier";

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

let _jwtVerifierSingleton: JwtVerifier;
function getJwtVerifier(): JwtVerifier {
  return (_jwtVerifierSingleton =
    _jwtVerifierSingleton ||
    new JwtVerifier({ publicKey: process.env.JWT_PUBLIC_KEY }));
}

let _jwtFilterSingleton: JwtFilter;
export function getJwtFilter(): JwtFilter {
  return (_jwtFilterSingleton =
    _jwtFilterSingleton || new JwtFilter({ jwtVerifier: getJwtVerifier() }));
}
