import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { IMenuGroups } from 'src/app/core/components/footer/footer.interface';
import { INavButton } from 'src/app/core/components/header/header.interface';
import { MainService } from 'src/app/core/services/main.service';
import { MetamaskService } from 'src/app/core/services/metamask.service';
import { HostListener } from '@angular/core';




@Component({
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  headerInfo: IMenuGroups = { "menuGroup": [{ "title": "", "menu": []}, { "title": "", "menu": []},{ "title": "", "menu": []}, { "title": "", "menu": []}], "logoPath": ""}
  navButtons: INavButton = { "create": {"title": "", "path": ""}, "wallet": { "title": "", "path": ""}};
  currentPosition = window.pageYOffset;
  constructor(public mainService: MainService, public metamaskService: MetamaskService, private renderer: Renderer2) { }
  @ViewChild('header', { static: false }) divHeader: ElementRef;
  @HostListener("window:scroll", ['$event.target']) scroll(e) {
    let scroll = e.scrollingElement.scrollTop;
    if (scroll > this.currentPosition) {
      this.renderer.addClass(this.divHeader.nativeElement, 'sticky' );
    } else {
      this.renderer.removeClass(this.divHeader.nativeElement, 'sticky' );
    }
  }

  ngOnInit(): void {
    this.mainService.getNavButtons().subscribe(res => {
      this.navButtons = res;
    });
    this.mainService.getHeader().subscribe((res: any) => {
      this.headerInfo = res;
    })  
  }

  connectToMetamask() {
    this.metamaskService.openMetamask();
  }

}
