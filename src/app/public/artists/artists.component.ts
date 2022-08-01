import { Component, OnInit } from '@angular/core';
import myArtists from './artists.json';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {

  artists: any[];

  constructor() { }

  ngOnInit(): void {
    this.artists = myArtists;
  }

}
