
export interface IPresentation {
    slides:Array<IAuction | ICreator | IArtwork | ICollection>;
  }
  export interface IAuction {
    title:string;
    currentBid:number;
    currency:string;
    deadline:Date;
    artwork:IArtwork;
    type: string;
  }
 export interface IArtwork {
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
    type: string;
  }
  export interface IMedia{
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
    type: string;
  }
  interface ICreator {
    id:string;
    image:string;
    username:string;
    collections?:Array<IArtwork>;
    type: string;
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