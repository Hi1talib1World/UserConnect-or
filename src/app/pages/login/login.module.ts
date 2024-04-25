import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginPage } from './login.page';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  declarations: [LoginPage],
  imports: [
    CommonModule,
    FormsModule,
    LoginRoutingModule
  ],
  exports: [LoginPage]
})
export class LoginModule { }
