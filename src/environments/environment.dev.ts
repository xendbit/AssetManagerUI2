import { AppEnvironment } from '../app/core/interfaces/app-environment.interface';

export const environment: AppEnvironment = {
  production: true,
  baseApiUrl: 'https://lb.xendbit.net/api/yasuke/',
  extraUrl: 'https://lb.xendbit.net/yasuke-server/',
  icoUrl: 'https://lb.xendbit.net/api/ico/whitelist/',
  security: {
    allowedOrigins: 'https://niftyrow.io/'
  }
};
