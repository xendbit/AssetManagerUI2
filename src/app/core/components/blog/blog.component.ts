import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { IBlogGroup } from '../../interfaces/blog/blog.interfaces';
import {SelectItem} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnChanges {
  @Input() public blog: IBlogGroup;
 

  constructor() { }

  // ngOnInit() {
  
  // }

  ngOnChanges() {

  }


}
