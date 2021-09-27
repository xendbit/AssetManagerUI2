export interface IMenuGroups { 
    menuGroup?: Array<IMenuGroup>;
  };
  
  interface IMenus { 
    title: string;
    url: string;
  }
  
  interface IMenuGroup { 
    title: string;
    menu: Array<IMenus>;
  }
