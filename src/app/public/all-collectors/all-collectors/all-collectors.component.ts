import { Component, OnInit } from '@angular/core';
import collectors from './all-collectors.json';

@Component({
  selector: 'app-all-collectors',
  templateUrl: './all-collectors.component.html',
  styleUrls: ['./all-collectors.component.scss']
})
export class AllCollectorsComponent implements OnInit {

  collectors: any[] = collectors;

  constructor() { }

  ngOnInit(): void {
  }

}
