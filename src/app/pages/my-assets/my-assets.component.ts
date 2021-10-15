import { Component, OnInit, SimpleChanges } from '@angular/core';
import { IArtwork } from 'src/app/core/components/slider/presentation.interface';
import { MainService } from 'src/app/core/services/main.service';
import { MetamaskService } from 'src/app/core/services/metamask.service';

@Component({
  templateUrl: './my-assets.component.html',
  styleUrls: ['./my-assets.component.scss']
})
export class MyAssetsComponent implements OnInit {
  artworks: IArtwork [];
  account: string;
  currentPage: any;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  categories: string[];

  constructor(public mainService: MainService, public metamaskService: MetamaskService) { }

  ngOnInit(): void {
    this.metamaskService.openMetamask().then(result => {
      this.account = result.account;

      this.mainService.fetchAssetsByOwnerId(this.account, 1, 10);
      this.artworks = this.mainService.getOwnerAssets()
        console.log('acc', this.artworks)
        this.categories = this.artworks.map(item => item.category)
        .filter((value, index, self) => self.indexOf(value) === index);
    })
    
  }

  ngOnChanges(changes: SimpleChanges) {
    this.mainService.getOwnerMeta().subscribe(res => {
      if (res !== null) {
        this.currentPage = res.currentPage;
        this.itemCount = res.itemCount;
        this.itemsPerPage = res.itemsPerPage
        this.totalItems = res.totalItems
        this.totalPages = res.totalPages
      }
    })
    
  }

  byId(index, item) {
    return item.id;
  }

  categoryFilter(category) {
    this.artworks = this.artworks.filter(item => {
      return item.category === category;
    });
    // this.artworks = this.artworkArray;
    // console.log('done')
  }

  loadMore(page, count) {
    this.currentPage = this.currentPage + 1;
    this.mainService.fetchAssetsByOwnerId(this.account, this.currentPage, this.itemCount);
  }

}
