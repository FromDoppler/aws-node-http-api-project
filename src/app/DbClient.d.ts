export interface DbClient {
  put: (item: { [key: string]: any }) => Promise<void>;
  update: ({
    Key,
    UpdateExpression,
    ExpressionAttributeValues,
  }: {
    Key: { [key: string]: any };
    UpdateExpression: string;
    ExpressionAttributeValues: { [key: string]: any };
  }) => Promise<void>;
  scan: () => Promise<{
    Items: any[];
    Count: number;
  }>;
  get: (key: { [key: string]: any }) => Promise<{ Item: any }>;
}
