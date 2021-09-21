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


export interface IPresentation {
    slides:Array<IAuction | ICreator | IArtwork | ICollection>;
  }
  interface IAuction {
    title:string;
    currentBid:number;
    currency:string;
    deadline:Date;
    artwork:IArtwork;
  }
  interface IArtwork {
    id:string;
    category:string;
    tags?:Array<string>,
    owner:IOwner;
    creator:ICreator;
    featuredImage:IMedia;
    isBidding:boolean;
    gallery?:Array<IMedia>;
    description?:string;
    price:number;
    currency:string;
    likes:Array<IMember>;
  }
  interface IMedia{
    media:string;
    mediaType:MEDIA;
  }
  interface IOwner {
    id:string;
    image:string;
    username:string;
    collections?:Array<ICollection>;
  }
  interface ICollection{
    title:string;
    featuredImage:IMedia;
    createdOn:Date;
    gallery:Array<IArtwork>;
  }
  interface ICreator {
    id:string;
    image:string;
    username:string;
    collections?:Array<IArtwork>;
  }
  interface IMember{
    id:string;
    image?:string;
    username:string;
  }
  interface IBlogArticle{
    title:string;
    createdOn:Date;
    content:string;
    featuredImage:IMedia;
    likes:Array<IMember>;
  }
  enum MEDIA{
    IMAGE = 0,
    VIDEO = 1,
    AUDIO = 2
  }