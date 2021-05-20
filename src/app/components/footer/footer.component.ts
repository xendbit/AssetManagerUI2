import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  test : Date = new Date();
  userAgent: string;
  
  constructor() { }

  ngOnInit() {
    var ua = navigator.userAgent;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
      this.userAgent = 'mobile';
     
    } else if(/Chrome/i.test(ua)) {
      this.userAgent = 'chrome';
      
    } else {
      this.userAgent = 'desktop';
    }

  }

}
