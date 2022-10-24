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
          email: this._configurationValue,
          name: this._configurationValue,
        },
      ],
      Count: 1,
    };
  };
}
