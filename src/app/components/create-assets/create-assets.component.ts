import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ICreatorMedia } from '../createArtwork.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { MainService } from 'src/app/core/services/main.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-create-assets',
  templateUrl: './create-assets.component.html',
  styleUrls: ['./create-assets.component.scss']
})
export class CreateAssetsComponent implements OnInit {
 
  image: any;
  files: File[] = [];
  media: Array<ICreatorMedia> = [];
  mp3: any;
  mp4: any;
  dragFiles:any
  validComboDrag:any
  lastInvalids:any
  fileDropDisabled:any
  maxSize:any
  baseDropValid:any;
  lastFileAt = new Date().getTime();
  categories: unknown;
  assetTypes: unknown;

  constructor( public mainService: MainService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
   this.mainService.getAssetCategories().subscribe(result => {
     console.log('res=>', result)
     this.categories = result;
   });
   this.mainService.getAssetTypes().subscribe(result => {
    console.log('res=>', result)
    this.assetTypes = result;
    this.spinner.hide();
  })
  }

  
  check(file) {
    const fileSize = file.size/1024/1024;
    if ( /\.(jpe?g|gif|png|mp3|wav|mp4)$/i.test(file.name) === false  ) {
       return;
      } else {
        if (/\.(jpe?g|gif|png)$/i.test(file.name) === true  ) {
          this.media.push({media: file, mediaType: 0, mediaSizeMB: fileSize});
        }
        if ( /\.(mp4)$/i.test(file.name) === true  ) { 
          this.media.push({media: file, mediaType: 1, mediaSizeMB: fileSize});
        }
        if ( /\.(mp3|wav)$/i.test(file.name) === true  ) {
          this.media.push({media: file, mediaType: 2, mediaSizeMB: fileSize});
        }
      };
   
  }

  remove(index) {
    if (index !== -1) {
      this.media.splice(index, 1);
    } 
  }


  // uploadFile(event: any) {
  //   let files = event.target.files;


  //   for(let newFile of files) {
  //     const fileSize = newFile.size/1024/1024;

  //     if (fileSize > 10) {
  //     return;
  //   }
  //     // if ( /\.(jpe?g|gif|png|mp3|wav|mp4)$/i.test(newFile.name) === false  ) {
  //     //   event.srcElement.value = null;
  //     // } else {
  //     //   this.form.patchValue({
  //     //   image: newFile
  //     // });
  //     // this.form.get('image').updateValueAndValidity();
  //     // }
  //     console.log('got here', newFile.name)
  //     if ( /\.(mp3|wav)$/i.test(newFile.name) === true  ) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //       const mp3 = new Audio();
  //       mp3.src = e.target.result;
  //       this.mp3 = this.domSanitizer.bypassSecurityTrustUrl(e.target.result);
  //       this.image = e.target.result;
  //       this.media.push({media: e.target.result, mediaType: 2, mediaSizeMB: fileSize});
  //       }
  //       reader.readAsDataURL(event.target.files[0]);
  //     }
  //     if ( /\.(mp4)$/i.test(newFile.name) === true  ) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //       this.mp4 = this.domSanitizer.bypassSecurityTrustUrl(e.target.result);
  //       this.image = e.target.result;
  //       this.media.push({media: e.target.result, mediaType: 2, mediaSizeMB: fileSize})
  //       }
  //       reader.readAsDataURL(event.target.files[0]);

  //     }

  //     if ( /\.(jpe?g|gif|png)$/i.test(newFile.name) === true  ) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         const image = new Image();
  //         image.src = e.target.result;
  //         const imgBase64Path = e.target.result;
     
  //         this.image = imgBase64Path;
  //         this.media.push({media: e.target.result, mediaType: 2, mediaSizeMB: fileSize})
  //       };
  //       reader.readAsDataURL(event.target.files[0]);
  //     }
  //   }
  // }


}
