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
  tokenAllocationData: any;
  useOfSalesData: any;
  firstName: string;
  lastName: string;
  email: string;
  amount: number;
  walletAddress: string;
  country: string;
  linkedInUrl: string;
  tweetLink: string;

  constructor(public mainService: MainService, public metamaskService: MetamaskService, private spinner: NgxSpinnerService) {
    this.tokenAllocationData = {
      labels: ['Partnerships','Private Sale','Team', 'Research Data', 'Voting Rewards', 'Advisors', 'Public Sale', 'Exchange'],
      datasets: [
          {
              data: [0, 0, 0, 0, 0, 0, 0, 0],
              backgroundColor: [
                  "#42A5F5",
                  "#66BB6A",
                  "#FFA726",
                  "#2D5C96",
                  "#7E9D38",
                  "#66498A",
                  "#298BA7",
                  "#748DB6"
              ],
              hoverBackgroundColor: [
                  "#64B5F6",
                  "#81C784",
                  "#FFB74D",
                  "#7E9D38",
                  "#66498A",
                  "#298BA7",
                  "#748DB6",
                  "#FFA726",
              ]
          }
      ]
    };

    this.useOfSalesData = {
      labels: ['Creative Fund','Development','Exchange Listings', 'Operations', 'Branding/Marketing', 'Legal'],
      datasets: [
          {
              data: [0, 0, 0, 0, 0, 0,],
              backgroundColor: [
                  "#42A5F5",
                  "#66BB6A",
                  "#FFA726",
                  "#2D5C96",
                  "#7E9D38",
                  "#66498A",
                  "#298BA7",
                  "#748DB6"
              ],
              hoverBackgroundColor: [
                  "#64B5F6",
                  "#81C784",
                  "#FFB74D",
                  "#7E9D38",
                  "#66498A",
                  "#298BA7",
                  "#748DB6",
                  "#FFA726",
              ]
          }
      ]
    };
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
    let updatedTokenData = {
      labels: ['Partnerships','Private Sale','Team', 'Research Data', 'Voting Rewards', 'Advisors', 'Public Sale', 'Exchange'],
      datasets: [
          {
              data: [this.landingData.tokenSection.tokenAllocationData.partnerships,
                this.landingData.tokenSection.tokenAllocationData.privateSale,
                this.landingData.tokenSection.tokenAllocationData.team,
                this.landingData.tokenSection.tokenAllocationData.researchData,
                this.landingData.tokenSection.tokenAllocationData.votingRewards,
                this.landingData.tokenSection.tokenAllocationData.advisors,
                this.landingData.tokenSection.tokenAllocationData.publicSale,
                this.landingData.tokenSection.tokenAllocationData.exchange 
              ],
              backgroundColor: [
                  "#42A5F5",
                  "#66BB6A",
                  "#FFA726",
                  "#2D5C96",
                  "#7E9D38",
                  "#66498A",
                  "#298BA7",
                  "#748DB6"
              ],
              hoverBackgroundColor: [
                  "#64B5F6",
                  "#81C784",
                  "#FFB74D",
                  "#7E9D38",
                  "#66498A",
                  "#298BA7",
                  "#748DB6",
                  "#FFA726",
              ]
          }
      ]
    };

    let updatedSalesData = {
      labels: ['Creative Fund','Development','Exchange Listings', 'Operations', 'Branding/Marketing', 'Legal'],
      datasets: [
          {
              data: [
                this.landingData.tokenSection.useOfSalesData.creativeFund,
                this.landingData.tokenSection.useOfSalesData.development,
                this.landingData.tokenSection.useOfSalesData.exchangeListings,
                this.landingData.tokenSection.useOfSalesData.operations,
                this.landingData.tokenSection.useOfSalesData.brandingMarketing,
                this.landingData.tokenSection.useOfSalesData.legal,
              ],
              backgroundColor: [
                  "#42A5F5",
                  "#66BB6A",
                  "#FFA726",
                  "#2D5C96",
                  "#7E9D38",
                  "#66498A",
                  "#298BA7",
                  "#748DB6"
              ],
              hoverBackgroundColor: [
                  "#64B5F6",
                  "#81C784",
                  "#FFB74D",
                  "#7E9D38",
                  "#66498A",
                  "#298BA7",
                  "#748DB6",
                  "#FFA726",
              ]
          }
      ]
    };

    this.tokenAllocationData = Object.assign({}, updatedTokenData);
    this.useOfSalesData = Object.assign({}, updatedSalesData);
  }


}
