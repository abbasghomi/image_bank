import { ClassesService } from './../services/classes.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
})
export class ClassesComponent implements OnInit {
  classes : any;

  formGroup = this.fb.group({
    name:['', Validators.required],
  });

  page : number = 0;
  limit : number = 0;
  totalPagesCount = 0;
  pageIndexes: Array<number> = [];

  constructor(private classesService: ClassesService, private toastr: ToastrService, private fb:FormBuilder,) { }

  ngOnInit(): void {
    this.getAll(this.page);
  }

  deleteRow(id: any, rowId: any){
    this.classesService.delete(id).subscribe(
      (res: any) => {
        if(res.status == 200) {
          this.getAll(this.page);
        } else {
           this.toastr.error('Deleting class failed.');
        }
      },
      err => {
        this.toastr.error('Deleting class failed.');
      }
    );

  }

  getAll(page:number){
      this.page=page;
      this.classesService.getAll(this.page).subscribe(
        (res: any) => {
          if(res.status == 200) {
            this.classes = res.items;
            this.page = res.currentpage;
            this.limit = res.limit;
            this.totalPagesCount = res.pagecount;
            this.pageIndexes= Array(this.totalPagesCount).fill(0).map((x,i)=>i+1);
          } else {
             this.toastr.error('Getting classes failed.');
          }
        },
        err => {
          this.toastr.error('Getting classes failed.');
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
      this.classesService.register(this.formGroup.value).subscribe(
        (res: any) => {
          console.log(res);
          if(res.status == 200) {
            this.formGroup.reset();
            this.toastr.success('Class created!', 'Class registration successful.');
            this.getAll(this.page);
          } else {
             this.toastr.error('Class registration failed.');
          }
        },
        err => {
          this.toastr.error('Class registration failed.');
        }
      );
    }
  }

}
