import { Filesystem } from '@capacitor/filesystem';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Observable, of } from 'rxjs';
import { User } from '../../../api/user';
import { userSelector } from 'src/app/shared/state/user/user.selectors';
import { ImageService } from '../../../services/image.service';
import { UpdateUser } from 'src/app/core/contracts/user/update-user';
import { UserService } from 'src/app/core/services/user.service';
import { updateAction } from 'src/app/shared/state/user/user.actions';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.page.html',
  styleUrls: ['./user-update.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, NgIf, ReactiveFormsModule],
  providers: [ImageService, UserService],
})
export class UserUpdatePage implements OnInit {
  user$: Observable<User>;
  updateForm: FormGroup<any>;

  changePassword = false;

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private userService: UserService,
    private router: Router
  ) {
    this.user$ = this.store.select(userSelector);

    this.updateForm = this.formBuilder.group({
      user_name: ['', [Validators.required, Validators.minLength(3)]],
      photo: ['default'],
    });
  }

  ngOnInit() {
    this.user$
      .subscribe((user) => {
        this.updateForm.patchValue({
          user_name: user.userName,
          photo: user.photo,
        });
      })
      .unsubscribe();
  }

  passwordButtonClickHandler(value: boolean) {
    if (value) {
      this.updateForm.addControl(
        'oldPassword',
        this.formBuilder.control(null, [
          Validators.required,
          Validators.minLength(6),
        ])
      );
      this.updateForm.addControl(
        'newPassword',
        this.formBuilder.control(null, [
          Validators.required,
          Validators.minLength(6),
        ])
      );
      this.changePassword = true;
    } else {
      this.updateForm.removeControl('oldPassword');
      this.updateForm.removeControl('newPassword');
      this.changePassword = false;
    }
  }

  async uploadImageClickHandler() {
    const image = await this.imageService.uploadImage();

    this.updateForm.controls['photo'].setValue(image.base64String);
  }

  submitForm(formValues: UpdateUser) {
    this.userService.update(formValues).subscribe({
      next: () => {
        this.store.dispatch(updateAction({ user: { ...formValues } }));
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
