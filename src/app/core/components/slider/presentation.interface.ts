
export interface IPresentation {
    slides:Array<IAuction | ICreator | IArtwork | ICollection>;
    presentationType: presentationType
  }
  export interface IAuction {
    auctionId: number;
    cancelled: boolean;
    currentBlock: number;
    startBlock: number;
    endBlock: number;
    highestBid: number;
    highestBidder: string;
    bids: [{bidder: string, bid: number, auctionId: number}];
    isActive: boolean;
    owner: string;
    chain?: string;
    sellNowPrice: number;
    title:string;
    subtitle?: string;
    currentBid:number;
    currency:string;
    endDate: Date;
    startDate: Date;
    minimumBid: number;
    tokenId: number;
    artwork?:IArtwork;
    type?: string;
  }
 export interface IArtwork {
    id:string;
    category:string;
    tags?:Array<string>,
    auctions: IminiAuctionInfo,
    owner:IOwner;
    creator:ICreator;
    featuredImage:IMedia;
    collection?: ICollection;
    isBidding:boolean;
    gallery?:Array<IMedia>;
    description?:string;
    price:number;
    currency:string;
    likes: number;
    chain?: string;
    lastAuctionId: number;
    hasActiveAuction: boolean;
    symbol: string;
    name: string;
    tokenId: number;
    dateIssued?: any;
    sold: boolean;
    assetType: string;
    auction?: IAuction;
    type: string;
  }
  export interface IMedia{
    media:string;
    mediaType:MEDIA;
  }

  export interface IminiAuctionInfo {
    auctionId: string;
    cancelled: boolean;
    chain: string;
    currentBlock: string;
    endBlock: string;
    endDate: string;
    finished: boolean;
    highestBid: string;
    highestBidder: string;
    id: number;
    minimumBid: string;
    owner: string;
    sellNowPrice: string;
    sellNowTriggered: boolean;
    startBlock: string;
    startDate: string;
    started: boolean;
    tokenId: string;
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

  enum presentationType{
    Auction = 0,
    Artwork = 1,
    Collection = 2,
    Creator = 3
  }
