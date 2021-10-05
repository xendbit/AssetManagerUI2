export interface ICreateArtwork {
    artworkCategory: string;
    assetType: string;
    title: string;
    symbol: string;
    description: string;
    primaryImage: string;
    issuerWalletAddress: string;
    tokenId: number;
    gallery?: [{mediaType: string; media: string}];
    secondaryMedia?: {mediaType: string; media: string};
    assetSize: string;
    dateCreated: Date;
  }