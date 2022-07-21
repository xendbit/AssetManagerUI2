import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-curator-card',
  templateUrl: './curator-card.component.html',
  styleUrls: ['./curator-card.component.scss']
})
export class CuratorCardComponent implements OnInit {
  @Input() public collector: any;
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['collector'].currentValue !== undefined && this.collector !== null) {
      
    }
  }

  seeUser() {
    localStorage.setItem('userData', JSON.stringify(this.collector));
    this.router.navigate(['/user/', this.collector.walletId]);
  }

}
