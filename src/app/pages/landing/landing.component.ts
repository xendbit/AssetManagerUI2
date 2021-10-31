import { Component, OnInit} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { IMenuGroups } from 'src/app/core/components/footer/footer.interface';
import { INavButton } from 'src/app/core/components/header/header.interface';
import { MainService } from 'src/app/core/services/main.service';
import { MetamaskService } from 'src/app/core/services/metamask.service';
import { ILandingData } from './landing.interface';
import {  NgForm } from '@angular/forms';

@Component({
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  headerInfo: IMenuGroups = { "menuGroup": [{ "title": "", "menu": []}, { "title": "", "menu": []},{ "title": "", "menu": []}, { "title": "", "menu": []}], "logoPath": ""}
  navButtons: INavButton = { "create": {"title": "", "path": ""}, "wallet": { "title": "", "path": ""}};
  landingData: ILandingData;
  firstName: string;
  lastName: string;
  email: string;
  amount: number;
  walletAddress: string;
  country: string;
  linkedInUrl: string;
  tweetLink: string;

  chartInstance: any;
  tokenAllocation = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: 'Token Allocation',
        type: 'pie',
        radius: [30, 200],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: [
          { value: 40, name: 'rose 1' },
          { value: 38, name: 'rose 2' },
          { value: 32, name: 'rose 3' },
          { value: 30, name: 'rose 4' },
          { value: 28, name: 'rose 5' },
          { value: 26, name: 'rose 6' },
          { value: 22, name: 'rose 7' },
          { value: 18, name: 'rose 8' }
        ]
      }
    ]
  };

  useOfSales = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: 'Token Allocation',
        type: 'pie',
        radius: [30, 200],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: [
          { value: 40, name: 'rose 1' },
          { value: 38, name: 'rose 2' },
          { value: 32, name: 'rose 3' },
          { value: 30, name: 'rose 4' },
          { value: 28, name: 'rose 5' },
          { value: 26, name: 'rose 6' },
          { value: 22, name: 'rose 7' },
          { value: 18, name: 'rose 8' }
        ]
      }
    ]
  };

  constructor(public mainService: MainService, public metamaskService: MetamaskService, private spinner: NgxSpinnerService) {
   }

  ngOnInit(): void {
    this.spinner.show();
    this.mainService.getLanding().subscribe((res: any) => {
      this.landingData = res;
      this.updateCharts();
    }) 
    this.mainService.getHeader().subscribe((res: any) => {
      this.headerInfo = res;
    })  
    this.mainService.getNavButtons().subscribe(res => {
      this.navButtons = res;
    });
    this.spinner.hide();
  }

  sendData(contactForm: NgForm) {
    this.mainService.submitWhitelistForm(
      contactForm.value.email, contactForm.value.firstName, contactForm.value.lastName,
      contactForm.value.amount, contactForm.value.walletAddress, contactForm.value.linkedInUrl,
      contactForm.value.country, contactForm.value.tweetLink
    ).subscribe(res => {
      console.log('this is it');
    });
  }

  updateCharts() {
    this.tokenAllocation = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Token Allocation',
          type: 'pie',
          radius: [10, 120],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8
          },
          data: this.landingData.tokenSection.tokenAllocationData
        }
      ]
    };
    this.useOfSales = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Use Of Sales',
          type: 'pie',
          radius: [10, 120],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8
          },
          data: this.landingData.tokenSection.useOfSalesData
        }
      ]
    };
  }

  onChartInit(e: any) {
    this.chartInstance = e;
    console.log('on chart init:', e);
  }

  callMethod(type: string) {
    if (this.chartInstance) {
      const result = this.chartInstance[type]();
      console.log(result);
    }
  }


}
