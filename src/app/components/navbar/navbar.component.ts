import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isUserLoggedIn: boolean;
  currentUser: User;

  @Input()
  isDashboardComponentAcivated: boolean;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
  }

  ngOnChanges() {
    this.isDashboardComponentAcivated = true;
  }

  logout(): void {
    this.auth.signOut().then(() => {
      this.ngOnInit();
    });
  }
}
