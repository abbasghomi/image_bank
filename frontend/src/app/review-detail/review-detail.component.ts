import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ReviewService } from './../services/review.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-review-detail',
  templateUrl: './review-detail.component.html',
  styleUrls: ['./review-detail.component.css']
})
export class ReviewDetailComponent implements OnInit{
  layer: any;
  image: any;
  imageData: any;
  layerImageData: any;
  classes : any;
  labels : any;
  layerId:any = -1;

  formGroup = this.fb.group({
    classId:['', Validators.required],
    labelId:['', Validators.required],
    layerThumbnail:['', Validators.required],
    x:['', Validators.required],
    y:['', Validators.required],
    width:['', Validators.required],
    height:['', Validators.required],
  });

  constructor(private reviewService: ReviewService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService, private fb:FormBuilder,) {

  }

  ngOnInit(): void {
    this.layerId = this.route.snapshot.paramMap.get('id')!;

    this.reviewService.getById(this.layerId).subscribe(
      (res: any) => {
        console.log(res);
        if(res.status == 200) {
          this.layer = res.layer;
          this.image = res.image;
          this.classes = res.classes;
          this.labels = res.labels;
          this.imageData = res.imagedata;
          this.layerImageData = res.layer.thumbnail;

          this.formGroup.controls.classId.setValue(res.layer.class_id);
          this.formGroup.controls.labelId.setValue(res.layer.label_id);

          this.formGroup.controls.imageData.setValue(res.imagedata);
        } else {
           this.toastr.error('getting Review detail failed.');
        }
      },
      err => {
        this.toastr.error('Getting Review detail failed.');
      }
    );
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

  updateProcess(){
    console.log(this.formGroup);

    if(this.formGroup.valid){
      this.reviewService.update(this.layerId, this.formGroup.value).subscribe(
        (res: any) => {
          if(res.status == 200) {
            this.router.navigateByUrl('/review-labels');
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
