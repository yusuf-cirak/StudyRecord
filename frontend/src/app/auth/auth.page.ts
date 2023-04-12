import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';

type ScreenType = 'Sign In' | 'Register';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, ReactiveFormsModule, AsyncPipe],
})
export class AuthPage {
  form: FormGroup;

  // Subject to change form validators reactively
  private screen$ = new BehaviorSubject<ScreenType>('Sign In');
  private subscriptions = new Subscription();
  get screen() {
    return this.screen$.getValue();
  }
  constructor(private formBuilder: FormBuilder) {
    // Initializing the form. userName and password are always required

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

  ngOnInit() {
    const firstNameControl = this.form.get('firstName');
    const lastNameControl = this.form.get('lastName');

    if (firstNameControl && lastNameControl) {
      const firstNameSubscription = this.requiredIfRegister(firstNameControl);
      const lastNameSubscription = this.requiredIfRegister(lastNameControl);

      this.subscriptions.add(firstNameSubscription);
      this.subscriptions.add(lastNameSubscription);
    }
  }

  getControl(controlName: string) {
    return this.form.controls[controlName];
  }

  handleClick(screenType: ScreenType) {
    this.changeScreen(screenType);
  }

  changeScreen(screenType: ScreenType) {
    this.form.reset();
    this.screen$.next(screenType);
  }

  requiredIfRegister(control: AbstractControl) {
    return this.screen$.pipe().subscribe((screen) => {
      if (screen && screen === 'Register') {
        control.addValidators(Validators.required);
      } else {
        control.removeValidators(Validators.required);
      }
      control.updateValueAndValidity();
    });
  }

  submitForm(screenType: ScreenType, formValue: any) {
    console.log(screenType);
    console.log(formValue);
    // API Call
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
