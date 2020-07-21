import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AthleteComponent } from './components/athlete/athlete.component';
import { PersonalCoachComponent } from './components/personal-coach/personal-coach.component';
import { SportFieldProviderComponent } from './components/sport-field-provider/sport-field-provider.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ConfirmEmailComponent } from './components/auth/confirm-email/confirm-email.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'athlete', component: AthleteComponent },
  { path: 'personal-coach', component: PersonalCoachComponent },
  { path: 'sport-field-provider', component: SportFieldProviderComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
