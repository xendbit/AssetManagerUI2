export interface AppEnvironment {
  production: boolean;
  baseApiUrl: string;
  icoUrl: string;
  extraUrl: string;
  security?: {
    allowedOrigins: string;
  };
}
