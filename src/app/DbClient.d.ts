export interface DbClient {
  put: (item: { [key: string]: any }) => Promise<void>;
  scan: () => Promise<{
    Items: any[];
    Count: number;
  }>;
  get: (key: { [key: string]: any }) => Promise<{ Item: any }>;
}
