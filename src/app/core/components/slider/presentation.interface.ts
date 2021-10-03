
export interface IPresentation {
    slides:Array<IAuction | ICreator | IArtwork | ICollection>;
  }
  export interface IAuction {
    auctionId: string;
    cancelled: boolean;
    currentBlock: number;
    startBlock: number;
    endBlock: number;
    highestBid: number;
    highestBidder: string;
    bids: [{bidder: string, bid: number, auctionId: string}];
    isActive: boolean;
    owner: string;
    sellNowPrice: number;
    title:string;
    currentBid:number;
    currency:string;
    endDate: Date;
    startDate: Date;
    minimumBid: number;
    tokenId: number;
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
    likes: number;
    lastAuctionId: number;
    symbol: string;
    name: string;
    tokenId: number;
    dateIssued: string;
    sold: boolean;
    type: string;
  }
  export interface IMedia{
    media:string;
    mediaType:MEDIA;
  }

  export interface meta {
    currentPage: number;
    itemCount: number
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
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