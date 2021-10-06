import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ICreatorMedia } from '../createArtwork.interface';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-create-assets',
  templateUrl: './create-assets.component.html',
  styleUrls: ['./create-assets.component.scss']
})
export class CreateAssetsComponent implements OnInit {
 
  image: any;
  media: Array<ICreatorMedia> = [{
    media: "",
    mediaSizeMB: 0,
    mediaType: 0
  }];
  mp3: any;
  mp4: any;
  constructor(  private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    console.log('image', this.image)
  }

  



  uploadFile(event: any) {
    let files = event.target.files;


    for(let newFile of files) {
      const fileSize = newFile.size/1024/1024;

      if (fileSize > 10) {
      return;
    }
      // if ( /\.(jpe?g|gif|png|mp3|wav|mp4)$/i.test(newFile.name) === false  ) {
      //   event.srcElement.value = null;
      // } else {
      //   this.form.patchValue({
      //   image: newFile
      // });
      // this.form.get('image').updateValueAndValidity();
      // }
      console.log('got here', newFile.name)
      if ( /\.(mp3|wav)$/i.test(newFile.name) === true  ) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
        const mp3 = new Audio();
        mp3.src = e.target.result;
        this.mp3 = this.domSanitizer.bypassSecurityTrustUrl(e.target.result);
        this.image = e.target.result;
        this.media.push({media: e.target.result, mediaType: 2, mediaSizeMB: fileSize});
        }
        reader.readAsDataURL(event.target.files[0]);
      }
      if ( /\.(mp4)$/i.test(newFile.name) === true  ) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
        this.mp4 = this.domSanitizer.bypassSecurityTrustUrl(e.target.result);
        this.image = e.target.result;
        this.media.push({media: e.target.result, mediaType: 2, mediaSizeMB: fileSize})
        }
        reader.readAsDataURL(event.target.files[0]);

      }

      if ( /\.(jpe?g|gif|png)$/i.test(newFile.name) === true  ) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          const imgBase64Path = e.target.result;
     
          this.image = imgBase64Path;
          this.media.push({media: e.target.result, mediaType: 2, mediaSizeMB: fileSize})
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    }
  }


}
