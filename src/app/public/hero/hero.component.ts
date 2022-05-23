import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  @Input() showTransitionOptions: string = '150ms cubic-bezier(0, 0, 0.2, 1)';

  @Input() hideTransitionOptions: string = '150ms cubic-bezier(0, 0, 0.2, 1)';

  presentationData = {
    heroes: [
      {
        heroImg: 'assets/img/heroes/focus-artwork.jpg',
        creator: 'Unknown Artist',
        owner: 'Kingsley',
        currentBid: 0.681,
        currency: 'bsc',
        blockchain: 'BNB'
      },
      {
        heroImg: 'assets/img/heroes/African-woman.jpg',
        creator: '@Peacezogallery',
        owner: 'Zinolesky',
        currentBid: 0.201,
        currency: 'aurora',
        blockchain: 'AUR'
      },
      {
        heroImg: 'assets/img/heroes/forceofafrica.jpg',
        creator: '@ForceofAfrica',
        owner: '@ForceofAfrica',
        currentBid: 1.61,
        currency: 'aurora',
        blockchain: 'AUR'
      },
      {
        heroImg: 'assets/img/heroes/faceofher.jpg',
        creator: '@m_i_l_k_i____',
        owner: '@PrinceofAfrica',
        currentBid: 12.601,
        currency: 'avalanche',
        blockchain: 'AVAX'
      },
      {
        heroImg: 'assets/img/heroes/impossible-ninja.jpg',
        creator: 'bad-oats',
        owner: 'Godzilla',
        currentBid: 2.03,
        currency: 'polygon',
        blockchain: 'MATIC'
      }
    ]
  };

  transitions = '150ms cubic-bezier(0, 0, 0.2, 1)';

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
