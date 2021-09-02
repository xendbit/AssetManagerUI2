export interface categories {
    name: string;
    price: number;
    description: string;
}

export interface demoCategories { 
    image: string,  
    symbol: string, 
    sellNowPrice: number, 
    highestBid: number };

export const demo: demoCategories[] = [
    { "image": '/assets/img/Oil-painting.jpg',  symbol: "Oil Painting", sellNowPrice: 0.2, highestBid: 0.1 },
    { "image": '/assets/img/Casein-Painting.jpg',  symbol: "Casein Painting", sellNowPrice: 0.2, highestBid: 0.1 },
    { "image": '/assets/img/WATERCOLOUR.jpg',  symbol: "Water color painting", sellNowPrice: 0.2, highestBid: 0.1 },
    { "image": '/assets/img/Miniature.jpg',  symbol: "Miniature Painting", sellNowPrice: 0.2, highestBid: 0.1 },
    { "image": '/assets/img/Anamorphosis.jpg',  symbol: "Anamorphosis painting", sellNowPrice: 0.2, highestBid: 0.1 },
    { "image": '/assets/img/AERIAL-PERSPECTIVE.jpg',  symbol: "Aerial Perspective", sellNowPrice: 0.2, highestBid: 0.1 },
    { "image": '/assets/img/ACTION.jpg',  symbol: "Action", sellNowPrice: 0.2, highestBid: 0.1 },
    { "image": '/assets/img/Tempera.jpg',  symbol: "Tempera", sellNowPrice: 0.2, highestBid: 0.1 },
    { "image": '/assets/img/Gouache.jpg',  symbol: "Gouache painting", sellNowPrice: 0.2, highestBid: 0.1 },
    { "image": '/assets/img/Encaustic.jpg',  symbol: "Encuastic painting", sellNowPrice: 0.2, highestBid: 0.1 },
    { "image": '/assets/img/COLLAGE.jpg',  symbol: "Collage painting", sellNowPrice: 0.2, highestBid: 0.1 },
    { "image": '/assets/img/BALL-POINT.jpeg',  symbol: "Ballpoint painting", sellNowPrice: 0.2, highestBid: 0.1 },
    { "image": '/assets/img/Ink-PAinting.jpg',  symbol: "Ink painting", sellNowPrice: 0.2, highestBid: 0.1 },
    { "image": '/assets/img/CHARCOAL.jpg',  symbol: "Charcoal painting", sellNowPrice: 0.2, highestBid: 0.1 },
    { "image": '/assets/img/ACRYLIC.jpg',  symbol: "Acrylic painting", sellNowPrice: 0.2, highestBid: 0.1 },
    { "image": '/assets/img/DIGITAL.jpg',  symbol: "Digital painting", sellNowPrice: 0.2, highestBid: 0.1 }
  ];
