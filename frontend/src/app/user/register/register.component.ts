import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formGroup = this.fb.group({
    username:['', Validators.required],
    password:['',[Validators.required,Validators.minLength(4)]],
    name:['', Validators.required],
    family:['', Validators.required],
    email:['', Validators.required],
  });

  constructor(private authService: AuthServiceService, private router: Router, private toastr: ToastrService, private fb:FormBuilder,) { }

  ngOnInit(): void {
  }

  registerProcess(){
    console.log(this.formGroup);
    if(this.formGroup.valid){
      console.log('is valid');
      this.authService.register(this.formGroup.value).subscribe(
        (res: any) => {
          console.log('res arrived');
          console.log(res);
          console.log(res.status);
          if(res.status == 200) {
            this.formGroup.reset();
            this.toastr.success('New user created!', 'Registration successful.');
            this.router.navigate(['/user/login']);

          } else {
            console.log(res);
             this.toastr.error('Registration failed.');
          }
        },
        err => {
          this.toastr.error('Registration failed.');
        }
      );
    }
  }

}
