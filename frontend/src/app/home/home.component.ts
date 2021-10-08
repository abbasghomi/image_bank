import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthServiceService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null){
      this.authService.setIsLoggedIn(true);
      this.router.navigateByUrl('/dashboard');
    }
  }

}
