import { IArtwork } from "src/app/core/components/slider/presentation.interface";

  export interface IUser {
    userId: number;
    username: string;
    firstName?: string;
    lastName?: string;
    walletAddress: string;
    email?: string;
    socials?: IUserSocials;
    followers?: Array<IFollowers>;
    following?: Array<IFollowers>;
    likes?: Array<IUserLikes>;
    createdArtworks?: Array<IArtwork>;
    collections?: Array<IArtwork>;
    bids?: Array<IUserBids>;
    isActive: boolean;
    phoneNumber?: string;
    password?: string,
    about: string;
    displayImage: string;
    coverImage: string;
    assetTotalValue?: number;
    webUrl?: {url: string, title: string};
    joinDate: string;
    type: string;
  }

  export interface IFollowers {
    walletAddress: string;
    username: string;
    displayImage: string;
    assetTotalValue?: number;
    currency?: string;
  }
  interface IUserLikes {
    id: number
    tokenId: string;
    walletAddress: string;
  }
  interface IUserBids{
    tokenId: string;
    bid: number;
    auctionId: string;
  }

  interface IUserSocials{
    twitterUrl?: string;
    facebookUrl?: string;
    telegramUrl?: string;
    youtubeUrl?: string;
    pinterestUrl?: string;
    discordUrl?: string;
  }
