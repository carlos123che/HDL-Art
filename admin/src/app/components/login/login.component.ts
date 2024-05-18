import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    
    email: string = '';
    password: string = '';

    constructor(private auth : AuthService){}

    ngOnInit(): void{}

    login(){
      // Validate empty data
      if(this.email == '' || this.password == ''){
        alert('Please enter email and password');
        return;
      }
      
      this.auth.login(this.email, this.password);
      // Clear data
      this.email = '';
      this.password = '';
    }
}
