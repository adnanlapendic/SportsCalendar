import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShareDataService } from 'src/app/services/share-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  showEmailVerifiedMsg: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private afAuth: AngularFireAuth,
    private data: ShareDataService,
    public auth: AuthService,
    private ngxLoader: NgxUiLoaderService
  ) {}

  submitted = false;
  loginError: string;
  ngOnInit() {}

  loginForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required],
  });

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.ngxLoader.start();
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    this.auth
      .login(email, password)
      .then(() => {
        if (!this.afAuth.auth.currentUser?.emailVerified) {
          this.showEmailVerifiedMsg = true;
        }
        this.ngxLoader.stop();
      })
      .catch((error) => {
        this.loginError = error.message;
        this.ngxLoader.stop();
      });
  }

  loginWithGoogle() {
    this.ngxLoader.start();
    this.auth
      .loginWithGoogle()
      .then(() => {
        this.ngxLoader.stop();
      })
      .catch((error) => {
        this.loginError = error.message;
        this.ngxLoader.stop();
      });
  }

  loginWithFacebook() {
    this.ngxLoader.start();
    this.auth
      .loginWithFacebook()
      .then(() => {
        this.ngxLoader.stop();
      })
      .catch((error) => {
        this.loginError = error.message;
        this.ngxLoader.stop();
      });
  }

  get f() {
    return this.loginForm.controls;
  }

  sendVerificationLink() {
    this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
      this.router.navigate(['confirm-email']);
    });
  }

  ngOnDestroy(): void {
    this.data.changeMessage(true);
  }
}
