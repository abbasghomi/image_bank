import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReviewService } from './../services/review.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-review-labels',
  templateUrl: './review-labels.component.html',
  styleUrls: ['./review-labels.component.css']
})
export class ReviewLabelsComponent implements OnInit {
  items : any;
  classes : any;
  labels : any;

  page : number = 0;
  limit : number = 0;
  totalPagesCount = 0;
  pageIndexes: Array<number> = [];

  constructor(private reviewService: ReviewService, private router: Router, private toastr: ToastrService, private fb:FormBuilder,) {

  }

  ngOnInit(): void {
    this.getAll(this.page);
  }

  editRow(id: any, rowId: any){
    this.router.navigateByUrl(`/review-detail/${id}`);
  }

  deleteRow(id: any, rowId: any){
    this.reviewService.delete(id).subscribe(
      (res: any) => {
        if(res.status == 200) {
          this.getAll(this.page);
        } else {
           this.toastr.error('Deleting Review failed.');
        }
      },
      err => {
        this.toastr.error('Deleting Review failed.');
      }
    );

  }

  getAll(page:number){
    this.page=page;
      this.reviewService.getAll(this.page).subscribe(
        (res: any) => {
          if(res.status == 200) {
            console.log(res);
            this.items = res.items;
            this.classes = res.classes;
            this.labels = res.labels;
            this.page = res.currentpage;
            this.limit = res.limit;
            this.totalPagesCount = res.pagecount;
            this.pageIndexes= Array(this.totalPagesCount).fill(0).map((x,i)=>i+1);
          } else {
             this.toastr.error('Getting Reviews failed.');
          }
        },
        err => {
          this.toastr.error('Getting Reviews failed.');
        }
      );
  }

  getPaginationWithIndex(index: number) {
    this.getAll(index);
  }

  nextClick(){
    console.log(this.page);
    if(this.page < this.totalPagesCount){
      this.getAll(++this.page);
    }
    console.log(this.page);
  }

  previousClick(){
    console.log(this.page);
    if(this.page > 1){
      this.getAll(--this.page);
    }
    console.log(this.page);
  }

  active(index: number) {
    if(this.page == index ){
      return {
        active: true
      };
    }
    return {
      active: false
    };
  }

  getClassName(index: number) {
    console.log(this.classes.filter((x: { id: number; }) => x.id === index).map((x: { name: any; }) => x.name));
    return {
      classname: this.classes.filter((x: { id: number; }) => x.id === index).map((x: { name: any; }) => x.name)
    };
  }

  getLabelName(index: number) {
    console.log(this.labels.filter((x: { id: number; }) => x.id === index).map((x: { name: any; }) => x.name));

    return {
      labelname: this.labels.filter((x: { id: number; }) => x.id === index).map((x: { name: any; }) => x.name)
    };
  }

}
