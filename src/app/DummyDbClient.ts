import { DbClient } from "src/app/DbClient";

export class DummyDbClient implements DbClient {
  constructor(private _configurationValue: string) {}

  put = async () => {
    // intentionally empty
  };

  scan = async () => {
    return {
      Items: [
        {
          primary_key: this._configurationValue,
          email: this._configurationValue,
        },
      ],
      Count: 1,
    };
  };
}
