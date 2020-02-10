import { Component } from '@angular/core';
import {UserService} from './services/users.service';
import {User} from './models/user';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

declare var M: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[UserService]
})
export class AppComponent {
  public title = 'Teachers App';
  public user: User;
  public user_register: User;
  public identity = null;
  public token = null;

  constructor(private  userService: UserService, private router: Router){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
  }

  ngOnInit(){
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this.router.navigate(['/']);
    M.toast({html:'Logout successfully, thanks for you visit.'});
  }

  public onSubmitLogin(form: NgForm){
    const params ={
      email: form.value.email,
      password: form.value.password,
      gethash: true
    }
      //Get datas user
      this.userService.signUp(form.value)
        .subscribe(
          response =>{
            const identity = response['user'];
            this.identity = identity;
            if(this.token!=null){
              M.toast({html:'Ok login'});
            }else{
              //Create element token
              localStorage.setItem('identity',JSON.stringify(identity));
              //Get Token
              this.userService.signUp(params)
                .subscribe(
                  res => {
                    const  token = res['token'];
                    this.token = token;
                    if(this.token.length <= 0){
                      M.toast({html:'Error login'});
                    }else{
                      localStorage.setItem('token',token);
                      this.user = new User('','','','','','ROLE_USER','');
                    }
                  }, err => {
                    M.toast({html:'Not login'});
                  }
                );
            }
            M.toast({html:'Login Successfully'});
          },
          error =>{
            M.toast({html:'Not login'});
          }
        );
  }

  onSubmitRegister(){
    
    const params ={
      name: this.user_register.name,
      surname: this.user_register.surname,
      email: this.user_register.email,
      password: this.user_register.password,
      role: 'ROLE_USER',
      image: ''
    }

    this.userService.register(params).subscribe(
      response=>{
        const user = response['user'];
        this.user_register = user;
        if(!user._id){
          M.toast({html:'Not register'});
        }else{
          M.toast({html:'User register successfully. You can login use: '+this.user_register.email});
          this.user_register = new User('','','','','','ROLE_USER','');
        }
      },
      error=>{
        M.toast({html:'Not register'});}
      )
  }
}
