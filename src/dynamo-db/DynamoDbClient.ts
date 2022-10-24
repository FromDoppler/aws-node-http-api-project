import { DynamoDB } from "aws-sdk";
import { DbClient } from "src/app/DbClient";

export class DynamoDbClient implements DbClient {
  private _dynamoDb = new DynamoDB.DocumentClient();

  constructor(private _tableName: string) {}

  put = async (item: { [key: string]: any }) => {
    const putParams = {
      TableName: this._tableName,
      Item: item,
    };
    await this._dynamoDb.put(putParams).promise();
  };

  scan = async () => {
    const scanParams = {
      TableName: this._tableName,
    };
    const result = await this._dynamoDb.scan(scanParams).promise();

    return {
      Items: result.Items,
      Count: result.Count,
    };
  };
}
