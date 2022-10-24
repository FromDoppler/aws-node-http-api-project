import { Customer } from "./Customer";
import { DbClient } from "./DbClient";

export class CustomerService {
  constructor(private _dbClient: DbClient) {}

  create = async ({ name, email }: Customer) => {
    await this._dbClient.put({
      email: email,
      name: name,
    });
  };

  getAll: () => Promise<Customer[]> = async () => {
    const result = await this._dbClient.scan();
    return (result.Items ?? []).map(this.mapCustomer);
  };

  get: (email: string) => Promise<Customer | null> = async (email: string) => {
    const result = await this._dbClient.get({ email });
    return result.Item ? this.mapCustomer(result.Item) : null;
  };

  registerVisit = async (email: string, date: Date) => {
    await this._dbClient.update({
      Key: { email },
      UpdateExpression: "set lastVisit = :lastVisit",
      ExpressionAttributeValues: { ":lastVisit": date.toISOString() },
    });
  };

  private mapCustomer(item: any): Customer {
    return {
      email: item.email,
      name: item.name,
      lastVisit: item.lastVisit || null,
    };
  }
}
