import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LabelingService } from '../services/labeling.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-labeling',
  templateUrl: './labeling.component.html',
  styleUrls: ['./labeling.component.css']
})
export class LabelingComponent implements OnInit {
  items : any;
  classes : any;
  labels : any;

  imageUrl: string ='';

  selectedFile!: ImageSnippet;

  formGroup = this.fb.group({
    imageInput:['', Validators.required],
    image:['', Validators.required],
    classId:['', Validators.required],
    labelId:['', Validators.required],
    layerThumbnail:['', Validators.required],
    x:['', Validators.required],
    y:['', Validators.required],
    width:['', Validators.required],
    height:['', Validators.required],
  });

  page : number = 0;
  limit : number = 0;

  constructor(private labelingService: LabelingService, private toastr: ToastrService, private fb:FormBuilder,) {

  }


  ngOnInit(): void {
    this.getAll(this.page);
  }

  processFile(imageInput: any, event: any) {
    this.imgChangeEvt = event;

    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (e: any) => {
      this.selectedFile = new ImageSnippet(e.target.result, file);
      this.selectedFile.pending = true;
    });

    reader.addEventListener('loadend', (e: any) => {
      this.formGroup.controls['image'].setValue(this.selectedFile.src);
      console.log(this.selectedFile);
    });

    reader.readAsDataURL(file);

  }

  changeClass(e: any) {
    this.classes.setValue(e.target.value, {
      onlySelf: true
    })
  }

  changeLabel(e: any) {
    this.labels.setValue(e.target.value, {
      onlySelf: true
    })
  }

  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  layerX: number = 0;
  layerY: number = 0;
  layerWidth: number = 0;
  layerHeight: number = 0;

    cropImg(e: ImageCroppedEvent) {
      console.log(e);
      this.cropImgPreview = e.base64;
      this.layerX=e.imagePosition.x1;
      this.layerY=e.imagePosition.y1;
      this.layerWidth=e.width;
      this.layerHeight=e.height;

      this.formGroup.controls['x'].setValue(this.layerX);
      this.formGroup.controls['y'].setValue(this.layerY);
      this.formGroup.controls['width'].setValue(this.layerWidth);
      this.formGroup.controls['height'].setValue(this.layerHeight);
      this.formGroup.controls['layerThumbnail'].setValue(this.cropImgPreview);
    }

    imgLoad() {
        // display cropper tool
    }

    initCropper() {
        // init cropper
    }

    imgFailed() {
        // error msg
    }

  getAll(page:number){
    this.page=page;
      this.labelingService.getAll(this.page).subscribe(
        (res: any) => {
          if(res.status == 200) {
            console.log(res);
            this.classes = res.classes;
            this.labels = res.labels;
            this.page = res.currentpage;
            this.limit = res.limit;
          } else {
             this.toastr.error('Getting Labelings failed.');
          }
        },
        err => {
          this.toastr.error('Getting Labelings failed.');
        }
      );
  }

  registerProcess(){
    console.log(this.formGroup);

    if(this.formGroup.valid){
      this.labelingService.register(this.formGroup.value).subscribe(
        (res: any) => {
          if(res.status == 200) {
            this.toastr.success('Labeling created!', 'Labeling registration successful.');
            this.getAll(this.page);
          } else {
             this.toastr.error('Labeling registration failed.');
          }
        },
        err => {
          this.toastr.error('Labeling registration failed.');
        }
      );
    }
  }
}
