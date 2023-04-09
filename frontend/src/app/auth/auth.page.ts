import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

type Screen = 'Sign In' | 'Register' | 'Forgot Password';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, NgIf],
})
export class AuthPage {
  screen: Screen = 'Sign In';
  isLoading: boolean = false;
  // constructor(private fb: FormBuilder) {
  //   this.formData = this.fb.group({
  //     name: ['', [Validators.required]],
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', [Validators.required]],
  //   });
  // }

  changeScreen(screenType: Screen) {
    this.screen = screenType;
  }

  handleClick(screenType: Screen) {} //
}
