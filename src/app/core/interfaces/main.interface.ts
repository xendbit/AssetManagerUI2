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

export interface navBar { 
    logo:  string;
    navLinks: Array<navType>;
}

interface navType {
    id: number;
    title: string;
    path: string;
}