import { AppEnvironment } from '../app/core/interfaces/app-environment.interface';

export const environment: AppEnvironment = {
  production: true,
  baseApiUrl: 'https://app.niftyrow.io/api/yasuke/',
  extraUrl: 'https://app.niftyrow.io/yasuke-server',
  icoUrl: 'https://app.niftyrow.io/api/ico',
  security: {
    allowedOrigins: 'https://app.niftyrow.io'
  }
};
