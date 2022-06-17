import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserActionsService } from '../../services/userActions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchword: string = '';
  @Output() searchcriteria = new EventEmitter<String>();
  constructor(public router: Router, public userActions: UserActionsService) { }

  ngOnInit() {
  }

  searchThis(e: any) {
    this.userActions.searchTerm.next(e.target.value)
    this.router.navigate(['/search'], { state: { redirect: this.router.url } })
  }

}
