import { Component, OnInit } from '@angular/core';
import AllCreators from './all-creators.json'
@Component({
  selector: 'app-all-creators',
  templateUrl: './all-creators.component.html',
  styleUrls: ['./all-creators.component.scss']
})
export class AllCreatorsComponent implements OnInit {

  creators: any[] = AllCreators;

  constructor() { }

  ngOnInit(): void {
  }

}
