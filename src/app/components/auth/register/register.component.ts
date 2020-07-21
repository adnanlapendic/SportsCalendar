import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Role } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private ngxLoader: NgxUiLoaderService
  ) {}
  submitted = false;
  roles: Role;
  registerError: string;
  registerForm = this.fb.group(
    {
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      role: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, Validators.required],
      termsAndConditions: [null, Validators.required],
      dataProtection: [null, Validators.required],
    },
    { validator: this.passwordConfirming.bind(this) }
  );

  ngOnInit(): void {}

  register() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.ngxLoader.start();
    this.auth
      .registerUser(this.registerForm.value)
      .then(() => {
        this.ngxLoader.stop();
      })
      .catch((error) => {
        this.registerError = error.message;
        this.ngxLoader.stop();
      });
  }

  onRoleSelect(event: any) {
    this.registerForm.get('role').setValue(event.target.value);
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordConfirming(c: AbstractControl) {
    if (c.get('password').value !== c.get('confirmPassword').value) {
      this.registerForm.controls['confirmPassword'].setErrors({
        mustMatch: true,
      });
    }
  }
}
