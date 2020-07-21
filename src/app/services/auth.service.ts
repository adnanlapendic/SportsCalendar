import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User, Role } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User>;
  currentUser: User;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user: any) => {
        if (user) {
          this.currentUser = user;
          return this.firestore.doc<User>(`users/${user.id}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async registerUser(user: any) {
    const userWithCredentials = await this.afAuth.auth.createUserWithEmailAndPassword(
      user.email,
      user.password
    );
    const createdUser = userWithCredentials.user;
    user.uid = createdUser.uid;
    user.displayName = user.firstName + ' ' + user.lastName;
    user.phoneNumber = null;
    user.photoURL = null;
    this.sendVerificationMail(user);
    this.updateCurrentUserData(user);
  }

  async login(email: string, password: string) {
    const usercredential = await this.afAuth.auth.signInWithEmailAndPassword(
      email,
      password
    );

    if (usercredential) {
      const itemDoc = await this.firestore.doc<User>(
        `users/${usercredential.user.uid}`
      );
      const user = await itemDoc.valueChanges();
      user.subscribe((data) => {
        localStorage.setItem('sc_user', JSON.stringify(data));
        if (usercredential.user.emailVerified) {
          this.router.navigate(['/']);
        } else {
          return;
        }
      });
    }
  }

  async loginWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    const user: any = credential.user;
    user.role = Role.ATHLETE;
    return await this.updateCurrentUserData(user);
  }

  async loginWithFacebook() {
    const provider = new auth.FacebookAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    const user: any = credential.user;
    user.role = Role.ATHLETE;
    return await this.updateCurrentUserData(user);
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('sc_user');
    return this.router.navigate(['/']);
  }

  // Send email verfificaiton when new user sign up
  private sendVerificationMail(user: firebase.User) {
    if (!user.emailVerified) {
      this.afAuth.auth.currentUser.sendEmailVerification().then((data) => {
        this.router.navigate(['confirm-email']);
      });
    }
  }

  private async updateCurrentUserData(user: any) {
    const { uid, email, displayName, phoneNumber, photoURL } = user;
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(
      `users/${uid}`
    );

    const data = {
      uid,
      email,
      name: displayName,
      phoneNumber,
      photoURL,
      address: null,
      role: user.role ? user.role : null,
    };

    localStorage.setItem('sc_user', JSON.stringify(data));
    this.router.navigate(['/']);
    return await userRef.set(data, { merge: true });
  }

  async editUser(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.firestore.doc(
      `users/${user.uid}`
    );
    localStorage.setItem('sc_user', JSON.stringify(user));
    return await userRef.set(user, { merge: true });
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('sc_user'));
  }
}
