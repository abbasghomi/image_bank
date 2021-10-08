import { Router } from '@angular/router';
import { AuthServiceService } from './../../services/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup = this.fb.group({
    username:['', Validators.required],
    password:['',[Validators.required,Validators.minLength(4)]],
  });

  constructor(private authService: AuthServiceService, private router: Router, private toastr: ToastrService, private fb:FormBuilder,) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null){
      this.authService.setIsLoggedIn(true);
      this.router.navigateByUrl('/dashboard');
    }else{
      this.authService.setIsLoggedIn(false);
    }
  }

  loginProcess(){
    if(this.formGroup.valid){
      this.authService.login(this.formGroup.value).subscribe(
        (res: any) => {
          this.authService.setIsLoggedIn(true);
          localStorage.setItem('token', res.accessToken);

          this.router.navigateByUrl('/dashboard');
        },
        err => {
          this.toastr.error(err.error.error);
        }
      );
    }
  }

}
