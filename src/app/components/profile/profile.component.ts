import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask,
} from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { BookingService } from 'src/app/services/booking.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  downloadURL: any;
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private bookingService: BookingService,
    private ngxLoader: NgxUiLoaderService
  ) {}
  currentUser: User;
  editProfile: boolean = false;
  uploadPercent: Observable<number>;
  submitted = false;

  editForm = this.fb.group({
    name: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    image: [null, Validators.required],
    city: [null, Validators.required],
    phone: [null],
    address: [null],
    about: [null],
  });

  options = {
    componentRestrictions: {
      country: ['DE'],
    },
  };
  ngOnInit(): void {
    this.ngxLoader.start();
    this.currentUser = this.auth.getCurrentUser();
    const c = this.currentUser;
    this.editForm.get('name').setValue(c.name);
    this.editForm.get('email').setValue(c.email);
    this.editForm.get('image').setValue(c.image);
    this.editForm.get('city').setValue(c.city ? c.city : null);
    this.editForm.get('phone').setValue(c.phone ? c.phone : null);
    this.editForm.get('address').setValue(c.address ? c.address : null);
    this.editForm.get('about').setValue(c.about ? c.about : null);
    this.ngxLoader.stop();
  }

  toggleEditProfile(): void {
    this.editProfile = !this.editProfile;
  }

  async uploadpic(event) {
    const file = event.target.files[0];
    const imageName = 'img' + Date.now();
    const filePath = `images/${imageName}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((data) => {
            this.downloadURL = data;

            if (this.downloadURL) {
              this.bookingService.updateUserImageInTerms(
                this.currentUser.uid,
                this.downloadURL
              );
            }
          });
        })
      )
      .subscribe((data) => {});
  }

  update() {
    this.ngxLoader.start();
    const user: User = this.editForm.value;
    user.uid = this.currentUser.uid;
    user.role = this.currentUser.role;
    user.image = this.downloadURL ? this.downloadURL : this.currentUser.image;
    this.auth.editUser(user).then((data) => {
      this.currentUser = user;
      this.toggleEditProfile();
      this.ngxLoader.stop();
    });
  }

  cancel() {
    this.currentUser = this.auth.getCurrentUser();
    this.toggleEditProfile();
    this.downloadURL = null;
  }

  public handleAddressChange(address: any) {
    this.editForm.get('city').setValue(address.name);
  }

  get f() {
    return this.editForm.controls;
  }
}
