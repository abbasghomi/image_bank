import { LabelsService } from './../services/labels.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {
  labels : any;

  formGroup = this.fb.group({
    name:['', Validators.required],
  });

  page : number = 0;
  limit : number = 0;
  totalPagesCount = 0;
  pageIndexes: Array<number> = [];

  constructor(private labelsService: LabelsService, private toastr: ToastrService, private fb:FormBuilder,) { }

  ngOnInit(): void {
    this.getAll(this.page);
  }

  deleteRow(id: any, rowId: any){
    this.labelsService.delete(id).subscribe(
      (res: any) => {
        if(res.status == 200) {
          this.getAll(this.page);
        } else {
           this.toastr.error('Deleting label failed.');
        }
      },
      err => {
        this.toastr.error('Deleting label failed.');
      }
    );

  }

  getAll(page:number){
    this.page=page;
      this.labelsService.getAll(this.page).subscribe(
        (res: any) => {
          if(res.status == 200) {
            console.log(res);
            this.labels = res.items;
            this.page = res.currentpage;
            this.limit = res.limit;
            this.totalPagesCount = res.pagecount;
            this.pageIndexes= Array(this.totalPagesCount).fill(0).map((x,i)=>i+1);
          } else {
             this.toastr.error('Getting labels failed.');
          }
        },
        err => {
          this.toastr.error('Getting labels failed.');
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

  registerProcess(){
    console.log(this.formGroup);
    if(this.formGroup.valid){
      this.labelsService.register(this.formGroup.value).subscribe(
        (res: any) => {
          if(res.status == 200) {
            this.formGroup.reset();
            this.toastr.success('Label created!', 'Label registration successful.');
            this.getAll(this.page);
          } else {
             this.toastr.error('Label registration failed.');
          }
        },
        err => {
          this.toastr.error('Label registration failed.');
        }
      );
    }
  }

}
