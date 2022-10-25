import { DynamoDB } from "aws-sdk";
import { Customer } from "./Customer";

export class CustomerService {
  private _customerTableName: string;
  private _dbClient: DynamoDB.DocumentClient;

  constructor({
    customerTableName,
    dbClient,
  }: {
    customerTableName: string;
    dbClient: DynamoDB.DocumentClient;
  }) {
    this._customerTableName = customerTableName;
    this._dbClient = dbClient;
  }

  create = async ({ name, email }: Customer): Promise<void> => {
    await this._dbClient
      .put({
        TableName: this._customerTableName,
        Item: {
          email: email,
          name: name,
        },
      })
      .promise();
  };

  getAll: () => Promise<Customer[]> = async () => {
    const result = await this._dbClient
      .scan({
        TableName: this._customerTableName,
      })
      .promise();
    return (result.Items ?? []).map(this.mapCustomer);
  };

  get: (email: string) => Promise<Customer | null> = async (email: string) => {
    const result = await this._dbClient
      .get({
        TableName: this._customerTableName,
        Key: { email },
      })
      .promise();
    return result.Item ? this.mapCustomer(result.Item) : null;
  };

  registerVisit = async (email: string, date: Date): Promise<void> => {
    await this._dbClient
      .update({
        TableName: this._customerTableName,
        Key: { email },
        UpdateExpression: "set lastVisit = :lastVisit",
        ExpressionAttributeValues: { ":lastVisit": date.toISOString() },
      })
      .promise();
  };

  private mapCustomer(item: DynamoDB.AttributeMap): Customer {
    return {
      email: item.email as string,
      name: item.name as string,
      lastVisit: (item.lastVisit as string) || null,
    };
  }
}
