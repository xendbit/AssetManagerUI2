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
        owner: 'Kingsley'
      },
      {
        heroImg: 'assets/img/heroes/African-woman.jpg',
        creator: 'Robert Mawuli',
        owner: 'Femi Ashiru'
      },
      {
        heroImg: 'assets/img/heroes/impossible-ninja.jpg',
        creator: 'bad-oats',
        owner: 'Godzilla'
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
