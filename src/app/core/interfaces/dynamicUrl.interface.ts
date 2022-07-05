import { Params } from '@angular/router';

export interface IurlConfig {
    headers?: Headers | any;
    extraUrl?: Params | any;
    mainUrl: Params | any;
    icoUrl: Params | any;
}

export interface IRouter {
    path: Params | any;
}

export interface headerConfig {
    headers?: Headers | any;
}