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
    return (result.Items ?? []).map((item) => ({
      email: item.email,
      name: item.name,
    }));
  };
}
