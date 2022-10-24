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

  update = async ({
    Key,
    UpdateExpression,
    ExpressionAttributeValues,
  }: {
    Key: { [key: string]: any };
    UpdateExpression: string;
    ExpressionAttributeValues: { [key: string]: any };
  }) => {
    const updateParams = {
      TableName: this._tableName,
      Key,
      UpdateExpression,
      ExpressionAttributeValues,
    };
    await this._dynamoDb.update(updateParams).promise();
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

  get = async (key: { [key: string]: any }) => {
    const getParams = {
      TableName: this._tableName,
      Key: key,
    };

    const result = await this._dynamoDb.get(getParams).promise();

    return { Item: result.Item };
  };
}
