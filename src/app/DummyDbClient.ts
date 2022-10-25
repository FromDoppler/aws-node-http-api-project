import { DbClient } from "src/app/DbClient";

export class DummyDbClient implements DbClient {
  constructor(private _configurationValue: string) {}

  get = async (key: { [key: string]: any }) => {
    return {
      Item: {
        email: key.email,
        name: this._configurationValue,
      },
    };
  };

  put = async () => {
    // intentionally empty
  };

  update = async () => {
    // intentionally empty
  };

  scan = async () => {
    return {
      Items: [
        {
          email: this._configurationValue,
          name: this._configurationValue,
        },
      ],
      Count: 1,
    };
  };
}
