import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';
import { IMenuGroups } from '../../interfaces/main.interface';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  footerData: IMenuGroups;
  constructor(public mainService: MainService) { }

  ngOnInit() {
   
    this.mainService.getFooter().subscribe((res: IMenuGroups) => {
      this.footerData = res;
    });
  }

}
