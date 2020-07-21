import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HomeComponent } from './components/home/home.component';
import { UserService } from './services/user.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SportService } from './services/sport.service';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TermResultsComponent } from './components/home/term-results/term-results.component';
import { PersonalCoachComponent } from './components/personal-coach/personal-coach.component';
import { SportFieldProviderComponent } from './components/sport-field-provider/sport-field-provider.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AthleteComponent } from './components/athlete/athlete.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BookingService } from './services/booking.service';
import { AuthService } from './services/auth.service';
import { ShareDataService } from './services/share-data.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CalendarComponent } from './components/dashboard/calendar/calendar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { DetailViewComponent } from './components/home/detail-view/detail-view.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ToastComponent } from './components/toast/toast.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from './services/toast.service';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from 'ngx-ui-loader';
import { ConfirmEmailComponent } from './components/auth/confirm-email/confirm-email.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  blur: 5,
  delay: 0,
  fastFadeOut: true,
  fgsColor: '#51d048',
  fgsPosition: 'center-center',
  fgsSize: 60,
  fgsType: 'ball-spin-clockwise',
  gap: 24,
  logoPosition: 'center-center',
  logoSize: 120,
  logoUrl: '',
  masterLoaderId: 'master',
  overlayBorderRadius: '0',
  overlayColor: 'rgba(40, 40, 40, 0.8)',
  pbColor: '#51d048',
  pbDirection: 'ltr',
  pbThickness: 4,
  hasProgressBar: true,
  text: 'Please wait...',
  textColor: '#FFFFFF',
  textPosition: 'center-center',
  maxTime: -1,
  minTime: 500,
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    TermResultsComponent,
    PersonalCoachComponent,
    SportFieldProviderComponent,
    LoginComponent,
    RegisterComponent,
    AthleteComponent,
    DashboardComponent,
    CalendarComponent,
    ProfileComponent,
    DetailViewComponent,
    OrdersComponent,
    ToastComponent,
    ConfirmEmailComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'mysportscalendar'),
    AngularFirestoreModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    GooglePlaceModule,
    AngularFireAuthModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FlatpickrModule.forRoot(),
    NgbModalModule,
    GooglePlaceModule,
    AngularFireStorageModule,
    NgbModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
  ],
  providers: [
    UserService,
    SportService,
    BookingService,
    AuthService,
    ShareDataService,
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    ToastService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
