import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BehaviorSubject, map } from 'rxjs';

enum ScreenType {
  SignIn = 'Sign In',
  Register = 'Register',
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, ReactiveFormsModule, AsyncPipe],
})
export class AuthPage {
  screenType = ScreenType;
  form: FormGroup;
  private _screenSubject = new BehaviorSubject(ScreenType.SignIn);
  screen$ = this._screenSubject.asObservable();

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      firstName: null,
      lastName: null,
      userName: [null, { validators: [Validators.required] }],
      password: [
        null,
        { validators: [Validators.minLength(6), Validators.required] },
      ],
    });
  }

  ngOnInit() {
    const firstNameControl = this.form.get('firstName');
    const lastNameControl = this.form.get('lastName');

    if (firstNameControl && lastNameControl) {
      this.requiredIfRegister(firstNameControl);
      this.requiredIfRegister(lastNameControl);
    }
  }

  handleClick(screenType: ScreenType) {
    this.changeScreen(screenType);
  }

  changeScreen(screenType: ScreenType) {
    this.form.reset();
    this._screenSubject.next(screenType);
  }

  requiredIfRegister(control: AbstractControl) {
    console.log('Registered!');
    return this._screenSubject.pipe(
      map((screen) => {
        return screen === ScreenType.Register
          ? Validators.required(control)
          : null;
      })
    );
  }

  submitForm(screenType: ScreenType, formValue: any) {
    console.log(screenType);
    console.log(formValue);
    // API Call
  }
}
