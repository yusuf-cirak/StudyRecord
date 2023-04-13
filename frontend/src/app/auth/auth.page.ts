import { AuthService } from './../core/services/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientService } from '../shared/services/http-client.service';

type ScreenType = 'Sign In' | 'Register';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, ReactiveFormsModule, HttpClientModule],
  providers: [HttpClientService, AuthService],
})
export class AuthPage {
  form!: FormGroup;

  // Subject to change form validators reactively
  private screen$ = new BehaviorSubject<ScreenType>('Sign In');
  private subscriptions = new Subscription();
  get screen() {
    return this.screen$.getValue();
  }
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    // Initializing the form. userName and password are always required
    this.initializeForm();
  }

  ngOnInit() {
    this.registerValidators();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  changeScreen(screenType: ScreenType) {
    this.form.reset();
    this.screen$.next(screenType);
  }

  submitForm(screenType: ScreenType, formValue: any) {
    console.log(screenType);
    console.log(formValue);
    // API Call
    if (screenType === 'Register') {
      const registerSubscription = this.authService
        .register({
          first_name: formValue.firstName,
          last_name: formValue.lastName,
          user_name: formValue.userName,
          password: formValue.password,
        })
        .subscribe((res) => console.log('API Response: ' + res));

      this.subscriptions.add(registerSubscription);
    } else {
      const loginSubscription = this.authService
        .login({
          user_name: formValue.userName,
          password: formValue.password,
        })
        .subscribe((res) => console.log(res));

      this.subscriptions.add(loginSubscription);
    }
  }

  private initializeForm() {
    this.form = this.formBuilder.group({
      firstName: [null, Validators.minLength(2)],
      lastName: [null, Validators.minLength(2)],
      userName: [null, { validators: [Validators.required] }],
      password: [
        null,
        { validators: [Validators.minLength(6), Validators.required] },
      ],
    });
  }

  private requiredIfRegister(control: AbstractControl) {
    return this.screen$.pipe().subscribe((screen) => {
      if (screen && screen === 'Register') {
        control.addValidators(Validators.required);
      } else {
        control.removeValidators(Validators.required);
      }
      control.updateValueAndValidity();
    });
  }

  private registerValidators() {
    const firstNameControl = this.form.get('firstName');
    const lastNameControl = this.form.get('lastName');

    if (firstNameControl && lastNameControl) {
      const firstNameSubscription = this.requiredIfRegister(firstNameControl);
      const lastNameSubscription = this.requiredIfRegister(lastNameControl);

      this.subscriptions.add(firstNameSubscription);
      this.subscriptions.add(lastNameSubscription);
    }
  }
}
