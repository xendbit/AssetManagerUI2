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
      console.log('this is mobile');
      this.userAgent = 'mobile';
     
    } else if(/Chrome/i.test(ua)) {
      console.log('ti is chrome')
      this.userAgent = 'chrome';
      
    } else {
      console.log('this is desktop')
      this.userAgent = 'desktop';
    }

  }

}
