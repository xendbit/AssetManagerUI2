import { Component, OnInit, SimpleChanges } from '@angular/core';
import { UserActionsService } from 'src/app/core/services/userActions.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { MainService } from 'src/app/core/services/main.service';
import { IArtwork } from 'src/app/core/components/slider/presentation.interface';

@Component({
  selector: 'app-search-page',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchPageComponent implements OnInit {
  searchedWord: string = '';
  artworks: IArtwork [];
  redirect: string | null = window.history.state.redirect;
  constructor(
    public router: Router,
    public userActions: UserActionsService,
    private ngxService: NgxUiLoaderService,
    private mainService: MainService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.userActions.searchTerm.subscribe((newValue: string) => {
      this.searchedWord = newValue;
      this.getArtworks();
    }, err => {
      this.ngxService.stop();
    });
  }

  getArtworks() {
    setTimeout(() => {
      this.mainService.returnArtwork().subscribe((data: IArtwork []) => {
        if (this.searchedWord !== '') {
          this.ngxService.stop();
          this.artworks = data.filter((res: any) => res.symbol.toLowerCase().includes(this.searchedWord.toLowerCase()));
        } else if (this.searchedWord === '') {
          this.ngxService.stop();
          this.router.navigate([this.redirect || '/'])
        }
      }, err => {
        console.log('artwork error =>', err)
        this.ngxService.stop();
      });
    }, 100);
  }

}
