import { AppEnvironment } from '../app/core/interfaces/app-environment.interface';

export const environment: AppEnvironment = {
  production: true,
  baseApiUrl: 'http://yasuke-server:7071/yasuke/',
  extraUrl: 'http://yasuke-auth-app:8600/yasuke-server/',
  icoUrl: 'http://yasuke-server:7071/api/ico/whitelist/',
  security: {
    allowedOrigins: 'https://app.niftyrow.io'
  }
}
