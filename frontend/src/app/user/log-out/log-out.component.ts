import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.css']
})
export class LogOutComponent implements OnInit {

  constructor(private router: Router, private authService: AuthServiceService) { }

  ngOnInit() {
    localStorage.removeItem('token');
    this.authService.setIsLoggedIn(false);
    this.router.navigate(['/user/login']);
  }

}
