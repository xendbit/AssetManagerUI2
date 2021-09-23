import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-assets-grid',
  templateUrl: './assets-grid.component.html',
  styleUrls: ['./assets-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetsGridComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
