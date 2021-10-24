import { Component, OnInit } from '@angular/core';
import { IBlogGroup } from 'src/app/core/components/blog/blog.interfaces';
import { IMenuGroups } from 'src/app/core/components/footer/footer.interface';
import { INavButton } from 'src/app/core/components/header/header.interface';
import { MainService } from 'src/app/core/services/main.service';
import { MetamaskService } from 'src/app/core/services/metamask.service';




@Component({
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  headerInfo: IMenuGroups = { "menuGroup": [{ "title": "", "menu": []}, { "title": "", "menu": []},{ "title": "", "menu": []}, { "title": "", "menu": []}], "logoPath": ""}
  navButtons: INavButton = { "create": {"title": "", "path": ""}, "wallet": { "title": "", "path": ""}};
  blogs: any;
  constructor(public mainService: MainService, public metamaskService: MetamaskService) { }

  ngOnInit(): void {
    this.mainService.getNavButtons().subscribe(res => {
      this.navButtons = res;
    });
    this.mainService.getHeader().subscribe((res: any) => {
      this.headerInfo = res;
    })  
    this.mainService.getBlogPost().subscribe((data: IBlogGroup) => {
      this.blogs = data;
    })
  }

  sendData() {

  }


}
