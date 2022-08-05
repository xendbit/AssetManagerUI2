import { Component, OnInit } from '@angular/core';
import galleries from './all-galleries.json';

@Component({
  selector: 'app-all-galleries',
  templateUrl: './all-galleries.component.html',
  styleUrls: ['./all-galleries.component.scss']
})
export class AllGalleriesComponent implements OnInit {

  galleries: any[];

  constructor() { }

  ngOnInit(): void {
    this.galleries = galleries;
  }

}
