import { Params } from '@angular/router';

export interface urlConfig {
    headers?: Headers | any;
    testUrl?: Params | any;
    mainUrl: Params | any;
}

export interface headerConfig {
    headers?: Headers | any;
}