export interface IMenuGroups { 
    menuGroup: Array<IMenuGroup>;
    logoPath: string;
    type?: LOCATION
  };
  
  interface IMenus { 
    title: string;
    url: string;
  }
  
  interface IMenuGroup { 
    title: string;
    menu?: Array<IMenus>;
  }

export enum LOCATION {
  header,
  footer
}

export class AppEvent<T> {
  constructor(
    public type: LOCATION,
    public payload: T,
  ) {}
}
