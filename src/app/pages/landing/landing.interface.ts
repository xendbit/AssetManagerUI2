export interface ILandingData {
    classynav: [{"link": string, "title": string}]
    welcomeArea: {
      backgroundImage: string,
      title: string,
      subText: string,
      pdfLink: string,
    },
    verticalSocial: {facebookUrl: string, twitterUrl: string, discordUrl: string , pinterestUrl: string, youTubeUrl: string, telegramUrl: string},
    buyOrSellSection: {
      title: string,
      welcomeThumbImage: string,
      video: string,
      rightBlock: [{
          title: string,
          subtitle: string
      }]
    },
    investorSection: [{
          image: string,
          title: string,
          subtitle: string
    }],
    aboutUsSection: [{
      image: string,
      title: string,
      paragraphs: [{text: string}]
    }],
    servicesSection: [{
      image: string,
      title: string,
      subtitle: string
    }],
    roadmapSection: {
      image: string
    },
    deckSection: {
      decklink: string
    },
    tokenSection: {
      title: string,
      subtitle: string
      tokenAllocationData: {
        partnerships: number,
        privateSale: number,
        team: number,
        researchData: number,
        votingRewards: number,
        advisors: number,
        publicSale: number
        exchange: number
      },
      useOfSalesData: {
        creativeFund: number,
        development: number,
        exchangeListings: number
        operations: number,
        brandingMarketing: number
        legal: number
      }
    }
  
  }