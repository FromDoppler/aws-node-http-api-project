import * as DynamoDB from "aws-sdk/clients/dynamodb";
import { createPromiseWrapperWithDelay } from "../shared/utils";

export function createDummyDynamoDbClient({
  delay = 1000,
  configurationValue = "UNSET",
}: {
  delay?: number;
  configurationValue?: string;
} = {}): DynamoDB.DocumentClient {
  const dbClientDouble = {
    put: () => createPromiseWrapperWithDelay(delay),
    update: () => createPromiseWrapperWithDelay(delay),
    scan: () =>
      createPromiseWrapperWithDelay(delay, () => ({
        Items: [
          {
            email: configurationValue,
            name: configurationValue,
          },
        ],
        Count: 1,
      })),
    get: (key: DynamoDB.Key) =>
      createPromiseWrapperWithDelay(delay, () => ({
        Item: {
          email: key.email,
          name: configurationValue,
        },
      })),
  };
  return dbClientDouble as unknown as DynamoDB.DocumentClient;
}
