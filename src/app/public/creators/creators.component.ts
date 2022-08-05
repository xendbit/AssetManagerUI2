import { Component, OnInit } from '@angular/core';
import myCreators from './creators.json';

@Component({
  selector: 'app-creators',
  templateUrl: './creators.component.html',
  styleUrls: ['./creators.component.scss']
})
export class CreatorsComponent implements OnInit {

  creators: any[];

  constructor() { }

  ngOnInit(): void {
    this.creators = myCreators;
  }

}
