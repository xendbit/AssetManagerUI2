export interface AppEnvironment {
  production: boolean;
  headers?: any;
  baseApiUrl: string;
  icoUrl: string;
  extraUrl: string;
  security?: {
    allowedOrigins: string;
  };
}
