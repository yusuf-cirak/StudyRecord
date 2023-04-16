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
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Observable, of } from 'rxjs';
import { User } from '../../api/user';
import { userSelector } from 'src/app/shared/state/user/user.selectors';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.page.html',
  styleUrls: ['./user-update.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, NgIf, ReactiveFormsModule],
  providers: [ImageService],
})
export class UserUpdatePage implements OnInit {
  user$: Observable<User>;
  updateForm: FormGroup<any>;
  formIsEdited = false;

  changePassword = false;

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private imageService: ImageService
  ) {
    this.user$ = this.store.select(userSelector);

    this.updateForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      photo: [''],
    });
  }

  ngOnInit() {
    this.user$
      .subscribe((user) => {
        this.updateForm.patchValue({
          userName: user.userName,
          photo: user.photo,
        });
      })
      .unsubscribe();
  }

  submitForm() {}

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
}
