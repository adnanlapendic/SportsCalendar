import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
})
export class ConfirmEmailComponent implements OnInit {
  currentUser: any;
  showErrorMessage: boolean = false;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    public toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.afAuth.user.subscribe((data) => {
      this.currentUser = data;
    });
  }

  async navigateToLogin() {
    const reload = await this.afAuth.auth.currentUser.reload();
    this.ngxLoader.start();
    this.afAuth.user.subscribe((data) => {
      this.currentUser = data;
      if (this.currentUser.emailVerified === true) {
        this.router.navigate(['login']);
      } else {
        this.showErrorMessage = true;
      }
      this.ngxLoader.stop();
    });
  }

  sendVerificationLink() {
    this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
      this.toastService.show(
        'New verification link has been sent to your email.',
        {
          classname: 'bg-success text-light',
          delay: 5000,
          autohide: true,
          headertext: 'My Sports Calendar',
        }
      );
    });
  }
}
